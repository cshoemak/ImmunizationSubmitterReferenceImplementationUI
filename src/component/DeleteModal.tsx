import React, { useState } from "react";
import { DeleteModel } from "../util/StateManagement";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export interface DeleteModalProps {

    activeIndex: number;
    deleteItem: DeleteModel;
    isOpen: boolean;
    itemDisplay: string;
    itemName: string;
    toggle: () => void;
}

export const DeleteModal = (props: DeleteModalProps): JSX.Element | null => {

    const { activeIndex, deleteItem, isOpen, itemDisplay, itemName, toggle } = props;

    const performDelete = () => {

        deleteItem(activeIndex);
        toggle();
    }

    return ( 

        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{`Confirm ${itemName} Deletion`}</ModalHeader>
            <ModalBody>{`Are you sure you want to delete ${itemDisplay}`}</ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={performDelete}>Delete</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}