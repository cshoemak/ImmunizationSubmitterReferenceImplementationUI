import { State } from "../model/State";
import { useState, useCallback} from "react";
import { Patient } from "../model/Patient";
import { Connection } from "../model/Connection";
import { debounce } from "lodash";
import { CONFIG } from "./Config";
import { TestResult } from "../model/TestResult";

export type SaveModel<T> = (index: number, item: Partial<T>) => void;
export type DeleteModel = (index: number) => void;
export type SaveConnection = SaveModel<Connection>;
export type SavePatient = SaveModel<Patient>;
export type SaveTestResult = SaveModel<TestResult>;

export interface ManagedStateComponentProps<T> {

    model: Partial<T>;
    index: number;
    saveModel: SaveModel<T>;
}

const DEFAULT_STATE: State = {

    connections: [],
    patients: [],
    testResults: [],
}

const loadState = (): State => {

    const rawState = window.localStorage.getItem(CONFIG.stateLocalStorageKey);

    try {

        const parsedState = rawState ? JSON.parse(rawState) as Partial<State>: undefined;
        return parsedState ? {...DEFAULT_STATE, ...parsedState} : DEFAULT_STATE;

    } catch (error) {
        return DEFAULT_STATE;
    };
}

export interface ManagedState {

    state: State;
    saveConnection: SaveConnection;
    deleteConnection: DeleteModel;
    savePatient: SavePatient;
    deletePatient: DeleteModel;
    saveTestResult: SaveTestResult;
    deleteTestResult: DeleteModel;
}

export const useManagedState = (): ManagedState => {

    const [state, setState] = useState<State>(loadState());

    const persistState = (newState: State) => { 
    
        window.localStorage.setItem(CONFIG.stateLocalStorageKey, JSON.stringify(newState));
    };

    const debouncedPeristState = useCallback(debounce(persistState, 500), [])

    const saveState = (newState: State) => {

        setState(newState);
        debouncedPeristState(newState);        
    };

    const saveConnection: SaveConnection = (index, connection) => {

        const connections = [...state.connections]
        connections[index] = connection;
        saveState({ ...state, connections });
    };

    const deleteConnection: DeleteModel = (index) => {

        const connections = [...state.connections];
        connections.splice(index, 1);
        saveState({ ...state, connections });
    }

    const savePatient: SavePatient = (index, patient) => {

        const patients = [...state.patients]
        patients[index] = patient;
        saveState({ ...state, patients });
    };

    const deletePatient: DeleteModel = (index) => {

        const patients = [...state.patients];
        patients.splice(index, 1);
        saveState({ ...state, patients });
    }

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

    return { state, saveConnection, deleteConnection, savePatient, deletePatient, saveTestResult, deleteTestResult };
};