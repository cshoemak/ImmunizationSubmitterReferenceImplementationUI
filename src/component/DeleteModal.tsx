import React from "react";
import { DeleteModel } from "../util/StateManagement";
import { ConfirmModal } from "./ConfirmModal";

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

        <ConfirmModal confirmText="Delete"
                      operation={performDelete}
                      header={`Confirm ${itemName} Deletion`}
                      isOpen={isOpen}
                      message={`Are you sure you want to delete ${itemDisplay}`}
                      toggle={toggle} />
    );
}