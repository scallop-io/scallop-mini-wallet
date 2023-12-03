import { MiniWalletContainer } from './MiniWallet';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MiniWallet',
  component: MiniWalletContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MiniWalletContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
