import MiniWallet from './MiniWallet';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'MiniWallet',
  component: MiniWallet,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MiniWallet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
}

