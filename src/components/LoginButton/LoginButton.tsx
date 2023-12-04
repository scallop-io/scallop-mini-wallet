import React, { useMemo, type FC } from 'react';
import googleLogo from '@/assets/images/oauth-provider/google.svg';
import type { ZkLoginProvider } from '@/accounts/zklogin/provider';
import './loginButton.scss';

export type LoginButtonProps = {
  label: string;
  provider: ZkLoginProvider;
  isLoading?: boolean;
  onClick?: () => void;
};

export const LoginButton: FC<LoginButtonProps> = ({
  label,
  provider,
  isLoading = false,
  onClick,
}: LoginButtonProps) => {
  const buttonLogo = useMemo(() => {
    switch (provider) {
      case 'google':
        return googleLogo;
      default:
        return null;
    }
  }, [provider]);

  return (
    <div className="login-btn-container">
      <button onClick={onClick}>
        {!isLoading && buttonLogo && <img src={buttonLogo} alt={label} />}
        <span className="btn-label">
          {!isLoading && label}
          {isLoading && <span className="spinner">&#8987;</span>}
        </span>
      </button>
    </div>
  );
};
