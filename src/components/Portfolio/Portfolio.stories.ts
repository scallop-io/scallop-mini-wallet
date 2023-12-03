import Portfolio from './Portfolio';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Portfolio',
  component: Portfolio,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Portfolio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
