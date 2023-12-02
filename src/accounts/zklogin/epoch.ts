import { useConnectionClient, useConnection } from "@/contexts/connection";
import { NetworkType } from "@/stores";
import { getFromSessionStorage, setToSessionStorage } from "@/utils/storage";

type EpochCacheInfo = {
	epoch: number;
	epochEndTimestamp: number;
};

function epochCacheKey(network: NetworkType) {
	return `epoch_cache_${network}`;
}

async function getCurrentEpochRequest(): Promise<EpochCacheInfo> {
    const client = useConnectionClient();
	const { epoch, epochDurationMs, epochStartTimestampMs } =
		await client.getLatestSuiSystemState();
	return {
		epoch: Number(epoch),
		epochEndTimestamp: Number(epochStartTimestampMs) + Number(epochDurationMs),
	};
}

export async function getCurrentEpoch() {
    const { currentNetwork } = useConnection();
	const cache = getFromSessionStorage<EpochCacheInfo>(epochCacheKey(currentNetwork as NetworkType));
	if (cache && Date.now() <= cache.epochEndTimestamp) {
		return cache.epoch;
	}
	const { epoch, epochEndTimestamp } = await getCurrentEpochRequest();
	const newCache: EpochCacheInfo = {
		epoch,
		epochEndTimestamp:
			// add some extra time to existing epochEndTimestamp to avoid making repeating requests while epoch is changing
			cache?.epoch === epoch ? cache.epochEndTimestamp + 5 * 1000 : epochEndTimestamp,
	};
	await setToSessionStorage(epochCacheKey(currentNetwork), newCache);
	return epoch;
}
