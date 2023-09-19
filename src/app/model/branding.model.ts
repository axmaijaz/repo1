export class AddBrandingDto {
    id: string;
    name: string;
    src: string;
    height: number;
    width: number;
    percentage?: number;
    uploading?: boolean;
}

export class AppThemeDto {
  primaryColor: string;
  secondaryColor: string;
  sideNavBarColor: string;
}
