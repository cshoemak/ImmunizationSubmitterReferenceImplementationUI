import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ListGroup, ListGroupItem } from "reactstrap";
import { DisplayValueExtractorType } from "../util/ValueExtractor";

export interface ItemSelectorModalProps<T> {

    displayValueExtractor: DisplayValueExtractorType<T>;
    isOpen: boolean;
    itemTypeName: string;
    items: T[];
    message?: string;
    onSelect: (index: number) => void;
    onToggle: () => void;
}


export const ItemSelectorModal = <T,>(props: ItemSelectorModalProps<T>): JSX.Element => {

    const { displayValueExtractor, isOpen, itemTypeName, message, onSelect, onToggle } = props;

    const createSelectHandler = (index: number): () => void => {

        return () => {
            
            onSelect(index);
            onToggle();
        };
    }

    const createListItem = (item: T, index: number): JSX.Element => 
    <ListGroupItem tag="a" href="#" key={index} onClick={createSelectHandler(index)}>{displayValueExtractor(item, index)}</ListGroupItem>;

    return ( 

        <Modal isOpen={isOpen} toggle={onToggle} scrollable>
            <ModalHeader toggle={onToggle}>{`Select a ${itemTypeName}`}</ModalHeader>
            <ModalBody>
                {message && <p>{message}</p>}
                <ListGroup>
                    {props.items.map(createListItem)}
                </ListGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={onToggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}