import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { CONFIG } from "../util/Config"
import { Connection } from "../model/Connection";
import { Patient } from "../model/Patient";
import { TestResult } from "../model/TestResult";

type ErrorHandler = (error: AxiosError) => string;
type PlainConnection = Omit<Connection, "friendlyName">;

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

/**
 * Creates a handler that can convert an {@link AxiosError} into a simple string error.
 * 
 * @param operation The client operation, for context.
 */
const createErrorHandler = (operation: string): ErrorHandler => {

    return (axiosError) => `Error calling "${operation}": ${axiosError.message}`;
}

/**
 * Removes {@code friendlyName} from the connection, leaving on the fields the ISRI back-end expects.
 */
const makeConnectionPlain = (connection: Partial<Connection>): Partial<PlainConnection> => {

    const { facility, iisUrl, userId, password } = connection;

    return { facility, iisUrl, userId, password }
} ;

/**
 * An ISRI Axios client for HL7 message generation and transmission.
 */
export class Client {

    private readonly axiosClient: AxiosInstance;

    constructor(axiosClient?: AxiosInstance) {

        this.axiosClient = axiosClient || axios.create(CLIENT_CONFIG);
    }

    /**
     * Calls the ISRI back-end to generate an HL7 message from the given connection, patient, and test result
     * data.
     * 
     * @returns A promise that resolves to either an HL7 message string representing a request message or an 
     *          {@link Error} if the call fails.
     */
    public readonly generateHl7 = (connection: Partial<Connection>,
                                   patient: Partial<Patient>,
                                   testResults: Partial<TestResult>[]): Promise<string | Error> => {

        const request: GenerateHl7Request = {

            connectionInfo: makeConnectionPlain(connection),
            patientDetails: patient,
            covid19TestingResults: testResults,
        };

        return this.axiosClient.post<Response>("/generateHL7", request)
            .then(x => x.data.body)
            .catch(createErrorHandler("generateHl7"))
    }

    /**
     * Calls the ISRI back-end to send the given HL7 message to the destination defined in the given connection info.
     * 
     * @returns A promise that resolves to either an HL7 message string representing a response messag or an 
     *          {@link Error} if the call fails.
     */
    public readonly postHl7 = (connection: Partial<Connection>, 
                               hl7Message: string): string | Promise<string | Error> => {

        const request: PostHl7Request = {

            connectionInfo: makeConnectionPlain(connection),
            hl7Payload: hl7Message,
        };

        return this.axiosClient.post<Response>("/postHL7", request)
            .then(x => x.data.body)
            .catch(createErrorHandler("postHl7"))
    }
}