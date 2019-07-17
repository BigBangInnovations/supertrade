// Angular
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Purchase, UserPointsStatus } from '../../../core/purchase/_models/purchase.model'
// RxJS
import { Observable, Subject } from 'rxjs'; 
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
//dashboard
import { getDashboardPurchases, getDashboardPurchasesUsePoints, getError, DashboardService, DashboardActionType, Action, LoadDashboardPurchases, LoadDashboardPurchasesSuccess, LoadDashboardPurchasesFail, getDashboardPurchasesLoading } from '../../../core/dashboard';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { HttpParams } from "@angular/common/http";
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush,
	// providers: [NgbProgressbarConfig]
})
export class DashboardComponent implements OnInit {
	// purchases$: Observable<Purchase[]>;
	// purchasesPoints$: Observable<Object>;
	// error$: Observable<String>;
	// private unsubscribe: Subject<any>;
	// dashboardPurchaseloading$: Observable<boolean>;

	/**
	 * Component constructor 
	 *
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 */
	constructor(
		private translate: TranslateService,
		private store: Store<AppState>,
		config: NgbProgressbarConfig
	) {
		// this.unsubscribe = new Subject();
		// config.height = '20px';
	}

	ngOnInit() {
		// let httpParams = new HttpParams();
		// httpParams = httpParams.append('scheme_id', 'PUR003');
		// this.store.dispatch(new LoadDashboardPurchases(httpParams));
		// this.purchases$ = this.store.pipe(select(getDashboardPurchases));
		// this.purchasesPoints$ = this.store.pipe(select(getDashboardPurchasesUsePoints));
		// this.error$ = this.store.pipe(select(getError));
		// this.dashboardPurchaseloading$ = this.store.pipe(select(getDashboardPurchasesLoading));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// this.unsubscribe.next();
		// this.unsubscribe.complete();
	}

	//Calculate total amount
	totalAmount(product){
		let totalAmount = 0;
		product.forEach(function (value) {
			totalAmount += value.ProductAmount;
		  });
		  return totalAmount;
	}

	//Calculate total quantity
	totalQuantity(product){
		let totalQuantity = 0;
		product.forEach(function (value) {
			totalQuantity += value.Quantity;
		  });
		  return totalQuantity;
	}

	//Calculate totalLoyaltyPoints
	totalLoyaltyPoints(product){
		let totalLoyaltyPoints = 0;
		product.forEach(function (value) {
			totalLoyaltyPoints += value.points;
		  });
		  return totalLoyaltyPoints;
	}

	//Calculate totalBoostPoints
	totalBoostPoints(product){
		let totalBoostPoints = 0;
		product.forEach(function (value) {
			totalBoostPoints += value.points_boost;
		  });
		  return totalBoostPoints;
	}

	getCurrentActiveSlab(){
		
	}
}
