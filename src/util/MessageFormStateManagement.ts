import { useState, useCallback} from "react";
import { debounce } from "lodash";
import { CONFIG } from "./Config";
import { MessageFormState } from "../model/MessageFormState";
import { loadState } from "./StateManagement";
import { TestResult } from "../model/TestResult";

type Consumer<T> = (value: T) => void;

const DEFAULT_MESSAGE_FORM_STATE: MessageFormState = {

    testResult: {}
};

export interface ManagedMessageFormState {

    state: MessageFormState;
    saveTestResult: Consumer<Partial<TestResult>>;
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

    const saveTestResult = (testResult: Partial<TestResult>) => {

        saveState({ ...state, testResult });
    }

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

    return { state, saveTestResult, updateSelectedConnection, updateSelectedPatient, updateRequestMessage, updateResponseMessage };
}