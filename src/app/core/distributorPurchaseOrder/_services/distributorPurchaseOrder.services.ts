import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DistributorPurchaseOrder } from '../_models/distributorPurchaseOrder.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/distributorPurchaseOrder';

@Injectable()
export class DistributorPurchaseOrderService {
    constructor(private http: HttpClient) {}

    // DistributorPurchaseOrder
    getAllDistributorPurchaseOrder(data: any): Observable<any> {
        const url = `get-distributor-po`;
        return this.http.post<DistributorPurchaseOrder[]>(url, data);
    } 

    getDistributorPurchaseOrderById(distributorPurchaseOrderId: number): Observable<DistributorPurchaseOrder> {
		return this.http.get<DistributorPurchaseOrder>(API_ROLES_URL + `/${distributorPurchaseOrderId}`);
    }

    // CREATE =>  POST: add a new distributorPurchaseOrder to the server
	createDistributorPurchaseOrder(data: any): Observable<any> {
		const url = `add-distributor-po`;
        return this.http.post(url, data)
    }
    

    // UPDATE => PUT: update the distributorPurchaseOrder on the server
	updateDistributorPurchaseOrder(distributorPurchaseOrder: DistributorPurchaseOrder): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, distributorPurchaseOrder, { headers: httpHeaders });
	}

	// DELETE => delete the distributorPurchaseOrder from the server
	deleteDistributorPurchaseOrder(distributorPurchaseOrderId: number): Observable<DistributorPurchaseOrder> {
		const url = `${API_ROLES_URL}/${distributorPurchaseOrderId}`;
		return this.http.delete<DistributorPurchaseOrder>(url);
	}

    // Check DistributorPurchaseOrder Before deletion
    isDistributorPurchaseOrderAssignedToUsers(distributorPurchaseOrderId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?distributorPurchaseOrderId=' + distributorPurchaseOrderId);
    }

    // DistributorPurchaseOrder
    findDistributorPurchaseOrder(queryParams: any, data: any): Observable<any> {
        const url = `get-distributor-po`;
        return this.http.post<DistributorPurchaseOrder[]>(url, data, { params: queryParams })
    }


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
