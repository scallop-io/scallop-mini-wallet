import { MiniWalletConainer } from './MiniWallet';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MiniWalletConainer',
  component: MiniWalletConainer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MiniWalletConainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
