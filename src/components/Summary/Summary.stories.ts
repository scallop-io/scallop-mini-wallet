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
    accountAddress: { control: 'text' },
    balance: { control: 'number' },
  },
} satisfies Meta<typeof Summary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    accountAddress: '0xa6e5e59eef4645c3ee8b48bcc2feaef543790e18bdabb15e3f765482d211305e',
    balance: 2500,
  },
};
