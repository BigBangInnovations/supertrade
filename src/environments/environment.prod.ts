export const environment = {
	production: true,
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
	apiEndpoint: 'http://34.219.152.38/superloyaldevapi/',
	// apiEndpoint: 'http://localhost/superloyalapi/superloyalapi/',
	encKey: '$bigang_Secure@production',
	localStorageKey:'_K'
};