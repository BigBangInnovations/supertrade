// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Module reducers and selectors
import { AppState } from '../../../core/reducers/';
import { currentUserPermissions, currentUserRoleIds } from '../_selectors/auth.selectors';
import { Permission } from '../_models/permission.model';
import { find } from 'lodash';
import roleJson from '../../../core/_config/local_database/role.json';
import permissionJson from '../../../core/_config/local_database/permission.json';

@Injectable()
export class ModuleGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        const moduleName = route.data['moduleName'] as string;

        if (!moduleName) {
            return of(false);
        }
        // return of(true);
        let hasAccess = false;
        return this.store
            .pipe(
                select(currentUserRoleIds),
                map((currentUserRoleIdMap) => {
                    roleJson.forEach(role => {
                        
                        if (role.id == currentUserRoleIdMap) {
                            
                            role.permissions.forEach(permission => {
                                
                                permissionJson.forEach(permissions => {
                                    if (permissions.id == permission) {
                                        if (!hasAccess && permissions.title.toLocaleLowerCase() === moduleName.toLocaleLowerCase()) {
                                            hasAccess = true;
                                        }
                                    }
                                });

                            });
                        }
                    });
                    return hasAccess;
                }),
                tap(newHasAccess => {
                    if (!newHasAccess) {
                        this.router.navigateByUrl('dashboard');
                    }
                })
            );
    }
}
