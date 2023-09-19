import { Gender } from 'src/app/Enums/gender.enum';
import { Currency } from 'src/app/Enums/currency.enum';
import { Proficiency } from 'src/app/Enums/Proficiency.enum';
import { gradeEnum } from 'src/app/Enums/grade.enum';
import { subjects } from 'src/app/Enums/subjects.enum';
import { weekDays } from 'src/app/Enums/weekDays.enum';
import { Languages } from 'src/app/Enums/languages.enum';

export class Address {
  id = 0;
  country = '';
  city = '';
  zipCode: number;
  streetAddress = '';
}
export class PersonalInfo {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  dateOfBirth: Date;
  hourlyRate: number;
  description = '';
  gender: Gender;
  currency: Currency;
  address = new Address();
}

export class TutorSubjects {
  grades = new Array<Grade>();
  availability = new Array<Day>();
  languages = new Array<Language>();
}
export class Language {
  value: number;
  label: string;
  proficiency: Proficiency;
}
export class Grade {
  gradeName: gradeEnum;
  subjectsName = new Array<Subject>();
}
export class Subject {
  value: number;
  label: string;
}
export class Day {
  day: weekDays;
  timeSlots = new Array<TimeSlot>();
}

export class TimeSlot {
  startTime = '';
  endTime = '';
}
export class EducationAndWork {
  education = new Array<Education>();
  work = new Array<WorkExperience>();
  }
export class Education {
  degree = '';
  institute = '';
  startYear:  number;
  endYear: number;
  discription = '';
}
export class WorkExperience {
  jobTitle = '';
  companyName = '';
  startYear: number;
  endYear: number;
  discription = '';
}
