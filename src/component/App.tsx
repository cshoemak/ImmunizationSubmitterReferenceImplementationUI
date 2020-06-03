import React from "react";
import { Container, Row, Col} from "reactstrap";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useManagedState } from "../util/StateManagement";
import { TopNav } from "./TopNav";
import { createPatientFormRenderer, createConectionFormRenderer, createTestResultFormRenderer } from "./FormContainer";
import { MessageForm } from "./MessageForm";

export const App = (): JSX.Element => {

    const { state, saveConnection, deleteConnection, savePatient, deletePatient, saveTestResult, deleteTestResult } = useManagedState();

    return (

        <Router>
            <Container>
                <Row>
                    <Col>
                        <TopNav />
                    </Col>
                </Row>
                <Switch>
                    <Route path="/connections/:index?" render={ createConectionFormRenderer(state.connections, saveConnection, deleteConnection) } />
                    <Route path="/patients/:index?" render={ createPatientFormRenderer(state.patients, savePatient, deletePatient) } />
                    <Route path="/test-results/:index?" render={ createTestResultFormRenderer(state.testResults, saveTestResult, deleteTestResult) } />
                    <Route path="/send-message">
                        <MessageForm connections={state.connections} patients={state.patients} testResults={state.testResults} />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}
