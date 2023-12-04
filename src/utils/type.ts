import type { ReactNode, JSXElementConstructor } from 'react';

export enum FocusableMode {
  /** The element itself must be focusable. */
  Strict,
  /** The element should be inside of a focusable element. */
  Loose,
}

export enum Keyboard {
  Space = ' ',
  Enter = 'Enter',
  Escape = 'Escape',
  Backspace = 'Backspace',
  Delete = 'Delete',

  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',

  Home = 'Home',
  End = 'End',

  PageUp = 'PageUp',
  PageDown = 'PageDown',

  Tab = 'Tab',
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends __
  ? never
  : T extends __
    ? U
    : U extends __
      ? T
      : T | U extends object
        ? (Without<T, U> & U) | (Without<U, T> & T)
        : T | U;

export type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

export type OwnControlProps = 'as' | 'children' | 'className';

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type PropsOf<T extends ReactTag> = T extends React.ElementType
  ? React.ComponentProps<T>
  : never;

// Resolve the properties of the component, but ensure to omit certain properties that own control
export type CleanProps<
  T extends ReactTag,
  TOmitableProps extends PropertyKey = __,
> = TOmitableProps extends __
  ? Omit<PropsOf<T>, OwnControlProps>
  : Omit<PropsOf<T>, TOmitableProps | OwnControlProps>;

// Add certain properties that we control
export type OwnProps<T extends ReactTag, TSlot> = {
  as?: T;
  children?: ReactNode | ((slot: TSlot) => ReactTag) | ((slot: TSlot) => JSX.Element);
  className?: string;
};

export type HasProperty<T extends object, K extends PropertyKey> = T extends never
  ? never
  : K extends keyof T
    ? true
    : never;

// Conditionally override the `className`, to also allow for a function
// if and only if the PropsOf<T> already defines `className`.
// This will allow us to have a TS error on as={Fragment}
type ClassNameOverride<T extends ReactTag, TSlot = {}> =
  // Order is important here, because `never extends true` is `true`...
  true extends HasProperty<PropsOf<T>, 'className'>
    ? { className?: PropsOf<T>['className'] | ((slot: TSlot) => string) }
    : {};

const __ = '';
type __ = typeof __;
// Provide clean TypeScript props, which exposes some of own custom properties.
export type Props<
  T extends ReactTag,
  TSlot = {},
  TOmitableProps extends PropertyKey = __,
> = CleanProps<T, TOmitableProps> & OwnProps<T, TSlot> & ClassNameOverride<T, TSlot>;
