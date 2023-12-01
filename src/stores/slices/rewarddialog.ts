import type { CreateDialogLocalStorageSlice, DialogLocalStorageState } from '@/stores/types';

export const initialDialogLocalStorageState = {
  dialogState: {
    rewardDialogCooldown: null,
    rewardAddress: undefined,
  } as DialogLocalStorageState,
};

export const dialogLocalStorageSlice: CreateDialogLocalStorageSlice = (setState) => {
  return {
    ...initialDialogLocalStorageState,
    dialogActions: {
      setRewardDialogCooldown: (cooldown: Date) => {
        setState((state) => {
          const store = { ...state };
          store.dialogState.rewardDialogCooldown = cooldown;
          return store;
        });
      },
      setRewardAddress: (address: string | undefined) => {
        setState((state) => {
          const store = { ...state };
          store.dialogState.rewardAddress = address;
          return store;
        });
      },
    },
  };
};
