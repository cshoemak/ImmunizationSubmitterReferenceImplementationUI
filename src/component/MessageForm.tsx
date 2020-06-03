import React, { useState, ChangeEvent } from "react";
import { Patient } from "../model/Patient";
import { Connection } from "../model/Connection";
import { TestResult } from "../model/TestResult";
import { Form, Row, Input, Col, FormGroup, Label, FormText, FormFeedback, Spinner, Button } from "reactstrap";
import { DisplayValueExtractor, DisplayValueExtractorType } from "../util/ValueExtractor"
import { SelectInput } from "./SelectInput";

export interface MessageFormProps {

    connections: Partial<Connection>[]; 
    patients: Partial<Patient>[];
    testResults: Partial<TestResult>[];
}

interface MessageFormState {

    generatingMessage: boolean;
    serverRequestMessage?: string;
    requestMessage?: string;
    selectedConnection?: string;
    selectedPatient?: string;
    selectedTestResult?: string;
}

const isConnectionValid = (connection: Partial<Connection>): boolean => {

    return !!(connection.facility && connection.iisUrl && connection.password && connection.userId);
}

export const MessageForm = (props: MessageFormProps): JSX.Element => {

    const { connections, patients, testResults } = props;
    const [state, setState] = useState<MessageFormState>({ serverRequestMessage: "Mary had a little lamb", requestMessage: "Mary had a little lamb", generatingMessage: false });

    const connectionInvalid = !!state.selectedConnection 
        && !isConnectionValid(connections[Number(state.selectedConnection)]);
    const connectionInvalidText = connectionInvalid ? "This connection is missing some information" : undefined;
    const revertEditsDisabled = state.requestMessage === state.serverRequestMessage;

    const connectionSelectClass = state.selectedConnection ? "font-weight-normal" : "font-weight-lighter";
    const patientSelectClass = state.selectedPatient ? "font-weight-normal" : "font-weight-lighter";
    const testResultSelectClass = state.selectedTestResult ? "font-weight-normal" : "font-weight-lighter";

    const onConnectionChange = (event: ChangeEvent<HTMLInputElement>) => {

        setState({ ...state, selectedConnection: event.target.value });
    };

    const onPatientChange = (event: ChangeEvent<HTMLInputElement>) => {
    
        setState({ ...state, selectedPatient: event.target.value });
    };

    const onTestResultChange = (event: ChangeEvent<HTMLInputElement>) => {
    
        setState({ ...state, selectedTestResult: event.target.value });
    };

    const onRequestChange = (event: ChangeEvent<HTMLInputElement>) => {
    
        setState({ ...state, requestMessage: event.target.value });
    };

    const onRevertClick = () => {

        setState({ ...state, requestMessage: state.serverRequestMessage })
    };

    const onSendClick = () => {

    };

    const allSelectedAndValid = state.selectedConnection && !connectionInvalid && state.selectedPatient
        && state.selectedTestResult;

    return (

        <div>
            <Form>
                <Row form>
                    <SelectInput id="connectionSelect" 
                                 label="IIS Connection"
                                 invalid={connectionInvalid} 
                                 value={state.selectedConnection}
                                 onChange={onConnectionChange} 
                                 helpText="Select the connection information of the IIS you wish to target"
                                 feedback={connectionInvalidText}
                                 sourceList={props.connections}
                                 displayValueExtractor={DisplayValueExtractor.CONNECTION} />
                </Row>
                {state.selectedConnection && !connectionInvalid &&
                    <Row form>
                        <SelectInput id="patientSelect" 
                                     label="Patient"
                                     value={state.selectedPatient}
                                     onChange={onPatientChange} 
                                     helpText="Select the patient for which you wish to send a message"
                                     sourceList={props.patients}
                                     displayValueExtractor={DisplayValueExtractor.PATIENT} />
                    </Row>
                }
                {state.selectedConnection && !connectionInvalid && state.selectedPatient &&
                    <Row form>
                        <SelectInput id="testResultSelect" 
                                     label="Test Result"
                                     value={state.selectedTestResult}
                                     onChange={onTestResultChange} 
                                     helpText="Select the test result you wish to send"
                                     sourceList={props.testResults}
                                     displayValueExtractor={DisplayValueExtractor.TEST_RESULT} />
                    </Row>
                }
                { allSelectedAndValid && state.generatingMessage &&

                    <Row form>
                        <Col md={4}>
                            <span className="generating-message">Generating Message</span>
                            <Spinner id="generatingMessageSpinner" size="sm" color="primary" />
                        </Col>
                    </Row>
                }
                 { allSelectedAndValid && state.requestMessage &&

                    <div>
                        <Row form>
                            <Col md={12}>
                                <Label for="requestMessageArea">HL7 Request</Label>
                                <Input type="textarea" 
                                       id="requestMessageArea" 
                                       value={state.requestMessage}
                                       onChange={onRequestChange} />
                            </Col>
                        </Row>
                        <Row form className="hl7-request-buttons">
                            <Col md={4}>
                                <Button color="primary" onClick={onRevertClick} disabled={revertEditsDisabled}>
                                    Revert Edits
                                </Button>
                                <Button color="primary" onClick={onSendClick}>Send</Button>
                            </Col>
                        </Row>
                    </div>
                }
            </Form>
        </div>
    );
};