import { ManageToken } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ManageToken',
  component: ManageToken,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ManageToken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
};
