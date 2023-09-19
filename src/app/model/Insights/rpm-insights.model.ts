import { BGDeviceDataDto, PulseOximetryDataDto, WeightDataDto } from './../rpm.model';
import { BPDeviceDataDto, PHDeviceDto } from 'src/app/model/rpm.model';
export class RpmDeviceWTReading {
  phDevice = new PHDeviceDto();
  weightData: WeightDataDto[];
}
export class RpmDeviceBPReading {
  phDevice = new PHDeviceDto();
  bloodPressureData: BPDeviceDataDto[];
}
export class RpmDevicePOReading {
  phDevice = new PHDeviceDto();
  pulseOximetryData: PulseOximetryDataDto[];
}

export class RpmDeviceBGReading {
  phDevice = new PHDeviceDto();
  bloodGlucoseData: BGDeviceDataDto[];
}

export class RPMInsightsDataDto {
  rpmDeviceATReading?: any;
  rpmDeviceBGReading = new RpmDeviceBGReading();
  rpmDeviceBPReading = new RpmDeviceBPReading();
  rpmDevicePOReading = new RpmDevicePOReading();
  rpmDeviceWTReading = new RpmDeviceWTReading();
}
