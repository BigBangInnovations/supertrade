// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
// Selectirs
import { selectQueryResult, selectDistributorSalePageLoading, selectDistributorSaleShowInitWaitingMessage } from '../_selectors/distributorSale.selectors';

export class DistributorSaleDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectDistributorSalePageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectDistributorSaleShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
			this.userPointsSubject.next(response.userPoints);
		});

	}
}