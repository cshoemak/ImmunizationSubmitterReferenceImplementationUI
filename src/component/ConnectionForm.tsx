import React from "react";
import { SaveConnection, ManagedStateComponentProps } from "../util/StateManagement";
import { Form, Row } from "reactstrap";
import { StaticTextInputProps, TextInput } from "./TextInput";
import { Connection } from "../model/Connection";

export interface ConnectionFormProps {

    connection: Partial<Connection>;
    connectionIndex: number;
    saveConnection: SaveConnection;
}

export const ConnectionForm = (props: ManagedStateComponentProps<Connection>): JSX.Element => {

    const { model, index, saveModel } = props;
    const staticInputProps: StaticTextInputProps<Connection> = { model: model, modelIndex: index, saveModel: saveModel };

    return (
    
        <div>
            <Form className="rounded-form">
                <Row form>
                    <TextInput {...staticInputProps} 
                               id="friendlyName" 
                               label="Friendly Name" 
                               helpText="Sets how this connection should appear in UI lists" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="iisUrl" label="IIS URL" />
                    <TextInput {...staticInputProps} id="facility" label="Facility" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="userId" label="Username" />
                    <TextInput {...staticInputProps} id="password" label="Password" />
                </Row>
            </Form>
        </div>
    );
}