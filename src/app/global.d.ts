export { }; // this file needs to be a module
declare global {
  interface String {
    isNullOrEmpty(this: string): boolean;
    getShortCode(this: string): string;
  }
  interface Array<T> {
    groupByProp(property: keyof T): { Key: keyof T, values: T[] }[];
    sortByNumber(propName: keyof T, descending?: boolean): T[];
    sortAlphabetically(propName: keyof T, descending?: boolean): T[];
    sortByDateProp(propName: keyof T, descending?: boolean): T[];
    distinct(): T[];
    distinctBy(prop: keyof T): T[];
    deepClone(): T[];
  }
}
