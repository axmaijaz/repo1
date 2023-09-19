import { Injectable } from '@angular/core';
import { DataStorageType } from '../Enums/data-storage.enum';
import { DataStorage, DSQuickNote } from '../model/data-storage/data-storage.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  // dataList = new Array<DataStorage>();
  dataList : Array<DataStorage> = [];
  dSQuickNoteList = new Array<DSQuickNote>();

  constructor() { }

  saveData(dataStorageDto: DataStorage ){
    this.dataList = JSON.parse(localStorage.getItem('StorageData'));
    if(this.dataList && this.dataList.length){
        const tempDataList = this.dataList.filter(data => (data.userId = dataStorageDto.userId) && (data.entityId == dataStorageDto.entityId)&& (data.dataStorageType == dataStorageDto.dataStorageType));
        if(!tempDataList.length){
          this.dataList.push(dataStorageDto);
          localStorage.setItem('StorageData',JSON.stringify(this.dataList));
        }
    }else{
      const tempArr = [];
      tempArr.push(dataStorageDto);
      localStorage.setItem('StorageData',JSON.stringify(tempArr));
    }
  }
  getData(userId: string, entityId: number,dataStorageType: DataStorageType ){
    this.dataList = JSON.parse(localStorage.getItem('StorageData'));
    if(this.dataList){
      if(dataStorageType = DataStorageType.QuickNotes){
          return  this.getQNData(DataStorageType.QuickNotes, userId, entityId);
          // const QNData = this.getQNData<DSQuickNote>(DataStorageType.QuickNotes, userId, entityId);
      }
    }
  }
  getQNData(dataStorageType: DataStorageType, userId: string, entityId: number) {
    return this.dataList.filter(data => (data.userId == userId) && (data.entityId == entityId)&& (data.dataStorageType == dataStorageType));
  }
  // getQNData<DSQuickNote>(dataStorageType: DataStorageType, userId: string, entityId: number): DSQuickNote {
  //   return this.dataList.filter(data => (data.userId = userId) && (data.entityId == entityId)&& (data.dataStorageType == dataStorageType));
  // }
  deleteData(userId: string, entityId: number,dataStorageType: DataStorageType){
    this.dataList = JSON.parse(localStorage.getItem('StorageData'));
    if(this.dataList){
      if(dataStorageType = DataStorageType.QuickNotes){
          const QNDataList = this.getQNData(DataStorageType.QuickNotes, userId, entityId);
          if(QNDataList && QNDataList.length){
            const removeIndex = this.dataList.indexOf(QNDataList[0]);
            const deletedNotes = this.dataList.splice(removeIndex, 1);
            localStorage.setItem('StorageData',JSON.stringify(this.dataList || []));
          }
      }
    }
  }
}
