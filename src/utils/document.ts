import { forwardRef } from 'react';
import { matchHandler, FocusableMode } from '@/utils';
import type { MutableRefObject } from 'react';
import type { Props } from '@/utils';

export const contains = (root: Node | null | undefined, n?: Node | null): boolean => {
  if (!root || !n) return false;

  return root.contains(n);
};

/**
 * Get owner document.
 *
 * @param element Target element.
 * @returns Owner document.
 */
export const getOwnerDocument = <T extends Element | MutableRefObject<Element | null>>(
  element: T | null | undefined
) => {
  if (element instanceof Node) return element.ownerDocument;
  if (element && 'current' in element) {
    if (element.current instanceof Node) return element.current.ownerDocument;
  }

  return document;
};

const focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map((selector) => `${selector}:not([tabindex='-1'])`)
  .join(',');

/**
 * Checks if the element is a focusable element of the specified mode.
 *
 * @param element The target element to be check.
 * @param {FocusableMode} mode Two different focusable modes.
 * @returns {boolean} True or false.
 */
export const isFocusableElement = (
  element: HTMLElement,
  mode: FocusableMode = FocusableMode.Strict
) => {
  if (element === getOwnerDocument(element)?.body) return false;

  return matchHandler(mode, {
    [FocusableMode.Strict]: () => {
      return element.matches(focusableSelector);
    },
    [FocusableMode.Loose]: () => {
      let next: HTMLElement | null = element;

      while (next !== null) {
        if (next.matches(focusableSelector)) return true;
        next = next.parentElement;
      }

      return false;
    },
  });
};

/**
 * Get all focusable elements in the specific container.
 *
 * @param container The target container of elements.
 * @returns Focusable elements.
 */
export const getFocusableElements = (container: HTMLElement | null = document.body) => {
  if (container == null) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).sort(
    // We want to move `tabIndex={0}` to the end of the list, this is what the browser does as well.
    (a, z) =>
      Math.sign((a.tabIndex || Number.MAX_SAFE_INTEGER) - (z.tabIndex || Number.MAX_SAFE_INTEGER))
  );
};

/**
 * Merges all provided element properties.
 *
 * @param listOfProps Properties of the element to be merged.
 * @returns new element with properties.
 */
export const mergeProps = (...listOfProps: Props<any, any>[]) => {
  if (listOfProps.length === 0) return {};
  if (listOfProps.length === 1) return listOfProps[0];

  const target: Props<any, any> = {};

  const eventHandlers: Record<
    string,
    ((event: { defaultPrevented: boolean }, ...args: any[]) => void | undefined)[]
  > = {};

  for (const props of listOfProps) {
    for (const prop in props) {
      // Collect event handlers
      if (prop.startsWith('on') && typeof props[prop] === 'function') {
        eventHandlers[prop] ??= [];
        eventHandlers[prop].push(props[prop]);
      } else {
        // Override incoming prop
        target[prop] = props[prop];
      }
    }
  }

  // Do not attach any event handlers when there is a `disabled` or `aria-disabled` prop set.
  if (target.disabled) {
    return Object.assign(
      target,
      Object.fromEntries(Object.keys(eventHandlers).map((eventName) => [eventName, undefined]))
    );
  }

  // Merge event handlers
  for (const eventName in eventHandlers) {
    Object.assign(target, {
      [eventName]: (event: { nativeEvent?: Event; defaultPrevented: boolean }, ...args: any[]) => {
        const handlers = eventHandlers[eventName];

        for (const handler of handlers) {
          if (
            (event instanceof Event || event?.nativeEvent instanceof Event) &&
            event.defaultPrevented
          ) {
            return;
          }

          handler(event, ...args);
        }
      },
    });
  }

  return target;
};

/**
 *
 * @param input The target to be check.
 * @returns {boolean} True or false.
 */
export const isValidElement = (input: any): boolean => {
  if (input == null) return false;
  if (typeof input.type === 'string') return true;
  if (typeof input.type === 'object') return true;
  if (typeof input.type === 'function') return true;
  return false;
};

/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 */
export const forwardRefWithAs = <T extends { name: string; displayName?: string }>(
  component: T,
  name?: string
): T & { displayName: string } => {
  return Object.assign(forwardRef(component as unknown as any) as any, {
    displayName: component.displayName ?? component.name ?? name,
  });
};
