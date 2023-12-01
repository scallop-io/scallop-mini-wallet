import { CoinItem } from './CoinItem';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'CoinItem',
  component: CoinItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    coinName: { control: 'text' },
    totalBalance: { control: 'number' },
    coinPrice: { control: 'number' },
    usdValue: { control: 'number' },
    lightBackground: { control: 'boolean' },
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
    usdValue: 5000,
    lightBackground: true,
  },
}

