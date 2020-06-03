import { Patient } from "./Patient";
import { Connection } from "./Connection";
import { TestResult } from "./TestResult";

export interface State {

    connections: Partial<Connection>[];
    patients: Partial<Patient>[];
    testResults: Partial<TestResult>[];
}