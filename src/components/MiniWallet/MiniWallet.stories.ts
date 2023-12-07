import { MiniWalletContainer } from './MiniWallet';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MiniWalletContainer',
  component: MiniWalletContainer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    // googleClientID: { control: 'text' },
    initialCoinTypeState: { control: 'object' },
    walletIcon: { control: 'text' },
  },
} satisfies Meta<typeof MiniWalletContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    // googleClientID: '993131426104-ah7qqbp8p73ina6uepib31jj8djf523n.apps.googleusercontent.com',
    initialCoinTypeState: {
      coinTypes: {
        devnet: [],
        testnet: [],
        mainnet: [
          {
            symbol: 'sSUI',
            decimals: 9,
            coinType:
              '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::reserve::MarketCoin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>',
            iconUrl: 'https://app.scallop.io/assets/sSUI-df1cc6de.png',
            active: true,
          },
          {
            symbol: 'sUSDC',
            decimals: 6,
            coinType:
              '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::reserve::MarketCoin<0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN>',
            iconUrl: 'https://app.scallop.io/assets/sUSDC-8cd2f058.png',
            active: true,
          },
        ],
      },
    },
    walletIcon: 'https://app.scallop.io/assets/sSUI-df1cc6de.png',
  },
};
