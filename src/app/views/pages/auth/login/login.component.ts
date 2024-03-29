// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login, LoginSuccess } from '../../../../core/auth';
import { HttpParams } from "@angular/common/http";

import { APP_CONSTANTS } from '../../../../../config/default/constants'

import { isLoggedIn, isRetailer, isDistributor } from '../../../../core/auth/_selectors/auth.selectors';

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;

	// isLoggedIn$: Observable<boolean>;
	errors: any = [];

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});

		/* Redirect if already loagin */
		this.store.select(isLoggedIn).subscribe(data => {
			if (data === true) {
				this.router.navigateByUrl(this.returnUrl);
			}
		});

	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		// if (!this.authNoticeService.onNoticeChanged$.getValue()) {
		// 	const initialNotice = `Use account
		// 	<strong>${DEMO_PARAMS.EMAIL}</strong> and password
		// 	<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
		// 	this.authNoticeService.setNotice(initialNotice, 'info');
		// }

		this.loginForm = this.fb.group({
			mobile_no: ['8866228982', Validators.compose([
				Validators.required,
				// Validators.pattern(/^[6-9]\d{9}$/),
				Validators.minLength(10),
				Validators.maxLength(15) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: ['45298', Validators.compose([
				Validators.required,
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		// const authData = {
		// 	mobile_no: controls['mobile_no'].value,
		// 	password: controls['password'].value
		// };
		const values = this.loginForm.value;
		const keys = Object.keys(values);

		let httpParams = new HttpParams();
		httpParams = httpParams.append('device_name', 'web');
		Object.keys(values).forEach(function (key) {
			httpParams = httpParams.append(key, values[key]);
		});

		this.auth
			.logIn(httpParams)
			.pipe(
				tap(response => {
					if (response.status == APP_CONSTANTS.response.SUCCESS) {
						/*
						* Filter data
						* Get active loyalty scheme
						*/
						let purchaseActiveScheme = response.data[0].active_loyalty.filter((item: any) => {
							return item.slab_on == 'purchase' && new Date(item.start_date).getTime() <= new Date().getTime() && new Date(item.end_date).getTime() >= new Date().getTime();
						});
						let salesActiveScheme = response.data[0].active_loyalty.filter((item: any) => {
							return item.slab_on == 'sales' && new Date(item.start_date).getTime() <= new Date().getTime() && new Date(item.end_date).getTime() >= new Date().getTime();
						});

						/** 
						 * get active loyalty booster scheme
						 */
						let purchaseActiveSchemeBooster = response.data[0].active_loyalty_booster.filter((item: any) => {
							return item.slab_on == 'purchase' && new Date(item.start_date).getTime() <= new Date().getTime() && new Date(item.end_date).getTime() >= new Date().getTime();
						});
						let salesActiveSchemeBooster = response.data[0].active_loyalty_booster.filter((item: any) => {
							return item.slab_on == 'sales' && new Date(item.start_date).getTime() <= new Date().getTime() && new Date(item.end_date).getTime() >= new Date().getTime();
						});

						if (purchaseActiveScheme.length < 1) {
							this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.NO_ACTIVE_PURCHASE_SCHEME'), 'info');
						} else if (salesActiveScheme.length < 1) {
							this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.NO_ACTIVE_SALES_SCHEME'), 'info');
						} else {
							response.data[0].user['salesActiveScheme'] = salesActiveScheme;
							response.data[0].user['salesActiveSchemeBooster'] = salesActiveSchemeBooster;
							response.data[0].user['purchaseActiveScheme'] = purchaseActiveScheme;
							response.data[0].user['purchaseActiveSchemeBooster'] = purchaseActiveSchemeBooster;
							this.store.dispatch(new LoginSuccess(response.data[0].user));
							this.router.navigateByUrl(this.returnUrl);
						}
					} else {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
