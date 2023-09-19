import { DataStorageType } from "src/app/Enums/data-storage.enum";

export class DSQuickNote {
    fName: string;
  }
  export class DataStorage{
    userId: string;
    entityId: number;
    data: any;
    dataStorageType: DataStorageType;
  }