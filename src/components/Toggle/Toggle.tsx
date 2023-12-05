import React, {
  forwardRef,
  type ChangeEvent,
  type DetailedHTMLProps,
  type ForwardedRef,
  type InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import './toggle.scss';
import { useEvent } from '@/hooks';

type BasicToggleProps = {
  checked: boolean;
  disabled?: boolean;
};

export type ToggleProps<T> = DetailedHTMLProps<InputHTMLAttributes<T>, T> & BasicToggleProps;

export const Toggle = forwardRef(
  (
    {
      id,
      className,
      children,
      checked = false,
      disabled,
      onChange,
      ...rest
    }: ToggleProps<HTMLInputElement>,
    ref?: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const handleClick = useEvent((event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (onChange) onChange(event);
    });
    return (
      <div className="toggle-container">
        <label htmlFor={id}>
          <div className="toggle-button">
            <input
              id={id}
              type="checkbox"
              className={classNames(
                className,
                'toggle-checkbox',
                disabled ? 'cursor-default' : 'cursor-pointer'
              )}
              ref={ref}
              onChange={handleClick}
              {...rest}
            />

            <div className={classNames('trail', { checked: checked })}>
              <span className={classNames('dot', { checked: checked })} />
            </div>
            {children}
          </div>
        </label>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
