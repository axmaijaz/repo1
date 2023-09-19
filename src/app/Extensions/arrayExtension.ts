
import * as clone from 'clone';


export {}; // this file needs to be a module
Array.prototype.groupByProp = function(property: string): any[] {
  const result: any[] = [];
  const groupedData = {};

  this.forEach((item: any) => {
    const key = (item[property] || 'Undefined' ).toString();
    if (!groupedData[key]) {
      groupedData[key] = {
        Key: key,
        values: [item]
      };
    } else {
      groupedData[key].values.push(item);
    }
  });

  for (const key in groupedData) {
    result.push(groupedData[key]);
  }

  return result;
};
Array.prototype.sortAlphabetically  = function (propName: string, descending = false) {
  return this.sort((a, b) => (a[propName]).localeCompare((b[propName])));
};
Array.prototype.sortByNumber = function (propName: string, descending = false) {
  return this.sort((a, b) => {
    const compareResult = a[propName] - b[propName];
    return descending ? -compareResult : compareResult;
  });
};
Array.prototype.sortByDateProp = function (propName: string, descending = false) {
  return this.sort((a, b) => {
    const dateA = new Date(a[propName]);
    const dateB = new Date(b[propName]);

    let compareResult = dateA.getTime() - dateB.getTime();
    if (isNaN(compareResult)) {
      compareResult = 0;
    }

    return descending ? -compareResult : compareResult;
  });
};
Array.prototype.distinct = function() {
  return Array.from(new Set(this));
};
Array.prototype.distinctBy = function(prop) {
  const seen = new Set();
  return this.filter((item: any) => {
    const value = item[prop];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};
Array.prototype.deepClone = function () {
  return clone(this);
};
