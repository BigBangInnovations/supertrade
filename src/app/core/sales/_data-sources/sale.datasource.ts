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
import { selectQueryResult, selectSalesPageLoading, selectSalesShowInitWaitingMessage } from '../_selectors/sale.selectors';

export class SalesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectSalesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectSalesShowInitWaitingMessage)
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