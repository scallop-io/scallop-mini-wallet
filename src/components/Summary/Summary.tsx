import React, { useEffect } from 'react';
import { shortenAddress } from '@/utils/address';
import { ClipboardDocument } from '@/assets/ClipboardDocument';
import { useCopyToClipboard } from '@/hooks';
import { useZkLogin } from '@/contexts';
import type { FC } from 'react';
import './summary.scss';

export type SummaryProps = {
  balance: number;
};

export const Summary: FC<SummaryProps> = () => {
  const [isCopied, setIsCopied] = React.useState(false);
  const { address: accountAddress } = useZkLogin();
  const copyAddress = useCopyToClipboard(accountAddress, setIsCopied);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  }, [isCopied]);

  return (
    <div className="summary-container">
      <div className="address" onClick={copyAddress}>
        {isCopied ? (
          'Address copied!'
        ) : (
          <div>
            {shortenAddress(accountAddress)}
            <ClipboardDocument />
          </div>
        )}
      </div>
    </div>
  );
};
