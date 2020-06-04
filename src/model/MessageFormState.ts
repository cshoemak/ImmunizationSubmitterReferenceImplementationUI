import { TestResult } from "./TestResult";

export interface MessageFormState {

    requestMessage?: string;
    responseMessage?: string;
    selectedConnection?: string;
    selectedPatient?: string;
    testResult: Partial<TestResult>;
}