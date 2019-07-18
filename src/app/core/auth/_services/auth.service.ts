import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { filter, some, find, each } from 'lodash';

const API_USERS_URL = 'http://localhost:4200/api/users';
const API_PERMISSION_URL = 'http://localhost:4200/api/permissions';
const API_ROLES_URL = 'http://localhost:4200/api/roles';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }
    // Authentication/Authorization
    // login(email: string, password: string): Observable<User> {
    //     return this.http.post<User>(API_USERS_URL, { email, password });
    // }

    logIn(data: any): Observable<any> {
        const url = `login`;
        return this.http.post(url, data)
    }

    getCompanySettings(url, data) {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.get(url, { headers:headers, params: data} )
    }

    // getUserByToken(): Observable<User> {
    //     const userToken = localStorage.getItem(environment.authTokenKey);
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.append('Authorization', 'Bearer ' + userToken);
    //     return this.http.get<User>(API_USERS_URL, { headers: httpHeaders });
    // }

    // register(user: User): Observable<any> {
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    //     return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
    //         .pipe(
    //             map((res: User) => {
    //                 return res;
    //             }),
    //             catchError(err => {
    //                 return null;
    //             })
    //         );
    // }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    // public requestPassword(email: string): Observable<any> {
    // 	return this.http.get(API_USERS_URL + '/forgot?=' + email)
    // 		.pipe(catchError(this.handleError('forgot-password', []))
    //     );
    // }


    // getAllUsers(): Observable<User[]> {
    // 	return this.http.get<User[]>(API_USERS_URL);
    // }

    // getUserById(userId: number): Observable<User> {
    // 	return this.http.get<User>(API_USERS_URL + `/${userId}`);
    // }


    // // DELETE => delete the user from the server
    // deleteUser(userId: number) {
    // 	const url = `${API_USERS_URL}/${userId}`;
    // 	return this.http.delete(url);
    // }

    // // UPDATE => PUT: update the user on the server
    // updateUser(_user: User): Observable<any> {
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
    // }

    // // CREATE =>  POST: add a new user to the server
    // createUser(user: User): Observable<User> {
    // 	const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders});
    // }

    // // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // // items => filtered/sorted result
    // findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, { headers: httpHeaders});
    // }

    // // Permissions
    // getAllPermissions(): Observable<Permission[]> {
    // 	return this.http.get<Permission[]>(API_PERMISSION_URL);
    // }

    // getRolePermissions(roleId: number): Observable<Permission[]> {
    //     const allRolesRequest = this.http.get<Permission[]>(API_PERMISSION_URL);
    //     const roleRequest = roleId ? this.getRoleById(roleId) : of(null);
    //     return forkJoin(allRolesRequest, roleRequest).pipe(
    // 		map(res => {
    // 			const _allPermissions: Permission[] = res[0];
    //             const _role: Role = res[1];
    //             if (!_allPermissions || _allPermissions.length === 0) {
    //                 return [];
    //             }

    //             const _rolePermission = _role ? _role.permissions : [];
    //             const result: Permission[] = this.getRolePermissionsTree(_allPermissions, _rolePermission);
    //             return result;
    //         })
    //     );
    // }

    // private getRolePermissionsTree(_allPermission: Permission[] = [], _rolePermissionIds: number[] = []): Permission[] {
    //     const result: Permission[] = [];
    //     const _root: Permission[] = filter(_allPermission, (item: Permission) => !item.parentId);
    //     each(_root, (_rootItem: Permission) => {
    //         _rootItem._children = [];
    //         _rootItem._children = this.collectChildrenPermission(_allPermission, _rootItem.id, _rolePermissionIds);
    //         _rootItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _rootItem.id));
    //         result.push(_rootItem);
    //     });
    //     return result;
    // }

    // private collectChildrenPermission(_allPermission: Permission[] = [],
    //     _parentId: number, _rolePermissionIds: number[]  = []): Permission[] {
    //     const result: Permission[] = [];
    //     const _children: Permission[] = filter(_allPermission, (item: Permission) => item.parentId === _parentId);
    //     if (_children.length === 0) {
    //         return result;
    //     }

    //     each(_children, (_childItem: Permission) => {
    //         _childItem._children = [];
    //         _childItem._children = this.collectChildrenPermission(_allPermission, _childItem.id, _rolePermissionIds);
    //         _childItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _childItem.id));
    //         result.push(_childItem);
    //     });
    //     return result;
    // }

    // // Roles
    // getAllRoles(): Observable<Role[]> {
    //     return this.http.get<Role[]>(API_ROLES_URL);
    // }

    // getRoleById(roleId: number): Observable<Role> {
    // 	return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    // }

    // // CREATE =>  POST: add a new role to the server
    // createRole(role: Role): Observable<Role> {
    // 	// Note: Add headers if needed (tokens/bearer)
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders});
    // }

    // // UPDATE => PUT: update the role on the server
    // updateRole(role: Role): Observable<any> {
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
    // }

    // // DELETE => delete the role from the server
    // deleteRole(roleId: number): Observable<Role> {
    // 	const url = `${API_ROLES_URL}/${roleId}`;
    // 	return this.http.delete<Role>(url);
    // }

    // findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // 	// This code imitates server calls
    // 	return this.http.get<Role[]>(API_ROLES_URL).pipe(
    // 		mergeMap(res => {
    // 			const result = this.httpUtils.baseFilter(res, queryParams, []);
    // 			return of(result);
    // 		})
    // 	);
    // }

    // // Check Role Before deletion
    // isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    //     return this.getAllUsers().pipe(
    //         map((users: User[]) => {
    //             if (some(users, (user: User) => some(user.roles, (_roleId: number) => _roleId === roleId))) {
    //                 return true;
    //             }

    //             return false;
    //         })
    //     );
    // }

    // // Permission
    // getAllPermissions(): Observable<Permission[]> {
    // 	return this.http.get<Permission[]>(API_PERMISSION_URL);
    // }

    // getRolePermissions(roleId: number): Observable<Permission[]> {
    //     return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
    // }

    // // Roles
    // getAllRoles(): Observable<Role[]> {
    //     return this.http.get<Role[]>(API_ROLES_URL);
    // }

    // getRoleById(roleId: number): Observable<Role> {
    // 	return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    // }

    // // CREATE =>  POST: add a new role to the server
    // createRole(role: Role): Observable<Role> {
    // 	// Note: Add headers if needed (tokens/bearer)
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders});
    // }

    // // UPDATE => PUT: update the role on the server
    // updateRole(role: Role): Observable<any> {
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
    // }

    // // DELETE => delete the role from the server
    // deleteRole(roleId: number): Observable<Role> {
    // 	const url = `${API_ROLES_URL}/${roleId}`;
    // 	return this.http.delete<Role>(url);
    // }

    // // Check Role Before deletion
    // isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    //     return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
    // }

    // findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    //     // This code imitates server calls
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    // 	return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders});
    // }

    /*
     * Handle Http operation that failed.
     * Let the app continue.
   *
   * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
