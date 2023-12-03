import { Summary } from './Summary';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Summary',
  component: Summary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {

    balance: { control: 'number' },
  },
} satisfies Meta<typeof Summary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    balance: 2500,
  },
};
