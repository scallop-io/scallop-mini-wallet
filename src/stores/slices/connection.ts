import type {
  CreateConnectionLocalStorageSlice,
  ConnectionLocalStorageState,
  NodeType,
  ExplorerType,
  NetworkType,
} from '@/stores/types';

// Define supported node aliases here.
export enum Node {
  custom = 'custom',
  sui = 'sui',
}

// Define supported explorer aliases here.
export enum Explorer {
  official = 'official',
  suivision = 'suivision',
  suiscan = 'suiscan',
}

export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export const nodes = Object.keys(Node) as Array<NodeType>;
export const networks = Object.keys(Network) as Array<NetworkType>;
export const explorers = Object.keys(Explorer) as Array<ExplorerType>;

// Define default node here.
export const defaultNode = Node.sui;
// Define default explorer here.
export const defaultExplorer = Explorer.suivision;
export const defaultNetwork = Network.devnet;

export const initialConnectionLocalStorageState = {
  connectionState: {
    node: defaultNode,
    customNode: '',
    explorer: defaultExplorer,
    network: defaultNetwork,
  } as ConnectionLocalStorageState,
};

export const connectionLocalStorageSlice: CreateConnectionLocalStorageSlice = (setState) => {
  return {
    ...initialConnectionLocalStorageState,
    connectActions: {
      setNode: (node: NodeType) => {
        setState((state: any) => {
          const store = { ...state };
          store.connectionState.node = node;
          return store;
        });
      },
      setCustomNode: (fullnode: string) => {
        setState((state: any) => {
          const store = { ...state };
          store.connectionState.customNode = fullnode;
          return store;
        });
      },
      setExplorer: (explorer: ExplorerType) => {
        setState((state: any) => {
          const store = { ...state };
          store.connectionState.explorer = explorer;
          return store;
        });
      },
      setNetwork: (network: NetworkType) => {
        setState((state: any) => {
          const store = { ...state };
          store.connectionState.network = network;
          return store;
        });
      },
    },
  };
};
