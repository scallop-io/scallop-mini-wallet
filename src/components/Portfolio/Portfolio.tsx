import './portfolio.scss';
import React, { useEffect, type FC } from 'react';
import logo from '@/assets/basic/logo.png';
import { CoinItem } from '@/components/CoinItem/CoinItem';
import useGetAllBalances from '@/hooks/useGetAllBalances';
import { useZkLogin } from '@/contexts';
import { shortenAddress } from '@/utils';
import { ArrowLeftOnRectangle, ClipboardDocument } from '@/assets';
import { useCopyToClipboard } from '@/hooks';
import { useModal } from '@/contexts/modal';

type PortfolioProps = {};

const Portfolio: FC<PortfolioProps> = () => {
  const { address, logout } = useZkLogin();
  const { showDialog } = useModal();
  const getAccountBalance = useGetAllBalances(address, 10 * 1000);
  const [isCopied, setIsCopied] = React.useState(false);
  const copyAddress = useCopyToClipboard(address, setIsCopied);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  const handleLogout = () => {
    showDialog({
      content: 'Are you sure you want to logout?',
      confirmButtonLabel: 'Yes',
      cancelButtonLabel: 'No',
      onConfirm: logout,
    });
  };
  return (
    <div className="portfolio-container">
      <div className="header">
        <div>
          <div className="scallop-icon">
            <img src={logo} alt="scallop logo" />
            <span>Scallop</span>
          </div>
          <div>
            <ArrowLeftOnRectangle onClick={handleLogout} />
          </div>
        </div>
        <div className="address" onClick={copyAddress}>
          {isCopied ? 'Address copied!' : <AddressDisplay address={address} />}
        </div>
      </div>
      <div className="body">
        {getAccountBalance.data?.map((item, index) => {
          return <CoinItem key={index} coinType={item.coinType} totalBalance={item.totalBalance} />;
        })}
      </div>
    </div>
  );
};

const AddressDisplay: FC<{ address: string }> = ({ address }) => (
  <div>
    {shortenAddress(address)}
    <ClipboardDocument />
  </div>
);

export default Portfolio;
