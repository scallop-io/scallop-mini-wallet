import { Toggle } from './Toggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Toggle',
  component: Toggle,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  }
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};
