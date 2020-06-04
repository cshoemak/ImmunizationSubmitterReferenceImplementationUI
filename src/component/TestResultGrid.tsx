import React, { MouseEvent, useState } from "react";
import { TestResult } from "../model/TestResult";
import { SaveTestResult, DeleteModel } from "../util/StateManagement";
import { InlineTestResult } from "./InlineTestResult";
import { Button } from "reactstrap";
import { ItemSelectorModal } from "./ItemSelectorModal";
import { DisplayValueExtractor } from "../util/ValueExtractor";
import { ConfirmModal } from "./ConfirmModal";

export interface TestResultGridProps {

    deleteTestResult: DeleteModel;
    clearTestResults: () => void
    testResults: Partial<TestResult>[];
    saveTestResult: SaveTestResult;
    savedTestResults: Partial<TestResult>[];
}

interface GridState {

    selectModalOpen: boolean;
    removeAllModalOpen: boolean;
}

export const TestResultGrid = (props: TestResultGridProps): JSX.Element => {

    const { deleteTestResult, clearTestResults, testResults, saveTestResult, savedTestResults } = props;

    const [ gridState, setGridState ] = useState<GridState>({ selectModalOpen: false, removeAllModalOpen: false });

    const onAddClick = (event: MouseEvent<HTMLButtonElement>) => {

        saveTestResult(testResults.length, {});
    }

    const toggleSelectModal = () => {

        setGridState({ ...gridState, selectModalOpen: !gridState.selectModalOpen});
    }

    const toggleRemoveAllModal = () => {

        setGridState({ ...gridState, removeAllModalOpen: !gridState.removeAllModalOpen});
    }

    const onSelectModalSelect = (index: number) => {

        saveTestResult(testResults.length, { ...savedTestResults[index] });
    }

    const createResultRow = (testResult: Partial<TestResult>, index: number): JSX.Element => 
        <InlineTestResult deleteEnabled={testResults.length > 1}
                          deleteTestResult={deleteTestResult}
                          key={index}
                          index={index}
                          testResult={testResult}
                          saveTestResult={saveTestResult}  />

    return (

        <div>
            <ConfirmModal confirmText="Remove All"
                          operation={clearTestResults}
                          header="Confirm Removal"
                          isOpen={gridState.removeAllModalOpen}
                          message="Are you sure you want to remove all test results? 
                                   This will not affect saved results." 
                          toggle={toggleRemoveAllModal} />
            
            <ItemSelectorModal displayValueExtractor={DisplayValueExtractor.TEST_RESULT}
                               isOpen={gridState.selectModalOpen}
                               itemTypeName="Test Result"
                               items={savedTestResults}
                               message="This will copy saved test results to the grid, allowing you to edit them
                                        without affecting the saved results."
                               onSelect={onSelectModalSelect}
                               onToggle={toggleSelectModal} />

            {props.testResults.map(createResultRow)}
            
            <Button id="addAnother" color="primary" onClick={onAddClick}>Add Another</Button>
            <Button id="addFromSaved" color="primary" onClick={toggleSelectModal}>Add From Saved</Button>
            <Button id="removeAll" color="primary" onClick={toggleRemoveAllModal}>Remove All</Button>
        </div>
    );
};