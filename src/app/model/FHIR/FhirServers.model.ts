import { environment } from "src/environments/environment";

export class FhirServersData {
   private static Epic = {
    clientId: "42df9f03-7e6c-4c83-86b0-51f4d1dc4960", // prod
    clientIdTest: "e63c0f05-9690-466b-be2c-a082629c294c",
    scope: "launch openid fhirUser profile patient/*.*",
    redirectUri: "/fhir/epic/index"
  };
  private static Ecw = {
    clientId: "dLPAQ5JYBjQcVs65LZVrmvCgOli4VsyAkEhYhv9Yd_A", // prod // 2chealth
    clientIdTest: "06Or0TycjvKHm14GqMjHwMYhjxO9LZmwoNAok8G5xyQ", // 2chealth
    // clientId: "gaPCxPY3zmCvMn5xsL4ZprxHwMd9t7WD0gAmV7ioZWo", // prod // 2chealth solutions
    // clientIdTest: "tYHDiRrwuqPhLdqJD4CpGUGv4jSx0pEwEQUWqbmTz4c", // 2chealth solutions
    scope: "launch openid fhirUser profile patient/Patient.read",
    redirectUri: "/fhir/ecw/index"
  }
  static Data = () => {
    if (location.href.includes('epic')) {
      return FhirServersData.Epic
    } if (location.href.includes('ecw')) {
      return FhirServersData.Ecw
    } else {
      return FhirServersData.Ecw
    }
  }
  static ClientId = () => {
    if (environment.production) {
      return FhirServersData.Data().clientId
    } else {
      return FhirServersData.Data().clientIdTest
    }
  }

}
