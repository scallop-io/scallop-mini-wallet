import { type ExportedKeypair } from "@mysten/sui.js/cryptography";
import { NetworkType } from "./connection";


export type CredentialData = {
	ephemeralKeyPair: ExportedKeypair;
	// proofs?: PartialZkLoginSignature;
	minEpoch: number;
	maxEpoch: number;
	network: NetworkType;
	randomness: string;
	jwt: string;
};

export interface ConnectionSessionStorageState {
    credentials: string | null;
}

interface ConnectionSessionStorageActions {
    setCredentials: (credentials: string) => void;
}

export interface ConnectionSessionStorageSlice {
    connectionState: ConnectionSessionStorageState;
    connectActions: ConnectionSessionStorageActions;
}