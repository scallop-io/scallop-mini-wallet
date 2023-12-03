import React from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { defaultNode, useLocalStorage, Node, Explorer, defaultExplorer, defaultNetwork } from '@/stores';
import type { FC, PropsWithChildren } from 'react';
import type { NodeType, ExplorerType, NetworkType } from '@/stores';
export type { NodeType };

type RpcNodes = {
  [N in Node]: string;
};

type Explorers = {
  [K in ExplorerType]: string;
};

// The fullnode url provided by each node serves as the network.
export const RPC: RpcNodes = {
  [Node.sui]: getFullnodeUrl('mainnet'),
  [Node.custom]: '',
};

export const EXPLORERS: Explorers = {
  [Explorer.official]: 'https://explorer.sui.io',
  [Explorer.suivision]: 'https://suivision.xyz',
  [Explorer.suiscan]: 'https://suiscan.xyz',
};

export interface ConnectionContextInterface {
  client: SuiClient;
  currentRpc: string;
  currentNode: string;
  setCurrentNode: (node: NodeType) => void;
  customNode: string;
  setCustomNode: (fullnode: string) => void;
  currentExplorer: ExplorerType;
  currentExplorerUrl: string;
  setExplorer: (selected: ExplorerType) => void;
  currentNetwork: NetworkType;
  setCurrentNetwork: (network: NetworkType) => void;
}

export const ConnectionContext = createContext<ConnectionContextInterface>({
  client: new SuiClient({ url: RPC[defaultNode] }),
  currentRpc: RPC[defaultNode],
  currentNode: defaultNode,
  setCurrentNode: () => undefined,
  customNode: '',
  setCustomNode: () => undefined,
  currentExplorer: defaultExplorer,
  currentExplorerUrl: EXPLORERS[defaultExplorer],
  setExplorer: () => undefined,
  currentNetwork: defaultNetwork,
  setCurrentNetwork: () => undefined,
});

type ConnectionProviderProps = {};

export const ConnectionProvider: FC<PropsWithChildren<ConnectionProviderProps>> = ({
  children,
}) => {
  const { connectionState, connectActions } = useLocalStorage();

  const currentRpc = useMemo(() => {
    return RPC[connectionState.node];
  }, [connectionState.node]);

  const client = useMemo(() => new SuiClient({ url: currentRpc }), [currentRpc]);

  const setCurrentNode = useCallback((node: NodeType) => {
    return connectActions.setNode(node);
  }, []);

  const explorerUrl: string = useMemo(
    () => EXPLORERS[connectionState.explorer],
    [connectionState.explorer]
  );

  return (
    <ConnectionContext.Provider
      value={{
        client: client,
        currentRpc: currentRpc,
        currentNode: connectionState.node,
        setCurrentNode: setCurrentNode,
        customNode: connectionState.customNode,
        setCustomNode: connectActions.setCustomNode,
        currentExplorer: connectionState.explorer,
        currentExplorerUrl: explorerUrl,
        setExplorer: connectActions.setExplorer,
        currentNetwork: connectionState.network,
        setCurrentNetwork: connectActions.setNetwork,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionClient = () => {
  const { client } = useContext(ConnectionContext);

  return useMemo(() => client, [client]);
};

export const useConnection = () => {
  const { currentNetwork, currentNode, setCurrentNode, customNode, setCustomNode } =
    useContext(ConnectionContext);

  return useMemo(
    () => ({
      currentNetwork,
      currentNode,
      setCurrentNode,
      customNode,
      setCustomNode,
    }),
    [currentNetwork, currentNode, setCurrentNode, customNode, setCustomNode]
  );
};

export const useNetwork = () => {
  const { currentNetwork } = useContext(ConnectionContext);

  return useMemo(() => currentNetwork, [currentNetwork]);
}

export const useExplorer = () => {
  const { currentExplorer, currentExplorerUrl, setExplorer } = useContext(ConnectionContext);

  return useMemo(
    () => ({
      currentExplorer,
      currentExplorerUrl,
      setExplorer,
    }),
    [currentExplorer, currentExplorerUrl, setExplorer]
  );
};
