import React, { ChangeEvent } from "react";
import { Patient } from "../model/Patient";
import { ManagedStateComponentProps } from "../util/StateManagement";
import { Form, Row } from "reactstrap";
import { StaticTextInputProps, TextInput } from "./TextInput";
import { SelectInput } from "./SelectInput";
import { RACES } from "../model/Races";
import { DisplayValueExtractor, ValueExtractor } from "../util/ValueExtractor";
import { GUARDIAN_RELATIONSHIPS } from "../model/GuardianRelationships";
import { ETHNICITIES } from "../model/Ethnicities";

export const PatientForm = (props: ManagedStateComponentProps<Patient>): JSX.Element => {

    const { model, index, saveModel } = props;
    const staticInputProps: StaticTextInputProps<Patient> = { model: model, modelIndex: index, saveModel: saveModel };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {

        saveModel(index, { ...model, [event.target.id]: event.target.value })
    }

    return (
    
        <div>
            <Form className="rounded-form">
                <Row form>
                    <TextInput {...staticInputProps} id="mrn" label="Medical Record Number (MRN)" />
                    <TextInput {...staticInputProps} id="mrnAuthority" label="MRN Assigning Authority" />
                </Row>
                <hr />
                <Row form>
                    <TextInput {...staticInputProps} id="nameFirst" label="First Name" />
                    <TextInput {...staticInputProps} id="nameMiddle" label="Middle Name" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="nameLast" label="Last Name" />
                    <TextInput {...staticInputProps} id="nameType" label="Name Type" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="motherMaidenNameLast" label="Mother's Maiden Last Name" />
                </Row>
                <hr />
                <Row form>
                    <TextInput {...staticInputProps} id="dateOfBirth" label="Date of Birth" />
                    <TextInput {...staticInputProps} id="sex" label="Sex" />
                </Row>
                <Row form>
                    <SelectInput id="race" 
                                 label="Race"
                                 sourceList={RACES}
                                 valueExtractor={ValueExtractor.STRING_IDENTITY}
                                 displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                                 onChange={onChange}
                                 value={model.race} />
                    <SelectInput id="ethnicity" 
                                 label="Ethnicity"
                                 sourceList={ETHNICITIES}
                                 valueExtractor={ValueExtractor.STRING_IDENTITY}
                                 displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                                 onChange={onChange}
                                 value={model.ethnicity} />
                </Row>
                <hr />
                <Row form>
                    <TextInput {...staticInputProps} id="addressLine1" label="Address Line 1" />
                    <TextInput {...staticInputProps} id="addressLine2" label="Address Line 2" />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="addressCity" label="Address City" columnWidth={4} />
                    <TextInput {...staticInputProps} id="addressState" label="Address State" columnWidth={4} />
                    <TextInput {...staticInputProps} id="addressZip" label="Address Zip" columnWidth={4} />
                </Row>
                <Row form>
                    <TextInput {...staticInputProps} id="addressCountry" label="Address Country" columnWidth={4} />
                    <TextInput {...staticInputProps} id="phoneAreaCode" label="Phone Area Code" columnWidth={2} />
                    <TextInput {...staticInputProps} id="phoneNumber" label="Phone Number" columnWidth={4} />
                </Row>
                <hr />
                <Row form>
                    <TextInput {...staticInputProps} id="guardianNameFirst" label="Guardian First Name" />
                    <TextInput {...staticInputProps} id="guardianNameLast" label="Guardian Last Name" />
                </Row>
                <Row form>
                    <SelectInput id="guardianRelationship" 
                                 label="Guardian Relationship"
                                 sourceList={GUARDIAN_RELATIONSHIPS}
                                 valueExtractor={ValueExtractor.STRING_IDENTITY}
                                 displayValueExtractor={DisplayValueExtractor.STRING_IDENTITY}
                                 onChange={onChange}
                                 value={model.guardianRelationship} />
                </Row>
            </Form>
        </div>
    );
}