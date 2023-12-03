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
    totalBalance: { control: 'string' },
    coinType: { control: 'text' },
  },
} satisfies Meta<typeof CoinItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    totalBalance: '1000000000',
    coinType: '0xa6e5e59eef4645c3ee8b48bcc2feaef543790e18bdabb15e3f765482d211305e',
  },
};
