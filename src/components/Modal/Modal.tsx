import React from 'react';
import { useModal } from '@/contexts/modal';
import './modal.scss';

type ModalProps = {};

const Modal: React.FC<ModalProps> = () => {
  const { isOpen, dialogData, handleConfirm, handleCancel } = useModal();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="modal-card">
        <div className="body">{dialogData?.content}</div>
        <div className="footer">
          <button onClick={handleCancel}>{dialogData?.cancelButtonLabel}</button>
          <button onClick={handleConfirm}>{dialogData?.confirmButtonLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
