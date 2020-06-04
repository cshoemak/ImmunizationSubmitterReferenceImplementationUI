import React, { ChangeEvent, useState } from "react";
import { Patient } from "../model/Patient";
import { Connection } from "../model/Connection";
import { TestResult } from "../model/TestResult";
import { Form, Row, Input, Col, Label, Spinner, Button } from "reactstrap";
import { DisplayValueExtractor } from "../util/ValueExtractor"
import { SelectInput } from "./SelectInput";
import { TestResultGrid } from "./TestResultGrid";
import { Client} from "../util/Client";
import { useManagedMessageFormState } from "../util/MessageFormStateManagement";

export type ErrorTarget = "connection" | "patient" | "requestMessage"
export type Errors = {[K in ErrorTarget]: string};

export interface MessageFormProps {

    connections: Partial<Connection>[]; 
    patients: Partial<Patient>[];
    testResults: Partial<TestResult>[];
}

interface FormState {

    client: Client;
    errors: Partial<Errors>;
    generatingMessage: boolean;
    sendingMessage: boolean;
}

const isConnectionValid = (connection: Partial<Connection>): boolean => 
    !!(connection.facility && connection.iisUrl && connection.userId && connection.password );


export const MessageForm = (props: MessageFormProps): JSX.Element => {

    const [ formState, setFormState ] = useState<FormState>({ client: new Client(), errors: {},
        generatingMessage: false, sendingMessage: false});

    const { state, saveTestResult, deleteTestResult, clearTestResults, updateSelectedConnection,
         updateSelectedPatient, updateRequestMessage } = useManagedMessageFormState()

    const getConnection = (index: string | number | undefined) => {

        return props.connections[Number(index)];
    }

    const getPatient = (index: string | number | undefined) => {

        return props.patients[Number(index)];
    }

    const setErrorForTarget = (target: ErrorTarget, message: string | undefined): void => {

        const errors = { ...formState.errors };
        errors[target] = message;
        setFormState({ ...formState, errors });
    };

    const clearErrorForTarget = (target: ErrorTarget): void => {

        setErrorForTarget(target, undefined);
    };

    const hasErrorForTarget = (target: ErrorTarget): boolean => {

        return !formState.errors || !!formState.errors[target];
    };

    const getErrorForTarget = (target: ErrorTarget): string | undefined => {

        return formState.errors ? formState.errors[target] : undefined;
    };

    const setGeneratingMessage = (value: boolean) => {

        setFormState({ ...formState, generatingMessage: value});
    };

    const setSendingMessage = (value: boolean) => {

        setFormState({ ...formState, sendingMessage: value});
    };

    const checkIfConnectionPresent = (): boolean =>  {

        if (!state.selectedConnection) {
            setErrorForTarget("connection", "A connection is required to generate a message");
            return false;
        } else {
            clearErrorForTarget("connection");
            return true;
        }
    }

    const checkIfConnectionValid = (index: string | number | undefined): boolean =>  {

        if (!isConnectionValid(getConnection(index))) {
            setErrorForTarget("connection", "This connection is missing required fields");
            return false;
        } else {
            clearErrorForTarget("connection");
            return true;
        }
    }

    const checkIfPatientPresent = (): boolean =>  {

        if (!state.selectedPatient) {
            setErrorForTarget("patient", "A patient is required to generate a message");
            return false;
        } else {
            clearErrorForTarget("patient");
            return true;
        }
    }

    const onConnectionChange = (event: ChangeEvent<HTMLInputElement>) => {

        updateSelectedConnection(event.target.value);
        checkIfConnectionValid(event.target.value);
    };

    const onPatientChange = (event: ChangeEvent<HTMLInputElement>) => {
    
        updateSelectedPatient(event.target.value);
        clearErrorForTarget("patient");
    };

    const onRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    
        updateRequestMessage(event.target.value);
    };

    const onGenerateResultReceived = (result: string|Error) => {

        setGeneratingMessage(false);

        if (result instanceof Error) {

            throw Error;
        }

        updateRequestMessage(result);
    };

    const onGenerateClick = () => {

        if (checkIfConnectionPresent() 
            && checkIfConnectionValid(state.selectedConnection)
            && checkIfPatientPresent()) {

            const connection = getConnection(state.selectedConnection);
            const patient = getPatient(state.selectedPatient);

            formState.client.generateHl7(connection, patient, state.testResults)
                .then(onGenerateResultReceived); 
                
            setGeneratingMessage(true);
        }
    };

    const onSendMessageClick = () => {
        
        setSendingMessage(true);
    };

    return (

        <div>
            <Form className="rounded-form">
            <h4>Generate a Message</h4>
                <Row form>
                    <SelectInput id="connectionSelect" 
                                 label="IIS Connection"
                                 invalid={hasErrorForTarget("connection")} 
                                 value={state.selectedConnection}
                                 onChange={onConnectionChange} 
                                 helpText="Select the connection information of the IIS you wish to target"
                                 feedback={getErrorForTarget("connection")}
                                 sourceList={props.connections}
                                 displayValueExtractor={DisplayValueExtractor.CONNECTION} />
                </Row>
                <Row form>
                    <SelectInput id="patientSelect" 
                                    label="Patient"
                                    invalid={hasErrorForTarget("patient")} 
                                    value={state.selectedPatient}
                                    onChange={onPatientChange} 
                                    helpText="Select the patient for which you wish to generate a message"
                                    feedback={getErrorForTarget("patient")}
                                    sourceList={props.patients}
                                    displayValueExtractor={DisplayValueExtractor.PATIENT} />
                </Row>
                <h5>Test Results</h5>
                <TestResultGrid saveTestResult={saveTestResult}
                                deleteTestResult={deleteTestResult}
                                clearTestResults={clearTestResults}
                                testResults={state.testResults}
                                savedTestResults={props.testResults} />
            </Form>
            <Form>
                <Row form>
                    <Col sm={{ size: 2, offset: 10 }}>
                        <Button className="float-right" 
                                color="primary"
                                onClick={onGenerateClick}>
                            Generate Message
                        </Button>
                    </Col>
                </Row>   
            </Form>
            <Form className="rounded-form">
                <h4>Send a Message</h4>
                { formState.generatingMessage &&
                    <Row form>
                        <Col md={4}>
                            <span className="spinner-message">Generating Message</span>
                            <Spinner id="generatingMessageSpinner" size="sm" color="primary" />
                        </Col>
                    </Row>
                }
                { !formState.generatingMessage &&
                    <Row form>
                        <Col md={12}>
                            <Label for="requestMessageArea">HL7 Request</Label>
                            <Input type="textarea" 
                                    id="requestMessageArea" 
                                    value={state.requestMessage}
                                    onChange={onRequestChange} />
                        </Col>
                    </Row>
                }
            </Form>
            <Form>
                <Row form>
                    <Col sm={{ size: 2, offset: 10 }}>
                        <Button className="float-right" 
                                color="primary"
                                onClick={onSendMessageClick}>
                            Send Message
                        </Button>
                    </Col>
                </Row>   
            </Form>
            { (state.responseMessage || formState.sendingMessage) &&
                <Form className="rounded-form">
                    <h4>View Response Message</h4>
                    { formState.sendingMessage &&
                        <Row form>
                            <Col md={4}>
                                <span className="spinner-message">Sending Message</span>
                                <Spinner id="generatingMessageSpinner" size="sm" color="primary" />
                            </Col>
                        </Row>
                    }
                    { !formState.sendingMessage && 
                        <Row form>
                            <Col md={12}>
                                <Label for="requestMessageArea">HL7 Response</Label>
                                <Input type="textarea" 
                                        id="requestMessageArea" 
                                        value={state.responseMessage}
                                        onChange={onRequestChange} />
                            </Col>
                        </Row>
                    }
                </Form>
            }
        </div>
    );
};