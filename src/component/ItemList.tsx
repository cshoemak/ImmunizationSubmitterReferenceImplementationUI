import React from "react";
import { ListGroupItem, ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { DisplayValueExtractorType } from "../util/ValueExtractor";

export interface ItemListProps<T> {

    activeIndex: number;
    heading: string;
    itemName: string;
    models: Partial<T>[];
    rootPath: string;
    displayValueExtractor: DisplayValueExtractorType<Partial<T>>;
}

export const ItemList = <T, >(props: ItemListProps<T>): JSX.Element => {

    const createListItem = (model: Partial<T>, index: number): JSX.Element => {

        const active = index === props.activeIndex;
        const to = `${props.rootPath}/${index}`
        const value = props.displayValueExtractor(model, index);

        return ( <ListGroupItem tag={Link} key={`${props.itemName}${index}`} to={to} active={active}>{value}</ListGroupItem> );
    };

    const newItemTo = `${props.rootPath}/${props.models.length}`;
    const newItemActive = props.activeIndex === props.models.length;

    return (

        <div>
            <p>{props.heading}</p>
            <ListGroup>
                {props.models?.map(createListItem)}
                <ListGroupItem tag={Link} to={newItemTo} active={newItemActive}>{`New ${props.itemName}`}</ListGroupItem>
            </ListGroup>
        </div>
    );
};