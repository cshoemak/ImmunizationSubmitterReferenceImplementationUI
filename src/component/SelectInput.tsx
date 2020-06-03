import React from "react";
import { InputProps, Col, FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";
import { DisplayValueExtractorType, ValueExtractor, ValueExtractorType } from "../util/ValueExtractor";

type OptionGenerator<T> = (model: T, index: number) => JSX.Element;

export interface SelectInputProps<T> extends InputProps {

    columnWidth?: number;
    feedback?: string;
    helpText?: string;
    label: string;
    sourceList: T[];
    displayValueExtractor: DisplayValueExtractorType<T>;
    valueExtractor?: ValueExtractorType<T>; 
}

const generateOption = <T, >(valueExtractor: ValueExtractorType<T>,
                             displayValueExtractor: DisplayValueExtractorType<T>): OptionGenerator<T> =>
    (model, index) => <option key={index} value={valueExtractor(model, index)}>
        {displayValueExtractor(model, index)}</option>;

export const SelectInput = <T,>(props: SelectInputProps<T>): JSX.Element => {

        const value = props.value || "";
        const className = props.value ? "font-weight-normal" : "font-weight-lighter";
        const { columnWidth, feedback, helpText, label, sourceList, valueExtractor,
            displayValueExtractor, ...pureReactProps } = props;

        return (

            <Col md={props.columnWidth || 6}>
            <FormGroup>
                <Label for="connectionSelect">{props.label}</Label>
                <Input {...pureReactProps} 
                       type="select"
                       className={className}
                       value={value}>
                    <option value="" className="font-weight-lighter">Select...</option>
                    {props.sourceList.map(generateOption(props.valueExtractor || ValueExtractor.INDEX,
                         props.displayValueExtractor))}
                </Input>
                {props.feedback && <FormFeedback>{props.feedback}</FormFeedback>}
                {props.helpText && <FormText>{props.helpText}</FormText>}
            </FormGroup>
        </Col>
        )
};