import React, { ChangeEvent } from "react";
import { ManagedStateComponentProps, SaveTestResult } from "../util/StateManagement";
import { Form, Row } from "reactstrap";
import { StaticTextInputProps, TextInput } from "./TextInput";
import { TestResult } from "../model/TestResult";
import { TEST_TYPES } from "../model/TestTypes";
import { ValueExtractor, DisplayValueExtractor } from "../util/ValueExtractor";
import { SelectInput } from "./SelectInput";
import { TEST_RESULT_CODES } from "../model/TestResultCodes";

export interface TestResultFormProps {

    testResult: Partial<TestResult>;
    testResultIndex: number;
    saveTestResult: SaveTestResult;
}

export const TestResultForm = (props: ManagedStateComponentProps<TestResult>): JSX.Element => {

    const { model, index, saveModel } = props;
    const staticInputProps: StaticTextInputProps<TestResult> = { model: model, modelIndex: index, saveModel: saveModel };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {

        saveModel(index, { ...model, [event.target.id]: event.target.value })
    }

    return (
    
        <div>
            <Form className="rounded-form">
                <Row form>
                    <TextInput {...staticInputProps} 
                               id="friendlyName" 
                               label="Friendly Name" 
                               helpText="Sets how this result should appear in UI lists" />
                    <SelectInput id="testType" 
                                 label="Test Type"
                                 sourceList={TEST_TYPES}
                                 valueExtractor={ValueExtractor.STRING_IDENTITY}
                                 displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                                 onChange={onChange}
                                 value={model.testType} />
                    
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="testDate" label="Test Date" />
                    <SelectInput id="testResult" 
                                 label="Test Result"
                                 sourceList={TEST_RESULT_CODES}
                                 valueExtractor={ValueExtractor.STRING_IDENTITY}
                                 displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                                 onChange={onChange}
                                 value={model.testResult} />
                </Row>
            </Form>
        </div>
    );
}