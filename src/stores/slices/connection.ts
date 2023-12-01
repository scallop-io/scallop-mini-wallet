import type {
  CreateConnectionLocalStorageSlice,
  ConnectionLocalStorageState,
  NodeType,
  ExplorerType,
} from '@/stores/types';

// Define supported node aliases here.
export enum Node {
  custom = 'custom',
  sui = 'sui',
  shinami = 'shinami',
  blockvision = 'blockvision',
  blast = 'blast',
}

// Define supported explorer aliases here.
export enum Explorer {
  official = 'official',
  suivision = 'suivision',
  suiscan = 'suiscan',
}

export const nodes = Object.keys(Node) as Array<NodeType>;
export const explorers = Object.keys(Explorer) as Array<ExplorerType>;

// Define default node here.
export const defaultNode = Node.sui;
// Define default explorer here.
export const defaultExplorer = Explorer.suivision;

export const initialConnectionLocalStorageState = {
  connectionState: {
    node: defaultNode,
    customNode: '',
    explorer: defaultExplorer,
  } as ConnectionLocalStorageState,
};

export const connectionLocalStorageSlice: CreateConnectionLocalStorageSlice = (setState) => {
  return {
    ...initialConnectionLocalStorageState,
    connectActions: {
      setNode: (node: NodeType) => {
        setState((state) => {
          const store = { ...state };
          store.connectionState.node = node;
          return store;
        });
      },
      setCustomNode: (fullnode: string) => {
        setState((state) => {
          const store = { ...state };
          store.connectionState.customNode = fullnode;
          return store;
        });
      },
      setExplorer: (explorer: ExplorerType) => {
        setState((state) => {
          const store = { ...state };
          store.connectionState.explorer = explorer;
          return store;
        });
      },
    },
  };
};
