export class RPMComplainceListDto {
	rpmId: number;
	patientId: number;
	facilityId: number;
	patientName: string;
	muteStatus: boolean;
	days: number;
	muteFrom: string;
	muteTo: string;
	mutedBy: string;
	mutedDate: string;
}
export class RpmComplainceEditDto {
	patientId: number;
	muteFrom: string;
	muteTo: string;
}
