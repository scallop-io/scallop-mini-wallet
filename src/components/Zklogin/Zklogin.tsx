import React, { useEffect } from 'react';
import type { FC } from 'react';
import './zklogin.scss';
import { useZkLogin } from '@/contexts';

type ZkloginProps = {};

const Zklogin: FC<ZkloginProps> = () => {
  const { login } = useZkLogin();
  const handleLogin = () => {
    login().then().catch();
  };
  return (
    <div className="zklogin-container">
      <button onClick={() => handleLogin()}>Signin with google</button>
    </div>
  );
};

export default Zklogin;
