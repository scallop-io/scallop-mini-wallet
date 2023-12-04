import React, {
  useLayoutEffect,
  useState,
  createContext,
  useContext,
  useEffect,
  Fragment,
  useReducer,
  createRef,
  useMemo,
  createElement,
  useId,
} from 'react';
import { useSyncRefs, useEvent, useDisposables, useOutsideClick } from '@/hooks';
import {
  matchHandler,
  isFocusableElement,
  mergeProps,
  forwardRefWithAs,
  getOwnerDocument,
  FocusableMode,
  Keyboard,
} from '@/utils';
import type {
  ReactElement,
  MouseEvent,
  MutableRefObject,
  Dispatch,
  ElementType,
  Ref,
  KeyboardEvent,
} from 'react';
import type { Props } from '@/utils';

enum ActionState {
  Open,
  Closed,
}

enum ActionTypes {
  OpenDropdown,
  CloseDropdown,
}

interface DropdownState {
  actionState: ActionState;
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
}

type Actions = { type: ActionTypes.OpenDropdown; } | { type: ActionTypes.CloseDropdown; };

const reducers: {
  [P in ActionTypes]: (
    state: DropdownState,
    action: Extract<Actions, { type: P; }>
  ) => DropdownState;
} = {
  [ActionTypes.CloseDropdown]: (state) => {
    if (state.actionState === ActionState.Closed) return state;
    return { ...state, actionState: ActionState.Closed };
  },
  [ActionTypes.OpenDropdown]: (state) => {
    if (state.actionState === ActionState.Open) return state;
    return { ...state, actionState: ActionState.Open };
  },
};

const DropdownContext = createContext<[DropdownState, Dispatch<Actions>] | null>(null);
DropdownContext.displayName = 'DropdownContext';
const DropdownActionContext = createContext<ActionState | null>(null);
DropdownActionContext.displayName = 'DropdownActionContext';

const useDropdownContext = (component: string) => {
  const context = useContext(DropdownContext);
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Dropdown /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDropdownContext);
    throw err;
  }
  return context;
};

const useDropdownAction = () => {
  return useContext(DropdownActionContext);
};

// --- Dropdown Container --- //

interface DropdownContainerProps {
  open: boolean;
  close: () => void;
}

const DefaultDropdownContainerTag = Fragment;

const DropdownContainer = forwardRefWithAs(
  <T extends ElementType = typeof DefaultDropdownContainerTag>(
    props: Props<T, DropdownContainerProps>,
    ref: Ref<HTMLElement>
  ): JSX.Element => {
    const dropdownRef = useSyncRefs(ref);
    const [{ actionState, buttonRef, contentRef }, dispatch] = useReducer(
      (state: DropdownState, action: Actions) => {
        return matchHandler(action.type, reducers, state, action);
      },
      {
        actionState: ActionState.Closed,
        buttonRef: createRef(),
        contentRef: createRef(),
      } as DropdownState
    );

    const handleClose = useEvent(() => {
      dispatch({ type: ActionTypes.CloseDropdown });
    });

    const dropdownProps = mergeProps(props, { ref: dropdownRef });
    const { as: component = DefaultDropdownContainerTag, children, ...rest } = dropdownProps;

    // Define slots to expose state to children
    const slot = useMemo<DropdownContainerProps>(
      () => ({ open: actionState === ActionState.Open, close: handleClose }),
      [actionState, handleClose]
    );

    const resolvedChildren = (typeof children === 'function' ? children(slot) : children) as
      | ReactElement
      | ReactElement[];

    // Handle outside click
    useOutsideClick(
      [buttonRef, contentRef],
      (event, target) => {
        dispatch({ type: ActionTypes.CloseDropdown });
        if (!isFocusableElement(target, FocusableMode.Loose)) {
          event.preventDefault();
          buttonRef.current?.focus();
        }
      },
      actionState === ActionState.Open
    );

    return (
      <DropdownContext.Provider value={[{ actionState, buttonRef, contentRef }, dispatch]}>
        <DropdownActionContext.Provider
          value={matchHandler(actionState, {
            [ActionState.Open]: ActionState.Open,
            [ActionState.Closed]: ActionState.Closed,
          })}
        >
          {createElement(
            component,
            Object.assign({}, component !== Fragment ? rest : undefined),
            resolvedChildren
          )}
        </DropdownActionContext.Provider>
      </DropdownContext.Provider>
    );
  },
  'DropdownContainer'
);

// --- Dropdown Button --- //

interface DropdownButtonProps {
  open: boolean;
}

type DropdownButtonPropsOwnControl = 'type' | 'onKeyDown' | 'onKeyUp' | 'onClick';

const DefaultDropdownButtonTag = 'button';

const resolveType = (props: { type?: string; as?: unknown; }) => {
  if (props.type) return props.type;

  const tag = props.as ?? 'button';
  if (typeof tag === 'string' && tag.toLowerCase() === 'button') return 'button';

  return undefined;
};

const DropdownButton = forwardRefWithAs(
  <T extends ElementType = typeof DefaultDropdownButtonTag>(
    props: Props<T, DropdownButtonProps, DropdownButtonPropsOwnControl>,
    ref: Ref<HTMLButtonElement>
  ): JSX.Element => {
    const internalId = useId();
    const disposables = useDisposables();
    const [type, setType] = useState(() => resolveType(props));
    const [state, dispatch] = useDropdownContext('Dropdown.Button');
    const buttonRef = useSyncRefs(state.buttonRef, ref);

    const handleKeyDown = useEvent((event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keyboard.Space:
        case Keyboard.Enter:
        case Keyboard.ArrowDown:
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: ActionTypes.OpenDropdown });
          break;

        case Keyboard.ArrowUp:
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: ActionTypes.CloseDropdown });
          break;
      }
    });

    const handleKeyUp = useEvent((event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keyboard.Space:
          event.preventDefault();
          break;
      }
    });

    const handleClick = useEvent((event: MouseEvent) => {
      if (props.disabled) return;
      if (state.actionState === ActionState.Open) {
        dispatch({ type: ActionTypes.CloseDropdown });
        disposables.nextFrame(() => state.buttonRef.current?.focus({ preventScroll: true }));
      } else {
        event.preventDefault();
        dispatch({ type: ActionTypes.OpenDropdown });
      }
    });

    const { id = `dropdown-button-${internalId}` } = props;
    const dropdownButtonProps = mergeProps(props, {
      ref: buttonRef,
      id,
      type: type,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onClick: handleClick,
    });
    const { as: component = DefaultDropdownButtonTag, children, ...rest } = dropdownButtonProps;

    // Define slots to expose state to children
    const slot = useMemo<DropdownButtonProps>(
      () => ({ open: state.actionState === ActionState.Open }),
      [state]
    );

    const resolvedChildren = (typeof children === 'function' ? children(slot) : children) as
      | ReactElement
      | ReactElement[];

    useLayoutEffect(() => {
      setType(resolveType(props));
    }, [props.type, props.as]);

    useLayoutEffect(() => {
      if (type) return;
      if (!state.buttonRef.current) return;

      if (
        state.buttonRef.current instanceof HTMLButtonElement &&
        !state.buttonRef.current.hasAttribute('type')
      ) {
        setType('button');
      }
    }, [type, state.buttonRef]);

    return createElement(
      component,
      Object.assign({}, component !== Fragment ? rest : undefined),
      resolvedChildren
    );
  },
  'DropdownButton'
);

// --- Dropdown Content --- //

interface DropdownContentProps {
  open: boolean;
}

type DropdownContentPropsOwnControl = 'onKeyDown' | 'tabIndex';

const DefaultDropdownContentTag = 'div';

const DropdownContent = forwardRefWithAs(
  <T extends ElementType = typeof DefaultDropdownContentTag>(
    props: Props<T, DropdownContentProps, DropdownContentPropsOwnControl>,
    ref: Ref<HTMLDivElement>
  ): JSX.Element => {
    const internalId = useId();
    const dropdownActionState = useDropdownAction();
    const disposables = useDisposables();
    const [state, dispatch] = useDropdownContext('Dropdown.Container');
    const contentRef = useSyncRefs(state.contentRef, ref);

    const ownerDocument = useMemo(() => getOwnerDocument(state.contentRef), [state.contentRef]);

    const visible = (() => {
      if (dropdownActionState !== null) {
        return dropdownActionState === ActionState.Open;
      }

      return state.actionState === ActionState.Open;
    })();

    const handleKeyDown = useEvent((event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keyboard.Space:
        case Keyboard.Escape:
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: ActionTypes.CloseDropdown });
          disposables.nextFrame(() => state.buttonRef.current?.focus({ preventScroll: true }));
          break;
      }
    });

    const handleKeyUp = useEvent((event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keyboard.Space:
          event.preventDefault();
          break;
      }
    });

    const { id = `dropdown-content-${internalId}` } = props;
    const dropdownContainerProps = mergeProps(props, {
      ref: contentRef,
      id,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      tabIndex: 0,
    });
    const { as: component = DefaultDropdownContentTag, children, ...rest } = dropdownContainerProps;

    // Define slots to expose state to children
    const slot = useMemo<DropdownContentProps>(
      () => ({ open: state.actionState === ActionState.Open }),
      [state]
    );

    const resolvedChildren = (typeof children === 'function' ? children(slot) : children) as
      | ReactElement
      | ReactElement[];

    useEffect(() => {
      const content = state.contentRef.current;
      if (!content) return;
      if (state.actionState !== ActionState.Open) return;
      if (content === ownerDocument?.activeElement) return;

      content.focus({ preventScroll: true });
    }, [state.actionState, state.actionState, ownerDocument]);

    return createElement(
      component,
      Object.assign(
        {},
        component !== Fragment ? rest : undefined,
        !visible && { hidden: true, style: { display: 'none' } }
      ),
      resolvedChildren
    );
  },
  'DropdownContent'
);

const Dropdown = Object.assign(DropdownContainer, {
  Button: DropdownButton,
  Content: DropdownContent,
});

export default Dropdown;
