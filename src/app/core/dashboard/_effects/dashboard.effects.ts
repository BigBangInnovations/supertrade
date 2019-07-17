// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// Services
import { DashboardService } from '../../../core/dashboard/_services/dashboard.services';
// State
import { AppState } from '../../../core/reducers';
// Store
import { AuthNoticeService, Logout } from '../../../core/auth';

import * as dashboardAction from '../_actions/dashboard.actions';
// import { Purchase } from '../../purchase/_models/purchase.model';
import { CommonResponse } from '../../common/common.model';

import { APP_CONSTANTS } from '../../../../config/default/constants'

// Translate
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DashboardEffects {

    @Effect()
    loadPurchases$ = this.actions$.pipe(
        ofType(dashboardAction.DashboardActionType.LOAD_PURCHASES),
        mergeMap((action: dashboardAction.LoadDashboardPurchases) =>
            this.dashboardServices.getPurchases(action.payload).pipe(
                map(
                    (response: CommonResponse) =>{
                        if(response.status == APP_CONSTANTS.response.SUCCESS){
                            return new dashboardAction.LoadDashboardPurchasesSuccess(response)
                        }else if(response.status == APP_CONSTANTS.response.ERROR){
                            return new dashboardAction.LoadDashboardPurchasesFail(response.message)
                        }else {
                            this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                            return new Logout()
                        }
                    }
                        
                ),
                catchError(err => of(new dashboardAction.LoadDashboardPurchasesFail(err)))
            )
        )
    );

    constructor(
        private actions$: Actions, 
        private dashboardServices: DashboardService, 
        private store: Store<AppState>,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}