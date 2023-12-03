import { LoginButton } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Zklogin',
  component: LoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
