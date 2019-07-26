// Angular
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
// import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// Services
import { MetadataService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Actions
import * as fromMetadataAction from '../_actions/metadata.actions';
import { APP_CONSTANTS } from '../../../../config/default/constants'
import { AuthNoticeService, Logout } from '../../../core/auth';
// Translate
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class MetadataEffects { 
    @Effect()
    loadAllMetadata$ = this.actions$
        .pipe(
            ofType<fromMetadataAction.LoadMetadata>(fromMetadataAction.MetadataActionTypes.LOAD_METADATA),
            mergeMap((action: fromMetadataAction.LoadMetadata) => this.metadataService.getAllmetadata(action.payload)),
            map((response) => {
                if (response.status == APP_CONSTANTS.response.SUCCESS) {
                    let metadataArray = (response.data[0]) ? response.data[0] : [];
                    return new fromMetadataAction.LoadMetadataSuccess(metadataArray);
                }else if (response.status == APP_CONSTANTS.response.ERROR) {
                    return new fromMetadataAction.LoadMetadataFail(response.message);
                }else {
                    this.authNoticeService.setNotice(this.translate.instant('AUTH.REPONSE.INVALID_TOKEN'), 'danger');
                    return new Logout()
                }
            }),
            catchError(err => of(new fromMetadataAction.LoadMetadataFail(err)))
        );

    constructor(
        private actions$: Actions, 
        private metadataService: MetadataService, 
        private store: Store<AppState>,
        private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
        ) { }
}