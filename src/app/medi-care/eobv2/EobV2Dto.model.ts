declare module namespace {

  export class Meta {
      lastUpdated: Date;
  }

  export class Link {
      relation: string;
      url: string;
  }

  export class Meta2 {
      lastUpdated: Date;
  }

  export class Identifier {
      system: string;
      value: string;
  }

  export class Coding {
      system: string;
      code: string;
      display: string;
  }

  export class Type {
      coding: Coding[];
  }

  export class Patient {
      reference: string;
  }

  export class Coding2 {
      system: string;
      code: string;
      display: string;
  }

  export class Type2 {
      coding: Coding2[];
  }

  export class Identifier2 {
      type: Type2;
      system: string;
      value: string;
  }

  export class Organization {
      identifier: Identifier2;
  }

  export class ValueCoding {
      system: string;
      code: string;
      display: string;
  }

  export class Extension {
      url: string;
      valueCoding: ValueCoding;
  }

  export class Coding3 {
      system: string;
      code: string;
      display: string;
  }

  export class Type3 {
      coding: Coding3[];
  }

  export class Identifier3 {
      type: Type3;
      system: string;
      value: string;
  }

  export class Facility {
      extension: Extension[];
      identifier: Identifier3;
  }

  export class Coding4 {
      system: string;
      code: string;
      display: string;
  }

  export class Category {
      coding: Coding4[];
  }

  export class Coding5 {
      system: string;
      code: string;
      display: string;
  }

  export class Code {
      coding: Coding5[];
  }

  export class Information {
      sequence: number;
      category: Category;
      code: Code;
  }

  export class Identifier4 {
      system: string;
      value: string;
  }

  export class Provider {
      identifier: Identifier4;
  }

  export class Coding6 {
      system: string;
      code: string;
      display: string;
  }

  export class Role {
      coding: Coding6[];
  }

  export class CareTeam {
      sequence: number;
      provider: Provider;
      role: Role;
  }

  export class ValueIdentifier {
      system: string;
      value: string;
  }

  export class Extension2 {
      url: string;
      valueIdentifier: ValueIdentifier;
  }

  export class Coverage {
      extension: Extension2[];
      reference: string;
  }

  export class Insurance {
      coverage: Coverage;
  }

  export class Coding7 {
      system: string;
      code: string;
      display: string;
  }

  export class Service {
      coding: Coding7[];
  }

  export class ValueQuantity {
      value: number;
  }

  export class Extension3 {
      url: string;
      valueQuantity: ValueQuantity;
  }

  export class Quantity {
      extension: Extension3[];
      value: number;
  }

  export class Coding8 {
      system: string;
      code: string;
      display: string;
  }

  export class Category2 {
      coding: Coding8[];
  }

  export class Coding9 {
      system: string;
      code: string;
      display: string;
  }

  export class Reason {
      coding: Coding9[];
  }

  export class Amount {
      value: number;
      system: string;
      code: string;
  }

  export class Adjudication {
      category: Category2;
      reason: Reason;
      amount: Amount;
  }

  export class Item {
      sequence: number;
      careTeamLinkId: number[];
      service: Service;
      servicedDate: string;
      quantity: Quantity;
      adjudication: Adjudication[];
  }

  export class Resource {
      resourceType: string;
      id: string;
      meta: Meta2;
      identifier: Identifier[];
      status: string;
      type: Type;
      patient: Patient;
      organization: Organization;
      facility: Facility;
      information: Information[];
      careTeam: CareTeam[];
      insurance: Insurance;
      item: Item[];
  }

  export class Entry {
      resource: Resource;
  }

  export class EOBV2Dto {
      resourceType: string;
      id: string;
      meta: Meta;
      type: string;
      total: number;
      link: Link[];
      entry: Entry[];
  }

}

