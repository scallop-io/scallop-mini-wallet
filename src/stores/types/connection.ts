import type { Node, Explorer } from '@/stores/slices/connection';

export type NodeType = keyof typeof Node;
export type ExplorerType = keyof typeof Explorer;

export interface ConnectionLocalStorageState {
  node: NodeType;
  customNode: string;
  explorer: ExplorerType;
}

interface ConnectionLocalStorageActions {
  setNode: (node: NodeType) => void;
  setCustomNode: (fullnode: string) => void;
  setExplorer: (explorer: ExplorerType) => void;
}

export interface ConnectionLocalStorageSlice {
  connectionState: ConnectionLocalStorageState;
  connectActions: ConnectionLocalStorageActions;
}
