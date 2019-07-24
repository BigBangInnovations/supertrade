// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { DatePipe } from "@angular/common";

// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store, select } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { EncrDecrServiceService } from '../../../core/auth/_services/encr-decr-service.service'
// Models
import { DistributorSale, DistributorSaleDataSource, DistributorSaleDeleted, DistributorSalePageRequested, UserPointsStatus } from '../../../core/distributorSale';
import { AppState } from '../../../core/reducers';
import { QueryParamsModel } from '../../../core/_base/crud';
//
import { getSalesActiveScheme } from '../../../core/auth/_selectors/auth.selectors';
import { environment } from '../../../../environments/environment';
// Components
import { ViewDistributorSaleComponent } from './view-distributorSale/view-distributorSale.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-distributorSale-list',
	templateUrl: './distributorSale.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['distributorSale.component.scss'],
	providers: [DatePipe]
})
export class DistributorSaleListComponent implements OnInit, OnDestroy {

	// Public params
	filterForm: FormGroup;
	hasDateError: boolean = false;
	// Table fields
	dataSource: DistributorSaleDataSource;
	displayedColumns = ["date", "invoice_id", "scheme_id", "total_quantity", "total_amount", "total_loyalty_point", "total_loyalty_boost_point", 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	@ViewChild('startDateInput', { static: true }) startDateInput: ElementRef;
	@ViewChild('endDateInput', { static: true }) endDateInput: ElementRef;
	// @ViewChild('filterButton', {static: true}) filterButton: ElementRef;
	// Selection
	selection = new SelectionModel<DistributorSale>(true, []);
	distributorSaleResult: DistributorSale[] = [];
	userPointsResult: UserPointsStatus[] = [];
	salesActiveScheme: string;
	salesActiveSchemeDetail: any[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];
	progressBarValue: number;
	accumulated_points: number;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param dialog: MatDialog
	 * @param snackBar: MatSnackBar
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param EncrDecr: EncrDecrServiceService
	 * @param fb: FormBuilder
	 */
	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private EncrDecr: EncrDecrServiceService,
		private fb: FormBuilder,
		private datePipe: DatePipe
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// this.initFilterForm();

		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadDistributorSaleList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
		// 	// tslint:disable-next-line:max-line-length
		// 	debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 	distinctUntilChanged(), // This operator will eliminate duplicate values
		// 	tap(() => {
		// 		this.paginator.pageIndex = 0;
		// 		this.loadDistributorSaleList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);

		// Filtration, bind to searchInput
		// const searchSubscription = fromEvent(this.filterButton.nativeElement, 'click').pipe(
		// 	// tslint:disable-next-line:max-line-length
		// 	debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 	distinctUntilChanged(), // This operator will eliminate duplicate values
		// 	tap(() => {
		// 		this.paginator.pageIndex = 0;
		// 		this.loadDistributorSaleList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new DistributorSaleDataSource(this.store);

		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.distributorSaleResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		//user points START
		const userPointsSubscription = this.dataSource.userPointsSubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {

			if (res.accumulated_points !== undefined) {
				this.userPointsResult = res;
				let sessionStorage = this.EncrDecr.getLocalStorage(environment.localStorageKey);
				sessionStorage = JSON.parse(sessionStorage)
				let salesActiveScheme = sessionStorage.salesActiveScheme.filter((item: any) => {
					return item.from <= res.accumulated_points && item.to >= res.accumulated_points;
				});
				if (salesActiveScheme.length <= 0) {
					salesActiveScheme = sessionStorage.salesActiveScheme[0];
				} else {
					salesActiveScheme = salesActiveScheme[0];
				}
				this.accumulated_points = res.accumulated_points;
				this.progressBarValue = (res.accumulated_points * 100) / salesActiveScheme.to
				this.salesActiveSchemeDetail = salesActiveScheme
			}
		});
		this.subscriptions.push(userPointsSubscription);
		//user points END

		// First load
		// of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
		this.loadDistributorSaleList();
		// });
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	// initFilterForm() {
	// 	this.filterForm = this.fb.group({
	// 		start_date: [''],
	// 		end_date: ['']
	// 	}, validateDate);

	// 	function validateDate(group: FormGroup) {
	// 		const invalid = group.get('start_date').value > group.get('end_date').value;
	// 		return invalid ? { 'invalidDate': true } : null;
	// 	}
	// }

	/*
	* filter form submit
	*/
	// submit() {
	// 	const controls = this.filterForm.controls;
	// 	/** check form */
	// 	if (this.filterForm.invalid) {
	// 		Object.keys(controls).forEach(controlName =>
	// 			controls[controlName].markAsTouched()
	// 		);
	// 		return;
	// 	}
	// }

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load DistributorSale List
	 */
	loadDistributorSaleList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.store.select(getSalesActiveScheme).pipe(take(1)).subscribe(data => {
			this.hasDateError = false;
			let startDate = this.startDateInput.nativeElement.value
			let endDate = this.endDateInput.nativeElement.value

			this.salesActiveScheme = data;
			let httpParams = new HttpParams();
			//filter
			if (startDate != '' || endDate != '') {
				if (startDate != '' && endDate != '' && new Date(startDate) <= new Date(endDate)) {
					let myFormattedStartDate = this.datePipe.transform(new Date(startDate), 'yyyy-MM-dd');
					let myFormattedEndDate = this.datePipe.transform(new Date(endDate), 'yyyy-MM-dd');
					httpParams = httpParams.append('start_date', myFormattedStartDate);
					httpParams = httpParams.append('end_date', myFormattedEndDate);
				} else {
					this.hasDateError = true;
					return;
				}
			}
			httpParams = httpParams.append('scheme_id', this.salesActiveScheme);
			// Call request from server
			this.store.dispatch(new DistributorSalePageRequested({ page: queryParams, body: httpParams }));
			this.selection.clear();
		});

	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
		// filter.title = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete distributorSale
	 *
	 * @param _item: DistributorSale
	 */
	deleteDistributorSale(_item: DistributorSale) {
		const _title: string = 'User DistributorSale';
		const _description: string = 'Are you sure to permanently delete this distributorSale?';
		const _waitDesciption: string = 'DistributorSale is deleting...';
		const _deleteMessage = `DistributorSale has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new DistributorSaleDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadDistributorSaleList();
		});
	}

	/** Fetch */
	/**
	 * Fetch selected rows
	 */
	// fetchDistributorSale() {
	// 	const messages = [];
	// 	this.selection.selected.forEach(elem => {
	// 		messages.push({
	// 			text: `${elem.title}`,
	// 			id: elem.id.toString(),
	// 			// status: elem.username
	// 		});
	// 	});
	// 	this.layoutUtilsService.fetchElements(messages);
	// }

	/**
	 * Add distributorSale
	 */
	addDistributorSale() {
		const newDistributorSale = new DistributorSale();
		newDistributorSale.clear(); // Set all defaults fields
		this.editDistributorSale(newDistributorSale);
	}

	/**
	 * Edit distributorSale
	 *
	 * @param distributorSale: DistributorSale
	 */
	editDistributorSale(distributorSale: DistributorSale) {
		const _saveMessage = `DistributorSale successfully has been saved.`;
		const _messageType = distributorSale.id ? MessageType.Update : MessageType.Create;
		// const dialogRef = this.dialog.open(DistributorSaleEditDialogComponent, { data: { distributorSaleId: distributorSale.id } });
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
		// 	this.loadDistributorSaleList();
		// });
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.distributorSaleResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.distributorSaleResult.length) {
			this.selection.clear();
		} else {
			this.distributorSaleResult.forEach(row => this.selection.select(row));
		}
	}

	//Calculate total amount
	totalAmount(product) {
		let totalAmount = 0;
		product.forEach(function (value) {
			totalAmount += value.ProductAmount;
		});
		return totalAmount;
	}

	//Calculate total quantity
	totalQuantity(product) {
		let totalQuantity = 0;
		product.forEach(function (value) {
			totalQuantity += value.Quantity;
		});
		return totalQuantity;
	}

	//Calculate totalLoyaltyPoints
	totalLoyaltyPoints(product) {
		let totalLoyaltyPoints = 0;
		product.forEach(function (value) {
			totalLoyaltyPoints += value.points;
		});
		return totalLoyaltyPoints;
	}

	//Calculate totalBoostPoints
	totalBoostPoints(product) {
		let totalBoostPoints = 0;
		product.forEach(function (value) {
			totalBoostPoints += value.points_boost;
		});
		return totalBoostPoints;
	}

	/** 
	 * View distributorSale in popup
	 */
	viewDistributorSale(distributorSaleId, action) {
		const dialogRef = this.dialog.open(ViewDistributorSaleComponent, {
			data: { distributorSaleId: distributorSaleId, action: action },
			width: '600px',
			height: '550px'
		});
		dialogRef.afterClosed().subscribe(res => {
			if (action == 'distributorSaleReturn' && res == 'reload')
				this.loadDistributorSaleList();
		});
	}
}