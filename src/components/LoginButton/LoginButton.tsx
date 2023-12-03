
import React, { useCallback, type FC } from 'react';
import { useZkLogin } from '@/contexts';
import './loginButton.scss';

type LoginButtonProps = {};

export const LoginButton: FC<LoginButtonProps> = () => {
  const { login } = useZkLogin();
  const handleLogin = useCallback(async () => {
    await login();
  }, []);
  return (
    <div className="zklogin-container">
      <button onClick={handleLogin}>Signin with google</button>
    </div>
  );
};