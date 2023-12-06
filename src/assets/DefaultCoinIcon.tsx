import React, { type FC } from 'react';

export type Props = React.SVGProps<SVGSVGElement>;
const DefaultCoinIcon: FC<Props> = (props: Props) => {
  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: '#a0b6c4',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 16 16"
      >
        <g clipPath="url(#unstaked_svg__a)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M14.5 4c0 .23-.226.843-1.514 1.487C11.787 6.087 10.026 6.5 8 6.5c-2.027 0-3.787-.414-4.986-1.013C1.726 4.843 1.5 4.23 1.5 4c0-.23.226-.843 1.514-1.487C4.213 1.914 5.974 1.5 8 1.5c2.027 0 3.787.414 4.986 1.013C14.274 3.157 14.5 3.77 14.5 4Zm-.81 2.812C12.24 7.545 10.226 8 8 8c-2.226 0-4.24-.455-5.69-1.188-.673.478-.81.89-.81 1.07 0 .23.226.843 1.514 1.487 1.199.6 2.96 1.013 4.986 1.013 2.027 0 3.787-.414 4.986-1.013 1.288-.644 1.514-1.256 1.514-1.487 0-.18-.137-.592-.81-1.07Zm1.306-.87C15.636 5.365 16 4.703 16 4c0-2.21-3.582-4-8-4S0 1.79 0 4c0 .707.366 1.37 1.01 1.946L1 5.944c-.637.574-1 1.235-1 1.938 0 .717.377 1.389 1.036 1.97L1 9.844c-.637.575-1 1.235-1 1.938 0 2.21 3.582 4 8 4s8-1.79 8-4c0-.708-.368-1.373-1.013-1.95C15.632 9.255 16 8.59 16 7.882c0-.704-.364-1.366-1.004-1.94ZM8 11.881c2.219 0 4.226-.451 5.675-1.18.686.482.825.9.825 1.08 0 .23-.226.843-1.514 1.487-1.199.6-2.96 1.013-4.986 1.013-2.027 0-3.787-.414-4.986-1.013-1.288-.644-1.514-1.256-1.514-1.487 0-.18.14-.598.825-1.08 1.449.729 3.456 1.18 5.675 1.18Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="unstaked_svg__a">
            <path fill="#fff" d="M0 0h16v16H0z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default DefaultCoinIcon;
