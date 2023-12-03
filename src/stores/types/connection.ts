import type { Node, Explorer, Network } from '@/stores/slices/connection';

export type NodeType = keyof typeof Node;
export type ExplorerType = keyof typeof Explorer;
export type NetworkType = keyof typeof Network;
export interface ConnectionLocalStorageState {
  node: NodeType;
  customNode: string;
  explorer: ExplorerType;
  network: NetworkType;
}

interface ConnectionLocalStorageActions {
  setNode: (node: NodeType) => void;
  setCustomNode: (fullnode: string) => void;
  setExplorer: (explorer: ExplorerType) => void;
  setNetwork: (network: NetworkType) => void;
}

export interface ConnectionLocalStorageSlice {
  connectionState: ConnectionLocalStorageState;
  connectActions: ConnectionLocalStorageActions;
}
