// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { debug } from 'util';
import { environment } from '../../../../../environments/environment'
import { EncrDecrServiceService } from '../../../auth/_services/encr-decr-service.service';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	constructor(
		private EncrDecr: EncrDecrServiceService,

	) { }
	// intercept request and add token
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
		// modify request
		const userSession = this.EncrDecr.getLocalStorage(environment.localStorageKey)

		let clonedRequest = request.clone({
			setHeaders: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: '*/*'
			},
			url: this.fixUrl(request.url),
		});

		//Set token id in body(Request)
		if (clonedRequest.method != 'GET') {
			if (!clonedRequest.body.has('device_name')) {
				clonedRequest = clonedRequest.clone({
					body: clonedRequest.body.append('device_name', 'web'),
				})
			}

			if (!clonedRequest.body.has('token_id') && userSession != null) {
				clonedRequest = clonedRequest.clone({
					body: clonedRequest.body.append('token_id', JSON.parse(userSession).Security_Token),
				})
			}

			//Set compnay id in body(Request)
			if (!clonedRequest.body.has('company_id') && userSession != null) {
				clonedRequest = clonedRequest.clone({
					body: clonedRequest.body.append('company_id', JSON.parse(userSession).Company_ID),
				})
			}

			//Set user id in body(Request)
			if (!clonedRequest.body.has('user_id') && userSession != null) {
				clonedRequest = clonedRequest.clone({
					body: clonedRequest.body.append('user_id', JSON.parse(userSession).ID),
				})
			}
		}
		// console.log('----request----');
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(clonedRequest).pipe(
			tap(
				event => {
					if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.body);
						// console.log(event.status);
					}
				},
				error => {
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					console.error(error.status);
					console.error(error.message);
					// console.log('--- end of response---');
				}
			)
		);
	}

	private fixUrl(url: string) {
		if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
			return url;
		} else {
			return environment.apiEndpoint + url;
		}
	}
}
