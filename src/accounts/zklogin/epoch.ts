import { NetworkType } from "@/stores";
import { getFromSessionStorage, setToSessionStorage } from "@/utils/storage";
import { NetworkEnvType } from "./zklogin";
import { SuiClient } from "@mysten/sui.js/dist/cjs/client";

type EpochCacheInfo = {
	epoch: number;
	epochEndTimestamp: number;
};

function epochCacheKey(network: NetworkType) {
	return `epoch_cache_${network}`;
}

async function getCurrentEpochRequest(client: SuiClient): Promise<EpochCacheInfo> {
	const { epoch, epochDurationMs, epochStartTimestampMs } =
		await client.getLatestSuiSystemState();
	return {
		epoch: Number(epoch),
		epochEndTimestamp: Number(epochStartTimestampMs) + Number(epochDurationMs),
	};
}

export async function getCurrentEpoch(networkEnv: NetworkEnvType) {
	const cache = getFromSessionStorage<EpochCacheInfo>(epochCacheKey(networkEnv.network as NetworkType));
	if (cache && Date.now() <= cache.epochEndTimestamp) {
		return cache.epoch;
	}
	const { epoch, epochEndTimestamp } = await getCurrentEpochRequest(networkEnv.client);
	const newCache: EpochCacheInfo = {
		epoch,
		epochEndTimestamp:
			// add some extra time to existing epochEndTimestamp to avoid making repeating requests while epoch is changing
			cache?.epoch === epoch ? cache.epochEndTimestamp + 5 * 1000 : epochEndTimestamp,
	};
	setToSessionStorage(epochCacheKey(networkEnv.network), newCache);
	return epoch;
}
