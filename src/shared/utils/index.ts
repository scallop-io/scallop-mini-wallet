// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export function isValidUrl(url: string | null) {
	if (!url) {
		return false;
	}
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}