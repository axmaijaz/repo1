var replace = require('replace-in-file');
const moment = require('moment');
var exec = require('child_process').execSync;
var buildDate = moment(new Date()).format("MM/DD/YYYY hh:mm:ss A z");
const options = {
  files: ['src/environments/environment.ts', 'src/environments/environment.prod.ts', 'src/environments/environment.test.ts'],
  from: /buildDate: '(.*)'/g,
  to: `buildDate: '` + buildDate + `'`,
  allowEmptyPaths: false,
};
const gitBranchName = exec('git branch --show-current');
const gitUserName = exec('git config user.name');
const writeBranch = {
  files: ['src/environments/environment.ts', 'src/environments/environment.prod.ts', 'src/environments/environment.test.ts'],
  from: /gitBranchName: '(.*)'/g,
  to: `gitBranchName: '` + gitBranchName.toString().trim() + ` / ${gitUserName.toString().trim()}'`,
  allowEmptyPaths: false,
};


try {
  let results = replace.sync(options);
  let results2 = replace.sync(writeBranch);
  const changedFiles = results.filter(result => result.hasChanged)
    .map(result => result.file);
  console.log('Build version set: ' + gitBranchName);
}
catch (error) {
  console.error('Error occurred:', error);
}
