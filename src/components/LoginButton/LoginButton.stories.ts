import { LoginButton } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'LoginButton',
  component: LoginButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    provider: { control: 'text' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: 'Sign in with Google',
    provider: 'google',
    onClick: () => {
      alert('TEST');
    },
    isLoading: true,
  },
};
