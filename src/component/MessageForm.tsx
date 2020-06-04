import React, { ChangeEvent, useState } from "react";
import { Patient } from "../model/Patient";
import { Connection } from "../model/Connection";
import { TestResult } from "../model/TestResult";
import { Form, Row, Input, Col, Label, Spinner, Button, FormGroup, FormFeedback } from "reactstrap";
import { DisplayValueExtractor } from "../util/ValueExtractor"
import { SelectInput } from "./SelectInput";
import { Client} from "../util/Client";
import { useManagedMessageFormState } from "../util/MessageFormStateManagement";
import { InlineTestResult } from "./InlineTestResult";
import { ItemSelectorModal } from "./ItemSelectorModal";

export type ErrorTarget = "connection" | "patient" | "requestMessage" | "responseMessage"
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
    selectModalOpen: boolean;
    sendingMessage: boolean;
}

const isConnectionValid = (connection: Partial<Connection>): boolean => 
    !!(connection.facility && connection.iisUrl && connection.userId && connection.password );


export const MessageForm = (props: MessageFormProps): JSX.Element => {

    const [ formState, setFormState ] = useState<FormState>({ client: new Client(), errors: {},
        generatingMessage: false, sendingMessage: false, selectModalOpen: false });

    const { state, saveTestResult, updateSelectedConnection, updateSelectedPatient, updateRequestMessage,
        updateResponseMessage } = useManagedMessageFormState()

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

    const toggleSelectModal = () => {

        setFormState({ ...formState, selectModalOpen: !formState.selectModalOpen});
    }

    const onSelectModalSelect = (index: number) => {

        saveTestResult( props.testResults[index]);
    }

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

    const checkIfRequestMessagePresent = (): boolean =>  {

        if (!state.requestMessage) {
            setErrorForTarget("requestMessage", "A request message is required for sending");
            return false;
        } else {
            clearErrorForTarget("requestMessage");
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
        clearErrorForTarget("requestMessage");
    };

    const onGenerateResultReceived = (result: string|Error) => {

        setGeneratingMessage(false);

        if (result instanceof Error) {

            setErrorForTarget("requestMessage", result.message);
            return;
        }

        updateRequestMessage(result);
    };

    const onGenerateClick = () => {

        if (checkIfConnectionPresent() 
            && checkIfConnectionValid(state.selectedConnection)
            && checkIfPatientPresent()) {

            const connection = getConnection(state.selectedConnection);
            const patient = getPatient(state.selectedPatient);

            formState.client.generateHl7(connection, patient, state.testResult)
                .then(onGenerateResultReceived); 
                
            setGeneratingMessage(true);
        }
    };

    const onSendResultReceived = (result: string|Error) => {

        setSendingMessage(false);

        if (result instanceof Error) {

            updateResponseMessage("");
            setErrorForTarget("responseMessage", result.message);
            return;
        }

        updateResponseMessage(result);
    }

    const onSendMessageClick = () => {
        
        clearErrorForTarget("responseMessage");

        if (checkIfConnectionPresent() 
            && checkIfConnectionValid(state.selectedConnection)
            && checkIfRequestMessagePresent()) {
     
                const connection = getConnection(state.selectedConnection);

                formState.client.postHl7(connection, state.requestMessage!)
                    .then(onSendResultReceived);

                setSendingMessage(true);
        }
    };

    return (

        <div>
            <ItemSelectorModal displayValueExtractor={DisplayValueExtractor.TEST_RESULT}
                               isOpen={formState.selectModalOpen}
                               itemTypeName="Test Result"
                               items={props.testResults}
                               message="This will copy the saved test result to the form, allowing you to edit it
                                        without affecting the saved result"
                               onSelect={onSelectModalSelect}
                               onToggle={toggleSelectModal} />

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
                <h5>Test Result</h5>
                <InlineTestResult deleteEnabled={false}
                                  deleteTestResult={() => {}}
                                  index={0}
                                  testResult={state.testResult}
                                  saveTestResult={(index, item) => saveTestResult(item)} />
                <Row form>
                    <Col md={2}>
                        <Button id="copyFromSaved" color="primary" onClick={toggleSelectModal}>Copy From Saved</Button>
                    </Col>
                </Row>

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
                            <FormGroup>
                                <Label for="requestMessageArea">HL7 Request</Label>
                                <Input type="textarea" 
                                    id="requestMessageArea" 
                                    invalid={hasErrorForTarget("requestMessage")} 
                                    className="hl7-message"
                                    value={state.requestMessage}
                                    feedback={getErrorForTarget("requestMessage")}
                                    onChange={onRequestChange} />
                                { hasErrorForTarget("requestMessage") && 
                                    <FormFeedback>{getErrorForTarget("requestMessage")}</FormFeedback>
                                }
                            </FormGroup>
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
                            <FormGroup>
                                <Label for="responseMessageArea">HL7 Response</Label>
                                <Input readOnly
                                       type="textarea" 
                                       id="responseMessageArea" 
                                       invalid={hasErrorForTarget("responseMessage")}
                                       className="hl7-message"
                                       value={state.responseMessage} />
                                { hasErrorForTarget("responseMessage") && 
                                    <FormFeedback>{getErrorForTarget("responseMessage")}</FormFeedback>
                                }
                            </FormGroup>
                        </Col>
                    </Row>
                }
            </Form>
        </div>
    );
};