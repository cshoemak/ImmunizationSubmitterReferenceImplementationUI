import React, { ChangeEvent } from "react";
import { Col, FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";

type IdType<T> = Extract<keyof T, String>;
type ModelType<T> = {[K in keyof T]: string};
export type StaticTextInputProps<T> = Pick<TextInputProps<T>, "model" | "modelIndex" | "saveModel">;

export interface TextInputProps<T> {

    columnWidth?: number;
    feedback?: string;
    helpText?: string;
    id: IdType<T>;
    label: string;
    model: Partial<ModelType<T>>;
    modelIndex: number;
    saveModel: (index: number, model: Partial<ModelType<T>>) => void;
}

export const TextInput = <T, >(props: TextInputProps<T>): JSX.Element => {

    const {columnWidth, id, label, model, modelIndex, saveModel} = props;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {

        saveModel(modelIndex, { ...model, [event.target.id]: event.target.value });
    };

    return (

        <Col md={columnWidth || 6}>
            <FormGroup>
                <Label for={id}>{label}</Label>
                <Input type="text" id={id} value={model[id] || ""} onChange={onChange} />
                {props.feedback && <FormFeedback>{props.feedback}</FormFeedback>}
                {props.helpText && <FormText>{props.helpText}</FormText>}
            </FormGroup>
        </Col>
    );
}