import { CoinItem } from './CoinItem';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'CoinItem',
  component: CoinItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    coinName: { control: 'text' },
    totalBalance: { control: 'number' },
    coinPrice: { control: 'number' },
    coinAddress: { control: 'text' },
  },
} satisfies Meta<typeof CoinItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    icon: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579',
    coinName: 'Bitcoin',
    totalBalance: 25,
    coinPrice: 50000,
    coinAddress: '0xa6e5e59eef4645c3ee8b48bcc2feaef543790e18bdabb15e3f765482d211305e',
  },
};
