import { Connection } from "../model/Connection";
import { Patient } from "../model/Patient";
import { TestResult } from "../model/TestResult";

export type DisplayValueExtractorType<T> = (model: T, index: number) => string;
export type ValueExtractorType<T> = (model: T, index: number) => string;

export class DisplayValueExtractor {

    public static readonly CONNECTION: DisplayValueExtractorType<Partial<Connection>> = (connection, index) => 
    connection.friendlyName ? connection.friendlyName : `Connection ${index}`;

    public static readonly PATIENT: DisplayValueExtractorType<Partial<Patient>> = (patient, index) => 
    patient.nameFirst && patient.nameLast ? `${patient.nameFirst} ${patient.nameLast}` : `Patient ${index}`;

    public static readonly TEST_RESULT: DisplayValueExtractorType<Partial<TestResult>> = (testResult, index) => 
    testResult.friendlyName || (testResult.testType && testResult.testDate
        ? `${testResult.testType} (${testResult.testDate})` : `Result ${index}`);

    public static readonly STRING_IDENTITY: DisplayValueExtractorType<string> = (value, index) => value;
}

export class ValueExtractor {

    public static readonly INDEX:  ValueExtractorType<any> = (value, index) => index.toString();

    public static readonly STRING_IDENTITY: ValueExtractorType<string> = (value, index) => value;
}