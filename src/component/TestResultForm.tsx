import React from "react";
import { ManagedStateComponentProps, SaveTestResult } from "../util/StateManagement";
import { Form, Row } from "reactstrap";
import { StaticTextInputProps, TextInput } from "./TextInput";
import { TestResult } from "../model/TestResult";

export interface TestResultFormProps {

    testResult: Partial<TestResult>;
    testResultIndex: number;
    saveTestResult: SaveTestResult;
}

export const TestResultForm = (props: ManagedStateComponentProps<TestResult>): JSX.Element => {

    const { model, index, saveModel } = props;
    const staticInputProps: StaticTextInputProps<TestResult> = { model: model, modelIndex: index, saveModel: saveModel };

    return (
    
        <div>
            <Form>
                <Row form>
                    <TextInput {...staticInputProps} id="testType" label="Test Type" />
                    <TextInput {...staticInputProps} id="testDate" label="Test Date" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="testResult" label="Test Result" />
                </Row>
            </Form>
        </div>
    );
}