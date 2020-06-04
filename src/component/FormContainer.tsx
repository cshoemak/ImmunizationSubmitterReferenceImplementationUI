import React, { useState } from "react";
import { Row, Col, Button } from "reactstrap";
import { ManagedStateComponentProps, SaveModel, DeleteModel } from "../util/StateManagement";
import { RouteComponentProps, Redirect } from "react-router";
import { ItemListProps, ItemList } from "./ItemList";
import { Patient } from "../model/Patient";
import { PatientForm } from "./PatientForm";
import { Connection } from "../model/Connection";
import { ConnectionForm } from "./ConnectionForm";
import { DeleteModal } from "./DeleteModal";
import { TestResult } from "../model/TestResult";
import { TestResultForm } from "./TestResultForm";
import { DisplayValueExtractor, DisplayValueExtractorType } from "../util/ValueExtractor";

interface FormContainerProps<T> {

    activeIndex: number;
    deleteModel: DeleteModel,
    FormComponent: FormComponent<T>,
    heading: string,
    itemName: string,
    models: Partial<T>[],
    rootPath: string,
    saveModel: SaveModel<T>,
    displayValueExtractor: DisplayValueExtractorType<Partial<T>>
}

type FormComponent<T> = React.ComponentType<ManagedStateComponentProps<T>>;
type RouteProps = RouteComponentProps<{index?: string}>;
type FormRenderer = (routeProps: RouteProps) => JSX.Element;
type FormRendererGenerator<T> = 
    (models: Partial<T>[], saveModel: SaveModel<T>, deleteModel: DeleteModel) => FormRenderer;

const extractRootPath = (routeProps: RouteProps) =>  routeProps.location.pathname.match(/\/[A-Z-]*/gi)?.shift() || "/";
const extractActiveIndex = (routeProps: RouteProps) => Number(routeProps.match.params.index);

const FormContainer = <T, >(props: FormContainerProps<T>): JSX.Element => {

    const { deleteModel, FormComponent, heading, activeIndex, itemName, models, rootPath, saveModel, displayValueExtractor }
        = props;

    const model = activeIndex === models.length ? {} : models[activeIndex];

    const formProps: ManagedStateComponentProps<T> = { index: activeIndex, model, saveModel };
    const listProps: ItemListProps<T> = { activeIndex: activeIndex, displayValueExtractor: displayValueExtractor, heading, itemName,
         models, rootPath };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);
    
    if (!model) {

        return ( <Redirect to={ `${rootPath}/${models.length}` } /> );
    }

    const itemDisplay = displayValueExtractor(model, activeIndex);
    const deleteEnabled = activeIndex !== models.length;

    return (

        <div>
            <DeleteModal activeIndex={activeIndex} deleteItem={deleteModel} isOpen={deleteModalOpen}
                         itemDisplay={itemDisplay} itemName={itemName} toggle={toggleDeleteModal} />
            <Row>
                <Col md={2}>
                    <ItemList {...listProps} />
                </Col>
                <Col md={10}>
                    <FormComponent {...formProps} />
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 2, offset: 10 }}>
                    <Button className="float-right" color="primary" onClick={toggleDeleteModal} disabled={!deleteEnabled}>
                        {`Delete ${props.itemName}`}
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export const createConectionFormRenderer: FormRendererGenerator<Connection> = 
    (connections, saveConnection, deleteConnection) => {

    const containerProps: Omit<FormContainerProps<Connection>, "activeIndex" | "rootPath"> = {

        deleteModel: deleteConnection,
        FormComponent: ConnectionForm,
        heading: "Connections",
        itemName: "Connection",
        models: connections,
        saveModel: saveConnection,
        displayValueExtractor: DisplayValueExtractor.CONNECTION,
    }

    return (routeProps) => ( < FormContainer {...containerProps} activeIndex={extractActiveIndex(routeProps)} 
        rootPath={extractRootPath(routeProps)} /> );
};

export const createPatientFormRenderer: FormRendererGenerator<Patient> = 
    (patients, savePatient, deletePatient) => {

    const containerProps: Omit<FormContainerProps<Patient>, "activeIndex" | "rootPath"> = {

        deleteModel: deletePatient,
        FormComponent: PatientForm,
        heading: "Patients",
        itemName: "Patient",
        models: patients,
        saveModel: savePatient,
        displayValueExtractor: DisplayValueExtractor.PATIENT,
    }

    return (routeProps) => ( < FormContainer {...containerProps} activeIndex={extractActiveIndex(routeProps)} 
        rootPath={extractRootPath(routeProps)} /> );
};

export const createTestResultFormRenderer: FormRendererGenerator<TestResult> =
    (testResults, saveTestResult, deleteTestResult) => {

    const containerProps: Omit<FormContainerProps<TestResult>, "activeIndex" | "rootPath"> = {

        deleteModel: deleteTestResult,
        FormComponent: TestResultForm,
        heading: "Test Results",
        itemName: "Result",
        models: testResults,
        saveModel: saveTestResult,
        displayValueExtractor: DisplayValueExtractor.TEST_RESULT,
    }

    return (routeProps) => ( < FormContainer {...containerProps} activeIndex={extractActiveIndex(routeProps)} 
        rootPath={extractRootPath(routeProps)} /> );
};
