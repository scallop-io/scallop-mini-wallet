import { MiniWallet } from './MiniWallet';
import type { Meta, StoryObj } from '@Storybook/react';


const meta = {
    title: 'MiniWallet',
    component: MiniWallet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
} satisfies Meta<typeof MiniWallet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
    args: {
    },
}