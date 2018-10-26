/*
* Create and export configuration variables
*
*/

//Container for all the enviroments
let environments = {};

//Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging'
};

environments.production = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'production'
}

//Determine which enviroment was passed as a command line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ' ';

//Check thtat the current environment isone of the environments above, if not, default to Staging

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
