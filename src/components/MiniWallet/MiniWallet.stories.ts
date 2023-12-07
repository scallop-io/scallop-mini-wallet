import { DEFAULT_COINS } from '@/constants/coins';
import { MiniWalletContainer } from './MiniWallet';
import type { CoinTypeLocalStorageState } from '@/stores';
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
  },
} satisfies Meta<typeof MiniWalletContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    // googleClientID: '993131426104-ah7qqbp8p73ina6uepib31jj8djf523n.apps.googleusercontent.com',
    initialCoinTypeState: {
      coinTypes: DEFAULT_COINS as CoinTypeLocalStorageState['coinTypes'],
    },
  },
};
