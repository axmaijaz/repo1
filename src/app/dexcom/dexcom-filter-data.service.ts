import { Injectable } from "@angular/core";
import { AlertSetting, DexcomStatisticsResDto } from "../model/Dexcom.model";
import { DexcomEgvDataResultDto } from "../model/rpm.model";
import { CalibrationRecord } from 'src/app/model/rpm.model';

@Injectable({
  providedIn: 'root'
})
export class DexcomFilterDataService {

  statisticsData = new DexcomStatisticsResDto();
  egvsData = new DexcomEgvDataResultDto();
  constructor() {

  }

  createDexcomStatisticsData(dexcomAvgs: DexcomEgvDataResultDto) {
    this.egvsData = dexcomAvgs;
    const totalSum = 0;
    const totalLength = dexcomAvgs.records?.length ?? 1;
    if (dexcomAvgs.records?.length) {
      const values = dexcomAvgs.records!.map((e) => e.value!);

      this.statisticsData.min =
          values.reduce((current, next) => current > next ? next : current);
      this.statisticsData.max =
          values.reduce((current, next) => current > next ? current : next);
      this.statisticsData.mean =
          ((values.reduce((a, b) => a + b))) / totalLength as number;
      this.statisticsData.sum = ((values.reduce((a, b) => a + b)));
      this.statisticsData.median = this._calculateMedian(values);

      // if ((totalLength / 2).remainder(2) == 1) {
      //   statisticsData.median = (values[(totalLength / 2).floor()]).toDouble();
      // } else {
      //   a = values[(totalLength / 2).toInt()];
      //   b = values[(totalLength / 2).toInt() + 1];
      //   statisticsData.median = (a + b) / 2;
      // }

      // Calculate the average of all the numbers
      const calculateMean = (values) => {
        const mean = (values.reduce((sum, current) => sum + current)) / values.length;
        return mean;
      };
      const variance = (items1) => {
        const average = calculateMean(items1);
        const squareDiffs = items1.map((value) => {
            const diff = value - average;
            return diff * diff;
        });
        const variance = calculateMean(squareDiffs);
        return variance;
      };

      const sqrt = (variance) => {
        return Math.sqrt(variance);
      };
      // Calculate the standard deviation

      this.statisticsData.variance = variance(values);
      const standardDeviation = sqrt(this.statisticsData.variance);
      this.statisticsData.stdDev = standardDeviation;
      this.statisticsData.q1 = this._caculateQ1(values);
      this.statisticsData.q2 = this._caculateQ2(values);
      this.statisticsData.q3 = this._caculateQ3(values);
    }
    return this.statisticsData;
  }

  _calculateMedian(values){
    if(values.length ===0) throw new Error("No inputs");

    values.sort(function(a,b){
      return a-b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
      return values[half];

    return (values[half - 1] + values[half]) / 2.0;
  }

  _caculateQ1(egvData: number[]) {
    egvData.sort();
    // Calculate the median of the EGV data
    const median = this._calculateMedian(egvData);
    // Divide the EGV data into two halves
    const lowerHalf = egvData.slice(0, egvData.indexOf(Math.floor(median)));
    // const upperHalf = egvData.slice(egvData.indexOf(median.toInt()) + 1);
    // Calculate the median of the lower half
    const firstQuartile = this._calculateMedian(lowerHalf);
    return firstQuartile;
  }

  _caculateQ2(egvData: number[]) {
    egvData.sort();
    // Calculate the median of the EGV data
    const median = this._calculateMedian(egvData);

    return median;
  }

  _caculateQ3(egvData: number[]) {
    egvData.sort();
    // Divide the EGV data into two halves
    const median = this._calculateMedian(egvData) as number;
    // const lowerHalf = egvData.slice(0, egvData.indexOf(median.toInt()));
    const upperHalf = egvData.slice(egvData.indexOf(Math.floor(median)) + 1);

    // Calculate the median of the upper half
    const thirdQuartile = this._calculateMedian(upperHalf);

    return thirdQuartile;
  }
  _calculateAlertSettingsPercentage(alertSettings: AlertSetting[]) {
    let rise = 0.0;
    let outOfRange = 0.0;
    let high = 0.0;
    let fall = 0.0;
    let urgentLow = 0.0;
    let low = 0.0;
    alertSettings.forEach((element) => {
      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "rise".toLowerCase()) {
        rise = element.value!;
      }

      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "outOfrange".toLowerCase()) {
        outOfRange = element.value!;
      }

      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "high".toLowerCase()) {
        high = element.value!;
      }

      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "fall".toLowerCase()) {
        fall = element.value!;
      }

      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "urgentlow".toLowerCase()) {
        urgentLow = element.value!;
      }

      if (element.alertName?.replace(/\s+/g, "").toLowerCase() == "low".toLowerCase()) {
        low = element.value!;
      }
    });
    if (this.egvsData.records != null) {
      const values = this.egvsData.records!.map((e) => e.value);

      // const highList = values.filter((element) => element >= high)

      // const lowList = values
      //     .filter((element) =>
      //         ( element <= fall) && element > urgentLow);

      // const urgentLowList =
      //     values.filter((element) => element <= urgentLow);

      // const inRangeList =
      //     values.filter((element) => element > low && element < high);

      const highList = values.filter((element) => element >= high);

      const lowList = values.filter((element) => element <= low && element > urgentLow);

      const urgentLowList = values.filter((element) => element <= urgentLow);

      const inRangeList = values.filter((element) => element > low && element < high);

      this.statisticsData.nAboveRange = highList.length;
      this.statisticsData.nBelowRange = lowList.length;
      this.statisticsData.nUrgentLow = urgentLowList.length;
      this.statisticsData.nWithinRange = inRangeList.length;
      this.statisticsData.nValues = values.length;
      this.statisticsData.percentAboveRange = this._percentage(highList.length, values.length);
      this.statisticsData.percentBelowRange = this._percentage(lowList.length, values.length);
      this.statisticsData.percentWithinRange = this._percentage(inRangeList.length, values.length);
      this.statisticsData.percentUrgentLow = this._percentage(urgentLowList.length, values.length);
    }
  }

  _calculateMeandailyCalibrations(records: CalibrationRecord[]) {
    const value = records!.map((e) => e.value!);
    this.statisticsData.meanDailyCalibrations = value.reduce((sum, next) => sum + next) / value.length;
  }

  _percentage(a, b) {
    return (a / b) * 100;
  }
}
