import { useCallback, type MouseEventHandler } from 'react';

const useCopyToClipboard = (textToCopy: string, handleCopy: Function) => {
  return useCallback<MouseEventHandler>(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(textToCopy);
        handleCopy(true);
      } catch (err) {
        // eslint-disable-next-line no-console
      }
    },
    [textToCopy]
  );
};

export default useCopyToClipboard;
