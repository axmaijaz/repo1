import { PcmEncounterStatus } from '../pcm/pcm.model';

export class SuperBillDto {
  id: number;
  status: PcmEncounterStatus;
  cpt99203: boolean;
  cpt99204: boolean;
  cpt99205: boolean;
  cpt99212: boolean;
  cpt99213: boolean;
  cpt99214: boolean;
  cptG0506: boolean;
  cptIncidentTo99212: boolean;
  cptIncidentTo99213: boolean;
  cptIncidentTo99214: boolean;
  cptG0101: boolean;
  cptG0091: boolean;
  cptG0402: boolean;
  cptG0438: boolean;
  cptG0439: boolean;
  cpt96160: boolean;
  cpt99387: boolean;
  cptG0442: boolean;
  cptG0446: boolean;
  cpt99497: boolean;
  cptG0444: boolean;
  cpt99495: boolean;
  cpt99496: boolean;
  cpt1111F: boolean;
  cpt99406: boolean;
  cpt99407: boolean;
  cptG0296: boolean;
  cpt95251: boolean;
  cptG0473: boolean;
  cptG0505: boolean;
  cptG8420: boolean;
  cptG8417: boolean;
  cptG8418: boolean;
  cptG8422: boolean;
  cptG8752: boolean;
  cptG8754: boolean;
  cpt4004F: boolean;
  cpt1036F: boolean;
  cptG8510: boolean;
  cptG8431: boolean;
  cptG9717: boolean;
  cpt1100F: boolean;
  cpt3288F: boolean;
  cpt1101F: boolean;
  cpt4040F: boolean;
  cptG8482: boolean;
  cptG8483: boolean;
  cpt3017F: boolean;
  cptG9711: boolean;
  cptG9899: boolean;
  cptG9708: boolean;
  cpt3044F: boolean;
  cpt3045F: boolean;
  cpt3051F: boolean;
  cpt3052F: boolean;
  cpt2024F: boolean;
  cpt3072F: boolean;
  cpt2022F: boolean;
  cpt3060F: boolean;
  cpt3061F: boolean;
  cpt3066F: boolean;
  cptG8506: boolean;
  cptG8598: boolean;
  cptG9724: boolean;
  cptG9664: boolean;
  cptG9781: boolean;
  cpt1125F: boolean;
  cpt1160F: boolean;
  allergy: boolean;

  cpt99385: boolean;
	cpt99386: boolean;
	cpt99395: boolean;
	cpt99396: boolean;
	cpt99397: boolean;
  echo: boolean;
  carotid: boolean;
  a3: boolean;
  dexa: boolean;
  dxCodes: string;
  notes: string;
  retinaVue: boolean;
  cognitiveCare: boolean;
  rd: boolean;
  abiLegUs: boolean;
  ccm: boolean;
  bhi: boolean;
  cgm: boolean;
  spirometry: boolean;
  gwmtWwe: boolean;
  awv: boolean;
  weightClinic: boolean;
  awEncounterId: number;
  gapsData: string;
  signature: string;
	signatureDate: Date | string | null;
}

export class SuperbillHoverDto
    {
        bmi = '';
        htn = '';
        tobacco = '';
        depression = '';
        fallRisk = '';
        pv = '';
        iv = '';
        cc = '';
        sm = '';
        ac = '';
        dn = '';
    }
