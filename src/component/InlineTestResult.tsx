import React, { ChangeEvent, MouseEvent } from "react";
import { TestResult } from "../model/TestResult";
import { SaveTestResult, DeleteModel } from "../util/StateManagement";
import { SelectInput } from "./SelectInput";
import { Row, Col, Button } from "reactstrap";
import { TextInput } from "./TextInput";
import { TEST_TYPES } from "../model/TestTypes";
import { ValueExtractor, DisplayValueExtractor } from "../util/ValueExtractor";
import { TEST_RESULT_CODES } from "../model/TestResultCodes";

export interface InlineTestResultProps {

    deleteEnabled: boolean;
    deleteTestResult: DeleteModel
    index: number;
    testResult: Partial<TestResult>;
    saveTestResult: SaveTestResult;
}

export const InlineTestResult = (props: InlineTestResultProps): JSX.Element => {
    
    const { deleteEnabled, deleteTestResult, index, testResult, saveTestResult } = props;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {

        saveTestResult(index, { ...testResult, [event.target.id]: event.target.value })
    }

    const onDelete = (event: MouseEvent<HTMLButtonElement>) => {

        deleteTestResult(Number(event.currentTarget.value))
    }

    return (
        
        <div>
            <Row form>
                <SelectInput id="testType" 
                             label="Test Type"
                             sourceList={TEST_TYPES}
                             valueExtractor={ValueExtractor.STRING_IDENTITY}
                             displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                             onChange={onChange}
                             value={testResult.testType}
                             columnWidth={4} />

                <TextInput id="testDate"
                           label="Test Date"
                           model={testResult} 
                           saveModel={saveTestResult} 
                           modelIndex={index}
                           columnWidth={3} />
                        
                <SelectInput id="testResult" 
                             label="Test Result"
                             sourceList={TEST_RESULT_CODES}
                             valueExtractor={ValueExtractor.STRING_IDENTITY}
                             displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                             onChange={onChange}
                             value={testResult.testResult}
                             columnWidth={4} />
                { deleteEnabled && 
                    <Col md={1}>
                        <Button id={`deleteResult${index}`} 
                                color="primary"
                                className="inline-delete-button"
                                value={index}
                                onClick={onDelete}>
                            Delete
                        </Button>
                    </Col>
                }
            </Row>
        </div>
    );
}