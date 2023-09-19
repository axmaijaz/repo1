// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  // baseUrl: 'https://api.healthforcehub.link/api/',
  baseUrl: 'https://api.healthforcehub.link/api/',
  appUrl: 'https://app.healthforcehub.link/',
  // baseUrl: 'http://localhost:5000/api/',
  //  baseUrl: 'http://e0f3bd4b904a.ngrok.io/api/' ,
  // baseUrl: "http://192.168.10.2:5000/api/",  // imran bhai PC
  // baseUrl: 'http://ccm-dev.us-east-1.elasticbeanstalk.com/api/',
  localBaseUrl: 'http://localhost:5000/api/',
  // http://localhost:5000/MRTypesMvc

  PublishKey: 'pub-c-f447e405-b5ef-4816-b679-4d888032d1f4',
  SubscribeKey: 'sub-c-9fa3ffc8-684a-11ea-be06-76a98e4db888',
  //  PublishKey: "pub-c-a810964d-c7d4-4df2-b1d7-a63608dc49e1",
  //  SubscribeKey: "sub-c-b3acf020-5c29-11e9-a6e0-8a4660381032",
  accessKeyAws: 'AKIAYVREBNGIADT7AAHB',
  secretKeyAws: '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',
  bucketAws: 'healthforce-data-dev',
  bucketMediaAws: 'healthforce-media-testing',
  logoAws: 'healthforce-public-dev',
  logrocket: '9j3p3a/rpm',

  gitBranchName: 'MonthlyReview / Imran Khan',
  buildDate: '05/03/2020 03:23:57 PM ',



  blueButtonAuthCodeUrl:
    'https://sandbox.bluebutton.cms.gov/v1/o/authorize/?client_id=WaIHVVax5cHoukh09bPwLL3yulXEcIB2w8SvxqnH&redirect_uri=http://localhost:4200/admin/bluebutton&response_type=code&state={test1}'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
