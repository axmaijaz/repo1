export namespace BBCCDAObj {

  export interface Name {
      prefix: string;
      given: string[];
      family: string;
  }

  export interface Address {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
  }

  export interface Phone {
      work: string;
  }

  export interface Author {
      name: Name;
      address: Address;
      phone: Phone;
  }

  export interface Name2 {
      prefix: string;
      given: string[];
      family: string;
  }

  export interface Phone2 {
      work: string;
  }

  export interface Address2 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
  }

  export interface DocumentationOf {
      name: Name2;
      phone: Phone2;
      address: Address2;
  }

  export interface Address3 {
      street: any[];
      city?: any;
      state?: any;
      zip?: any;
      country?: any;
  }

  export interface Location {
      name?: any;
      address: Address3;
      encounter_date?: any;
  }

  export interface Document {
      date: Date;
      title: string;
      author: Author;
      documentation_of: DocumentationOf[];
      location: Location;
  }

  export interface DateRange {
      start: Date;
      end: Date;
  }

  export interface Reaction {
      name: string;
      code: string;
      code_system: string;
  }

  export interface ReactionType {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Allergen {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Allergy {
      date_range: DateRange;
      name?: any;
      code: string;
      code_system: string;
      code_system_name?: any;
      status: string;
      severity: string;
      reaction: Reaction;
      reaction_type: ReactionType;
      allergen: Allergen;
  }

  export interface CarePlan {
      text: string;
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface ChiefComplaint {
      text?: any;
  }

  export interface Name3 {
      prefix?: any;
      given: string[];
      family: string;
  }

  export interface Address4 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
  }

  export interface Phone3 {
      home: string;
      work?: any;
      mobile?: any;
  }

  export interface Birthplace {
      state: string;
      zip: string;
      country: string;
  }

  export interface Name4 {
      given: string[];
      family: string;
  }

  export interface Address5 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
  }

  export interface Phone4 {
      home: string;
  }

  export interface Guardian {
      name: Name4;
      relationship: string;
      relationship_code: string;
      address: Address5;
      phone: Phone4;
  }

  export interface Address6 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
  }

  export interface Provider {
      organization: string;
      phone: string;
      address: Address6;
  }

  export interface Demographics {
      name: Name3;
      dob: Date;
      gender: string;
      marital_status: string;
      address: Address4;
      phone: Phone3;
      email?: any;
      language: string;
      race: string;
      ethnicity: string;
      religion: string;
      birthplace: Birthplace;
      guardian: Guardian;
      provider: Provider;
  }

  export interface Finding {
      name: string;
      code: string;
      code_system: string;
  }

  export interface Translation {
      name?: any;
      code?: any;
      code_system?: any;
      code_system_name?: any;
  }

  export interface Performer {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Location2 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
      organization: string;
  }

  export interface Encounter {
      date: Date;
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
      code_system_version: string;
      findings: Finding[];
      translation: Translation;
      performer: Performer;
      location: Location2;
  }

  export interface FunctionalStatus {
      date: Date;
      name: string;
      code: string;
      code_system: string;
      code_system_name?: any;
  }

  export interface Translation2 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Product {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
      translation: Translation2;
      lot_number?: any;
      manufacturer_name: string;
  }

  export interface DoseQuantity {
      value: string;
      unit: string;
  }

  export interface Route {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface EducationType {
      name: string;
      code: string;
      code_system: string;
  }

  export interface Immunization {
      date: Date;
      product: Product;
      dose_quantity: DoseQuantity;
      route: Route;
      instructions: string;
      education_type: EducationType;
  }

  export interface Translation3 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Product2 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
      translation: Translation3;
      lot_number?: any;
      manufacturer_name: string;
  }

  export interface DoseQuantity2 {
      value: string;
      unit: string;
  }

  export interface Route2 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface EducationType2 {
      name?: any;
      code?: any;
      code_system?: any;
  }

  export interface ImmunizationDecline {
      date: Date;
      product: Product2;
      dose_quantity: DoseQuantity2;
      route: Route2;
      instructions?: any;
      education_type: EducationType2;
  }

  export interface Instruction {
      text: string;
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Translation4 {
      name?: any;
      code?: any;
      code_system?: any;
      code_system_name?: any;
  }

  export interface ReferenceRange {
      text: string;
      low_unit: string;
      low_value: string;
      high_unit: string;
      high_value: string;
  }

  export interface Test {
      date: Date;
      name: string;
      value: number;
      unit: string;
      code: string;
      code_system: string;
      code_system_name: string;
      translation: Translation4;
      reference_range: ReferenceRange;
  }

  export interface Result {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
      tests: Test[];
  }

  export interface DateRange2 {
      start: Date;
      end: Date;
  }

  export interface Translation5 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Product3 {
      name: string;
      code: string;
      code_system: string;
      text: string;
      translation: Translation5;
  }

  export interface DoseQuantity3 {
      value: string;
      unit: string;
  }

  export interface RateQuantity {
      value: string;
      unit: string;
  }

  export interface Precondition {
      name: string;
      code: string;
      code_system: string;
  }

  export interface Reason {
      name: string;
      code: string;
      code_system: string;
  }

  export interface Route3 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Schedule {
      type: string;
      period_value: string;
      period_unit: string;
  }

  export interface Vehicle {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Administration {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
  }

  export interface Prescriber {
      organization: string;
      person?: any;
  }

  export interface Medication {
      date_range: DateRange2;
      text: string;
      product: Product3;
      dose_quantity: DoseQuantity3;
      rate_quantity: RateQuantity;
      precondition: Precondition;
      reason: Reason;
      route: Route3;
      schedule: Schedule;
      vehicle: Vehicle;
      administration: Administration;
      prescriber: Prescriber;
  }

  export interface DateRange3 {
      start: Date;
      end: Date;
  }

  export interface Translation6 {
      name?: any;
      code?: any;
      code_system?: any;
      code_system_name?: any;
  }

  export interface Problem {
      date_range: DateRange3;
      name: string;
      status: string;
      age: number;
      code: string;
      code_system: string;
      code_system_name?: any;
      translation: Translation6;
      comment?: any;
  }

  export interface Specimen {
      name?: any;
      code?: any;
      code_system?: any;
  }

  export interface Performer2 {
      street: string[];
      city: string;
      state: string;
      zip: string;
      country: string;
      organization?: any;
      phone?: any;
  }

  export interface Device {
      name?: any;
      code?: any;
      code_system?: any;
  }

  export interface Procedure {
      date: Date;
      name: string;
      code: string;
      code_system: string;
      specimen: Specimen;
      performer: Performer2;
      device: Device;
  }

  export interface SmokingStatus {
      date?: any;
      name: string;
      code: string;
      code_system: string;
      code_system_name?: any;
  }

  export interface Result2 {
      name: string;
      code: string;
      code_system: string;
      code_system_name: string;
      value: number;
      unit: string;
  }

  export interface Vital {
      date: Date;
      results: Result2[];
  }

  export interface Data {
      document: Document;
      allergies: Allergy[];
      care_plan: CarePlan[];
      chief_complaint: ChiefComplaint;
      demographics: Demographics;
      encounters: Encounter[];
      functional_statuses: FunctionalStatus[];
      immunizations: Immunization[];
      immunization_declines: ImmunizationDecline[];
      instructions: Instruction[];
      results: Result[];
      medications: Medication[];
      problems: Problem[];
      procedures: Procedure[];
      smoking_status: SmokingStatus;
      vitals: Vital[];
  }

  export interface El {
      location?: any;
  }

  export interface Source {
      el: El;
  }

  export interface BBResource {
      type: string;
      data: Data;
      source: Source;
  }
}

