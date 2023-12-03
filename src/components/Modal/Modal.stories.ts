import Modal from './Modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
  },
  
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    isOpen: true,
    onCancel: () => {},
    onConfirm: () => {},
    message: 'Modal content',
  },
};
