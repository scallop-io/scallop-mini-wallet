// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import Browser from 'webextension-polyfill';

import { lockAllAccountSources } from './account-sources';
import { accountSourcesEvents } from './account-sources/events';
// import { growthbook, setAttributes } from '_src/shared/experimentation/features';
import { getAccountsStatusData, getAllAccounts, lockAllAccounts } from './accounts';
import { accountsEvents } from './accounts/events';
import { autoLockAlarmName, cleanUpAlarmName } from './Alarms';
import { Connections } from './connections';
import NetworkEnv from './NetworkEnv';
import Permissions from './Permissions';
import Transactions from './Transactions';

// growthbook.loadFeatures().catch(() => {
// 	// silence the error
// });
// initSentry();

const connections = new Connections();

Permissions.permissionReply.subscribe((permission) => {
	if (permission) {
		connections.notifyContentScript({
			event: 'permissionReply',
			permission,
		});
	}
});

Permissions.on('connectedAccountsChanged', async ({ origin, accounts }) => {
	connections.notifyContentScript({
		event: 'walletStatusChange',
		origin,
		change: {
			accounts: await getAccountsStatusData(accounts),
		},
	});
});

accountsEvents.on('accountsChanged', async () => {
	connections.notifyUI({ event: 'storedEntitiesUpdated', type: 'accounts' });
	await Permissions.ensurePermissionAccountsUpdated(
		await Promise.all(
			(await getAllAccounts()).map(async (anAccount) => ({ address: await anAccount.address })),
		),
	);
});
accountsEvents.on('accountStatusChanged', () => {
	connections.notifyUI({ event: 'storedEntitiesUpdated', type: 'accounts' });
});
accountsEvents.on('activeAccountChanged', () => {
	connections.notifyUI({ event: 'storedEntitiesUpdated', type: 'accounts' });
});
accountSourcesEvents.on('accountSourceStatusUpdated', () => {
	connections.notifyUI({ event: 'storedEntitiesUpdated', type: 'accountSources' });
});
accountSourcesEvents.on('accountSourcesChanged', () => {
	connections.notifyUI({ event: 'storedEntitiesUpdated', type: 'accountSources' });
});

NetworkEnv.on('changed', async (network) => {
	connections.notifyUI({ event: 'networkChanged', network });
	connections.notifyContentScript({
		event: 'walletStatusChange',
		change: { network },
	});
});
