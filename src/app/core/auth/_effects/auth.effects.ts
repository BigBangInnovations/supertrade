// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, 
    // Register, UserLoaded, UserRequested, 
    LoginSuccess, AuthSuccess } from '../_actions/auth.actions';
import { AuthService } from '../_services/index';
import { AppState } from '../../reducers';
import { environment } from '../../../../environments/environment';
// import { isUserLoaded } from '../_selectors/auth.selectors';
import { EncrDecrServiceService } from '../_services/encr-decr-service.service'

@Injectable()
export class AuthEffects {
    @Effect({dispatch: false})
    login$ = this.actions$.pipe(
        ofType<Login>(AuthActionTypes.Login),
        tap(action => {
            // localStorage.setItem(environment.authTokenKey, action.payload.authToken);
            // this.store.dispatch(new UserRequested());
        }),
    );

    @Effect({dispatch: false})
    LogInSuccess$ = this.actions$.pipe(
        ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
        tap(action => {
            this.EncrDecr.setLocalStorage(environment.localStorageKey, JSON.stringify(action.payload))
        }),
    );

    @Effect({dispatch: false})
    logout$ = this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.Logout),
        tap((action) => {
            sessionStorage.removeItem(environment.localStorageKey);
			this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
        })
    );

    // @Effect({dispatch: false})
    // register$ = this.actions$.pipe(
    //     ofType<Register>(AuthActionTypes.Register),
    //     tap(action => {
    //         localStorage.setItem(environment.authTokenKey, action.payload.authToken);
    //     })
    // );

    // @Effect({dispatch: false})
    // loadUser$ = this.actions$
    // .pipe(
    //     ofType<UserRequested>(AuthActionTypes.UserRequested),
    //     withLatestFrom(this.store.pipe(select(isUserLoaded))),
    //     filter(([action, _isUserLoaded]) => !_isUserLoaded),
    //     mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
    //     tap(_user => {
    //         console.log('loadUser$')
    //         if (_user) {
    //             this.store.dispatch(new UserLoaded({ user: _user }));
    //         } else {
    //             this.store.dispatch(new Logout());
    //         }
    //     })
    //   );

    @Effect()
    init$: Observable<Action> = defer(() => {
        const userSession = this.EncrDecr.getLocalStorage(environment.localStorageKey)
        let observableResult = of({type: 'NO_ACTION'});
        if (userSession) {
            observableResult = of(new AuthSuccess(userSession));
        }
        return observableResult;
    });

    private returnUrl: string;

    constructor(private actions$: Actions,
        private router: Router,
        private auth: AuthService,
        private store: Store<AppState>,
        private EncrDecr: EncrDecrServiceService,
        ) {

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.returnUrl = event.url;
			}
		});
	}
}
