import type { ExplorerType } from '@/stores';

export const getTransactionExplorerUrl = (
  explorer: ExplorerType,
  explorerUrl: string,
  networkType: string = 'testnet',
  txHash: string
) => {
  switch (explorer) {
    case 'official':
      return `${explorerUrl}/txblock/${txHash}?network=$${networkType}`;
    case 'suivision':
      return `${explorerUrl}/txblock/${txHash}`;
    case 'suiscan':
      return `${explorerUrl}/tx/${txHash}`;
    default:
      return `https://suivision.xyz/txblock/${txHash}`;
  }
};
