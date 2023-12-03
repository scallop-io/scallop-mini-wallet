import { ScallopMiniWallet } from './MiniWallet';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ScallopMiniWallet',
  component: ScallopMiniWallet,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ScallopMiniWallet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
