import { Connection } from "./Connection";

export interface Message {

    request: string;
    response: string;
    connection: Connection;
    timestamp: Date;
}