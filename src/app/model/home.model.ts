import { AWServiceStatus } from "../Enums/aw.enum";
import { BhiStatusEnum } from "../Enums/bhi.enum";
import { CcmStatus, PatientStatus, RpmStatus, SortOrder } from "../Enums/filterPatient.enum";
import { PcmStatus } from "../Enums/pcm.enum";
import { PRCMStatusEnum } from "./Prcm/Prcm.model";
import { TcmStatusEnum } from "./Tcm/tcm.enum";

export class LandingPageParamsDto {
		searchParam = '';
		facilityId = 0;
    payerIds: number[] = [];
    filterBy = 1;
    patientStatus = [0];
    sortBy = '';
		sortOrder: SortOrder = 0;
    pageSize = 10;
    pageNumber = 1;
	}

  export class PatientForPendingPageListDto {
		fullName: string;
    id = 0;
		patientEmrId: string;
		dateOfBirth: Date | string;
    profileStatus: boolean;
    isDeletedState: boolean;
    patientStatus: PatientStatus;
		ccmStatus: CcmStatus;
    hhcEndDate = "";
    hhcEndDateClass = "";
		pcmStatus: PcmStatus;
		bhiStatus: BhiStatusEnum;
		prCMStatus: PRCMStatusEnum;
		tcmStatus: TcmStatusEnum;
		rpmStatus: RpmStatus;
		awServiceStatus: AWServiceStatus;
    telephonyCommunication: boolean;

	}
