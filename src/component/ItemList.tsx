import React from "react";
import { ListGroupItem, ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { Patient } from "../model/Patient";
import { Connection } from "../model/Connection";
import { TestResult } from "../model/TestResult";

export type ItemValueExtractor<T> = (model: Partial<T>, index: number) => string;

export interface ItemListProps<T> {

    activeIndex: number;
    heading: string;
    itemName: string;
    models: Partial<T>[];
    rootPath: string;
    valueExtractor: ItemValueExtractor<T>;
}

export const EXTRACT_CONNECTION: ItemValueExtractor<Connection> = (connection, index) => 
    connection.friendlyName ? connection.friendlyName : `Connection ${index}`;

export const EXTRACT_PATIENT: ItemValueExtractor<Patient> = (patient, index) => 
    patient.nameFirst && patient.nameLast ? `${patient.nameFirst} ${patient.nameLast}` : `Patient ${index}`;

export const EXTRACT_TEST_RESULT: ItemValueExtractor<TestResult> = (testResult, index) => 
    testResult.testType && testResult.testDate ? `${testResult.testType} (${testResult.testDate})` : `Result ${index}`;

export const ItemList = <T, >(props: ItemListProps<T>): JSX.Element => {

    const createListItem = (model: Partial<T>, index: number): JSX.Element => {

        const active = index === props.activeIndex;
        const to = `${props.rootPath}/${index}`
        const value = props.valueExtractor(model, index);

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