
export class SSAddressDto {
    line = new Array<string>();
    city = '';
    postalCode = 0;
    state = '';
}
export class SSLocationDto {
  name = '';
  address = new SSAddressDto();
}
export class SupportedSystemDto  {
  id = 0;
  name = '';
  resource_url = '';
  logo = '';
  api_version = '';
  status = '';
  locations = new SSLocationDto();
}
