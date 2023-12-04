import { useRef, useEffect } from 'react';
import { useDocumentEvent } from '@/app/hooks';
import { isFocusableElement, FocusableMode } from '@/app/utils';
import type { MutableRefObject } from 'react';

type Container = MutableRefObject<HTMLElement | null> | HTMLElement | null;
type ContainerCollection = Container[] | Set<Container>;
type ContainerInput = Container | ContainerCollection;

const resolveContainers = (
  containers: ContainerInput | (() => ContainerInput)
): ContainerCollection => {
  if (typeof containers === 'function') {
    return resolveContainers(containers());
  }

  if (Array.isArray(containers)) {
    return containers;
  }

  if (containers instanceof Set) {
    return containers;
  }

  return [containers];
};

const useOutsideClick = (
  containers: ContainerInput | (() => ContainerInput),
  callback: (event: MouseEvent | PointerEvent | FocusEvent, target: HTMLElement) => void,
  enabled: boolean = true
) => {
  const enabledRef = useRef(false);
  const eventTarget = useRef<EventTarget | null>(null);

  const handleOutsideClick = <E extends MouseEvent | PointerEvent | FocusEvent>(
    event: E,
    resolveTarget: (event: E) => HTMLElement | null
  ) => {
    if (event.defaultPrevented) return;

    const target = resolveTarget(event);

    if (target === null) {
      return;
    }

    // Ignore if the target doesn't exist in the DOM anymore
    if (!target.getRootNode().contains(target)) return;

    // Ignore if the target exists in one of the containers
    for (const container of resolveContainers(containers)) {
      if (container === null) continue;

      const domNode = container instanceof HTMLElement ? container : container.current;

      if (domNode?.contains(target)) {
        return;
      }

      if (event.composed && event.composedPath().includes(domNode as EventTarget)) {
        return;
      }
    }

    if (!isFocusableElement(target, FocusableMode.Loose) && target.tabIndex !== -1) {
      event.preventDefault();
    }

    return callback(event, target);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      enabledRef.current = enabled;
    });
  }, [enabled]);

  useDocumentEvent(
    'mousedown',
    (event) => {
      if (enabledRef.current) {
        eventTarget.current = event.composedPath?.()?.[0] || event.target;
      }
    },
    true
  );

  useDocumentEvent(
    'click',
    (event) => {
      if (!eventTarget.current) {
        return;
      }

      handleOutsideClick(event, () => {
        return eventTarget.current as HTMLElement;
      });

      eventTarget.current = null;
    },
    true
  );

  useDocumentEvent(
    'blur',
    (event) =>
      handleOutsideClick(event, () =>
        window.document.activeElement instanceof HTMLIFrameElement
          ? window.document.activeElement
          : null
      ),
    true
  );
};

export default useOutsideClick;
