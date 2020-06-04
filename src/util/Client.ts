import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { CONFIG } from "../util/Config"
import { Connection } from "../model/Connection";
import { Patient } from "../model/Patient";
import { TestResult } from "../model/TestResult";

type ErrorHandler = (error: AxiosError) => string;

const CLIENT_CONFIG: AxiosRequestConfig = {

    baseURL: CONFIG.backendUrl,
    responseType: "json",
    headers: { "Content-Type": "application/json" },
};

interface GenerateHl7Request {

    connectionInfo: Partial<Connection>;
    patientDetails: Partial<Patient>;
    covid19TestingResults: Partial<TestResult>[];
}

interface PostHl7Request {

    hl7Payload: string;
    connectionInfo: Partial<Connection>;
}

interface Response {

    statusCode: number;
    body: string;
    headers: {[K: string]: string};
}

const createErrorHandler = (operation: string): ErrorHandler => {

    return (axiosError) => `${axiosError.code} - Error calling "${operation}": ${axiosError.message}`;
}

export class Client {

    private readonly axiosClient: AxiosInstance;

    constructor(axiosClient?: AxiosInstance) {

        this.axiosClient = axiosClient || axios.create(CLIENT_CONFIG);
    }

    public readonly generateHl7 = (connection: Partial<Connection>, patient: Partial<Patient>, testResults: Partial<TestResult>[]): Promise<string | Error> => {

        const request: GenerateHl7Request = {

            connectionInfo: connection,
            patientDetails: patient,
            covid19TestingResults: testResults,
        };

        return this.axiosClient.post<Response>("/generateHL7", request)
            .then(x => x.data.body)
            .catch(createErrorHandler("generateHl7"))
    }

    public readonly postHl7 = (connection: Partial<Connection>, hl7Message: string): string | Promise<string | Error> => {

        const request: PostHl7Request = {

            connectionInfo: connection,
            hl7Payload: hl7Message,
        };

        return this.axiosClient.post<Response>("/postHL7", request)
            .then(x => x.data.body)
            .catch(createErrorHandler("postHl7"))
    }
}