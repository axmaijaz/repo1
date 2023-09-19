export class Insurance {
    insurancepolicyholdercountrycode: string;
    sequencenumber: number;
    insurancepolicyholderlastname: string;
    insuredentitytypeid: number;
    insuranceidnumber: string;
    insurancepolicyholderzip: string;
    insurancepolicyholderdob: string;
    relationshiptoinsured: string;
    eligibilitystatus: string;
    ccmstatusname: string;
    insurancepolicyholderaddress1: string;
    insurancepackageaddress1: string;
    insurancepolicyholdersex: string;
    eligibilityreason: string;
    ccmstatusid: number;
    ircname: string;
    insuranceplanname: string;
    insurancetype: string;
    insurancephone: string;
    insurancepackagestate: string;
    insurancepackagecity: string;
    relationshiptoinsuredid: number;
    insuranceid: string;
    insurancepolicyholder: string;
    eligibilitylastchecked: string;
    insurancepolicyholderfirstname: string;
    insurancepackageid: number;
    ircid: number;
    insurancepolicyholdercountryiso3166: string;
    insuranceplandisplayname: string;
    insurancepolicyholdercity: string;
    insurancepackagezip: string;
}

export class AthenaInsuranceDto {
    insurances: Insurance[];
    totalcount: number;
}
