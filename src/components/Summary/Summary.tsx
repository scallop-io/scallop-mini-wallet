import React, { useEffect } from 'react';
import { shortenAddress } from '@/utils/address';
import { ClipboardDocument } from '@/assets/ClipboardDocument';
import { useCopyToClipboard } from '@/hooks';
import type { FC } from 'react';
import './summary.scss';

export type SummaryProps = {
  accountAddress: string;
  balance: number;
};

export const Summary: FC<SummaryProps> = ({ accountAddress, balance }: SummaryProps) => {
  const [isCopied, setIsCopied] = React.useState(false);
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
      <div className="balance">{balance} USD</div>
    </div>
  );
};
