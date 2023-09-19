import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Key } from 'protractor';
import { RpmFilterDto } from '../model/rpm.model';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {
  selectedRPMDashboardDate = '';
  selectedCCMDashboardDate = '';
  filterData = {};
  rpmFilterDto = new RpmFilterDto();
  routeState = '/home/page';
  constructor() { }
  clearFilterData(){
    this.filterData = {};
    this.rpmFilterDto = new RpmFilterDto();
    this.routeState = '/home/page';
    this.clearDataTable();
  }
  clearDataTable() {
    var arr = []; // Array to hold the keys
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).substring(0,11) == 'DataTables_') {
            arr.push(localStorage.key(i));
        }
    }

    // Iterate over arr and remove the items by key
    for (var i = 0; i < arr.length; i++) {
        localStorage.removeItem(arr[i]);
    }
  }

  ArrayGroupBy(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({
      key,
      order: groupedCollection[key][0].order || 0,
      parentId: groupedCollection[key][0].parentId || 0,
      value: groupedCollection[key]
    })).sort(function(a, b) {
      return a.order - b.order;
    });
    // })).sort(y => y.order);
  }
  ArrayGroupByChildObject(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});
    const Result = [];
    const arr = Object.keys(groupedCollection).map(key => ({
      // Key: groupedCollection[key][0]
      key,
      value: groupedCollection[key][0]
    }));
    // this will return an array of objects, each object containing a group of objects
    arr.forEach((obj: any, index) => {
      Result[obj.key] = obj.value;
    });
    return Result;
  }
  groupByProp(collection: Array<any>, property: string) {
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});
    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key] as any[]
    }));
  }
  distictArrayByProperty(collection: Array<any>, property: string) {
      const distictArray = Array.from(new Set(collection.map(x => x[property])))
      .map(id => {
        return collection.find(x => x[property] === id);
      });
      return distictArray;
  }
  getEnumAsList<T>(model: T): Array<{name: string, value: number}> {
    const keys = Object.keys(model).filter(
      k => typeof model[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map(key => ({
      name: key,
      value: model[key as any],
    })); // [0, 1]
    return values;
  }
  listenChangesinArray(arr: any[], callback: Function){
    // Add more methods here if you want to listen to them
   ['pop','push','reverse','shift','unshift','splice','sort'].forEach((m)=>{
       arr[m] = function(){
                    var res = Array.prototype[m].apply(arr, arguments);  // call normal behaviour
                    callback.apply(arr, arguments);  // finally call the callback supplied
                    return res;
                }
   });
  }
}
