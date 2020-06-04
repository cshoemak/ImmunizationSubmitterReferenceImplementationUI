import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export interface ConfirmModalProps {

    cancelText?: string;
    confirmText?: string;
    operation: () => void;
    header: string;
    isOpen: boolean;
    message: string;
    toggle: () => void;
}

export const ConfirmModal = (props: ConfirmModalProps): JSX.Element | null => {

    const { cancelText, confirmText, operation, header, isOpen, message, toggle } = props;

    const performOperation = () => {

        operation();
        toggle();
    }

    return ( 

        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{header}</ModalHeader>
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={performOperation}>{confirmText || "Confirm"}</Button>
                <Button color="secondary" onClick={toggle}>{cancelText || "Cancel"}</Button>
            </ModalFooter>
        </Modal>
    );
}