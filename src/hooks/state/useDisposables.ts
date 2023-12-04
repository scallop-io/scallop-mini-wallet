import { useState, useEffect } from 'react';

const useDisposables = () => {
  const [disposables] = useState(() => {
    const disposables: Function[] = [];

    const api = {
      requestAnimationFrame: (...args: Parameters<typeof requestAnimationFrame>) => {
        const raf = requestAnimationFrame(...args);
        api.add(() => cancelAnimationFrame(raf));
      },

      nextFrame: (...args: Parameters<typeof requestAnimationFrame>) => {
        api.requestAnimationFrame(() => {
          api.requestAnimationFrame(...args);
        });
      },

      setTimeout: (...args: Parameters<typeof setTimeout>) => {
        const timer = setTimeout(...args);
        api.add(() => clearTimeout(timer));
      },

      add: (callback: () => void) => {
        disposables.push(callback);
      },

      dispose: () => {
        for (const dispose of disposables.splice(0)) {
          dispose();
        }
      },
    };

    return api;
  });

  useEffect(() => () => disposables.dispose(), [disposables]);

  return disposables;
};

export default useDisposables;
