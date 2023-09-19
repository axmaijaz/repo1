import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { PatientDto } from '../model/Patient/patient.model';

@Injectable({
  providedIn: "root"
})
export class AnalyticSavedDataService {

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  // yearNum: number;
  listOfYears = [];
  listOfMonths = [
    {text: 'January' , id: 1},
    {text: 'February' , id: 2},
    {text: 'March' , id: 3},
    {text: 'April' , id: 4},
    {text: 'May' , id: 5},
    {text: 'June' , id: 6},
    {text: 'July' , id: 7},
    {text: 'August' , id: 8},
    {text: 'September' , id: 9},
    {text: 'October' , id: 10},
    {text: 'November' , id: 11},
    {text: 'December' , id: 12},
    // {text: 'january' , id: '01'},
  ];
  listOfQuarters = [
    'Q1',
    'Q2',
    'Q3',
    'Q4',
  ]

  constructor() {

    for (let i = 1990; i <= this.currentYear; i++) {

      this.listOfYears.push(i);
    }
  }
}
