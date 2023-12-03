import { Zklogin } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Zklogin',
  component: Zklogin,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Zklogin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
