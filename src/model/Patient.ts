export interface Patient {

    mrn: string;
    mrnAuthority: string;
    nameFirst: string;
    nameMiddle: string;
    nameLast: string;
    nameType:  string;
    motherMaidenNameLast: string;
    dateOfBirth: string;
    sex: string;
    race: string;
    ethnicity: string;
    phoneAreaCode: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    addressCountry: string;
    guardianNameFirst: string;
    guardianNameLast: string;
    guardianRelationship: string;
}