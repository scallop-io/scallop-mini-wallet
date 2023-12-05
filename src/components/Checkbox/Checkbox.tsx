import './checkbox.scss';
import React, { forwardRef, memo } from 'react';
import classNames from 'classnames';
import type { ChangeEvent, DetailedHTMLProps, ForwardedRef, InputHTMLAttributes } from 'react';

type BasicCheckboxProps = {
  checked: boolean;
  disabled?: boolean;
};

export type CheckboxProps<T> = DetailedHTMLProps<InputHTMLAttributes<T>, T> & BasicCheckboxProps;

const Checkbox = forwardRef(
  (
    {
      className,
      checked = false,
      children,
      disabled,
      onChange,
      ...rest
    }: CheckboxProps<HTMLInputElement>,
    ref?: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const handleClick = (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      if (onChange) onChange(event);
    };

    return (
      <div className="checkbox-container">
        <input
          className="basic-checkbox"
          type="checkbox"
          checked={checked}
          onChange={handleClick}
          disabled={disabled}
          ref={ref}
          {...rest}
        />
        {children}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default memo(Checkbox);
