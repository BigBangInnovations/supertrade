// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	isMockEnabled: false, // You have to switch this, when your real back-end is done
	authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
	// TEST Environment
	// superSALESApi: 'http://supersales.co:8080/salesprotest/',
	// commonServiceApi: 'http://bigbangcommonservice.info:8080/commonServices3/',
	// apiEndpoint: 'http://34.219.152.38/superloyaltestapi/',
	// apiEndpoint: 'http://localhost/superloyalapi/superloyalapi/',

	// Development Environment
	superSALESApi: 'http://supersales.co:8080/salesprodev/',
	superSALESApiLiveTest: 'http://supersales.co:8080/salesproprodtracking/',
	commonServiceApiLiveTest: 'http://bigbangcommonservice.info:8080/commonServicesTestProduction/',
	commonServiceApi: 'http://bigbangcommonservice.info:8080/commonServices10/',
	
	// apiEndpoint: 'http://34.219.152.38/superloyaldevapi/',
	apiEndpoint: 'http://localhost/superloyalapi/superloyalapi/',
	encKey: '$bigang_Secure@production',
	localStorageKey:'_K'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
