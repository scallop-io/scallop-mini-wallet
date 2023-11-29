import { API_ENV } from "../shared/api-env";

function getDefaultApiEnv() {
	const apiEnv = process.env.API_ENV;
	if (apiEnv && !Object.keys(API_ENV).includes(apiEnv)) {
		throw new Error(`Unknown environment variable API_ENV, ${apiEnv}`);
	}
	return apiEnv ? API_ENV[apiEnv as keyof typeof API_ENV] : API_ENV.devNet;
}

export const DEFAULT_API_ENV = getDefaultApiEnv();