export interface DialogLocalStorageState {
  rewardDialogCooldown: Date | null;
  rewardAddress: string | undefined;
}

interface DialogLocalStorageActions {
  setRewardDialogCooldown: (cooldown: Date) => void;
  setRewardAddress: (address: string | undefined) => void;
}

export interface DialogLocalStorageSlice {
  dialogState: DialogLocalStorageState;
  dialogActions: DialogLocalStorageActions;
}
