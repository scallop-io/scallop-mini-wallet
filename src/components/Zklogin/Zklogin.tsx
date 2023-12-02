import React from 'react';
import type { FC } from 'react';
import './zklogin.scss';

type ZkloginProps = {};

const Zklogin: FC<ZkloginProps> = () => {
  return (
    <div className="zklogin-container">
      <button>Signin with google</button>
    </div>
  );
};

export default Zklogin;
