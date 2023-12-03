import React, { createContext, useContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

export type ModalProps = {
  content: React.ReactNode;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm?: Function;
  onCancel?: Function;
};

type ModalProviderProps = {};

export const ModalProvider: FC<PropsWithChildren<ModalProviderProps>> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<ModalProps>();

  const showDialog = (dialogData: ModalProps) => {
    setDialogData(dialogData);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (dialogData?.onConfirm) dialogData.onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (dialogData?.onCancel) dialogData.onCancel();
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        dialogData,
        isOpen,
        handleConfirm,
        handleCancel,
        showDialog,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export interface ModalContextInterface {
  dialogData?: ModalProps;
  isOpen: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
  showDialog: (dialogData: ModalProps) => void;
}

export const ModalContext = createContext<ModalContextInterface>({
  dialogData: undefined,
  isOpen: false,
  handleConfirm: () => undefined,
  handleCancel: () => undefined,
  showDialog: () => undefined,
});

export const useModal = () => {
  const { dialogData, isOpen, handleConfirm, handleCancel, showDialog } = useContext(ModalContext);

  return {
    dialogData,
    isOpen,
    handleConfirm,
    handleCancel,
    showDialog,
  };
};
