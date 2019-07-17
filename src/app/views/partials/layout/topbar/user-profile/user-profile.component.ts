// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { isDistributor, isRetailer } from '../../../../../../app/core/auth/_selectors/auth.selectors';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;
	defaultImage:string = './assets/media/users/default.jpg';
	retailer:boolean;
	distributor:boolean;

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// this.user$ = JSON.stringify (this.store.pipe(select(currentUser)));
		this.user$ = this.store.pipe(select(currentUser));

		this.store.select(isRetailer).subscribe(data => {
			if (data === true) {
			  this.retailer = true;
			}
		  });

		  this.store.select(isDistributor).subscribe(data => {
			if (data === true) {
			  this.distributor = true;
			}
		  });

	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}
}
