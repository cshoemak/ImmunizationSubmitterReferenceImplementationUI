import { useState, useCallback} from "react";
import { debounce } from "lodash";
import { CONFIG } from "./Config";
import { MessageFormState } from "../model/MessageFormState";
import { SaveTestResult, DeleteModel, loadState } from "./StateManagement";

type Consumer<T> = (value: T) => void;

const DEFAULT_MESSAGE_FORM_STATE: MessageFormState = {

    testResults: [{}]
};

export interface ManagedMessageFormState {

    state: MessageFormState;
    saveTestResult: SaveTestResult;
    deleteTestResult: DeleteModel;
    clearTestResults: () => void;
    updateSelectedConnection: Consumer<string>;
    updateSelectedPatient: Consumer<string>;   
    updateRequestMessage: Consumer<string>;
    updateResponseMessage: Consumer<string>;
}

export const useManagedMessageFormState = (): ManagedMessageFormState => {

    const [state, setState] = 
        useState<MessageFormState>(loadState(CONFIG.messageStateLocalStorageKey, DEFAULT_MESSAGE_FORM_STATE));

    const persistState = (newState: MessageFormState) => { 
    
        window.localStorage.setItem(CONFIG.messageStateLocalStorageKey, JSON.stringify(newState));
    };

    const debouncedPeristState = useCallback(debounce(persistState, 500), [])

    const saveState = (newState: MessageFormState) => {

        setState(newState);
        debouncedPeristState(newState);        
    };

    const saveTestResult: SaveTestResult = (index, testResult) => {

        const testResults = [...state.testResults];
        testResults[index] = testResult;
        saveState({ ...state, testResults });
    }

    const deleteTestResult: DeleteModel = (index) => {

        const testResults = [...state.testResults];
        testResults.splice(index, 1);
        saveState({ ...state, testResults });
    }

    const clearTestResults = () => {

        saveState({ ...state, testResults: [{}] });
    };

    const updateSelectedConnection: Consumer<string> = (selection) => {

        saveState({ ...state, selectedConnection: selection})
    } 

    const updateSelectedPatient: Consumer<string> = (selection) => {

        saveState({ ...state, selectedPatient: selection})
    } 

    const updateRequestMessage: Consumer<string> = (message) => {

        saveState({ ...state, requestMessage: message})
    } 

    const updateResponseMessage: Consumer<string> = (message) => {

        saveState({ ...state, responseMessage: message });
    }

    return { state, saveTestResult, deleteTestResult, clearTestResults, updateSelectedConnection, 
        updateSelectedPatient, updateRequestMessage, updateResponseMessage };
}