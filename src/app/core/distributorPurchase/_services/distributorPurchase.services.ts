import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DistributorPurchase } from '../_models/distributorPurchase.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/distributorPurchase';

@Injectable()
export class DistributorPurchaseService {
    constructor(private http: HttpClient) {}

    // DistributorPurchase
    getAllDistributorPurchase(data: any): Observable<any> {
        const url = `get-distributor-purchase`;
        return this.http.post<DistributorPurchase[]>(url, data);
    } 

    getDistributorPurchaseById(distributorPurchaseId: number): Observable<DistributorPurchase> {
		return this.http.get<DistributorPurchase>(API_ROLES_URL + `/${distributorPurchaseId}`);
    }

    // CREATE =>  POST: add a new distributorPurchase to the server
	createDistributorPurchase(data: any): Observable<any> {
		const url = `add-distributor-purchase`;
        return this.http.post(url, data)
    }
    
    returnDistributorPurchase(data: any): Observable<any> {
		const url = `add-distributor-purchase-return`;
        return this.http.post(url, data)
    }
    
    acceptRejectPurchase(data: any): Observable<any> {
		const url = `retailer-purchase-approve`;
        return this.http.post(url, data)
    }
    
    acceptRejectPartialPurchaseAcceptedByRetailer(data: any): Observable<any> {
		const url = `distributor-partialAccepted-purchase-approve`;
        return this.http.post(url, data)
	}

    // UPDATE => PUT: update the distributorPurchase on the server
	updateDistributorPurchase(distributorPurchase: DistributorPurchase): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, distributorPurchase, { headers: httpHeaders });
	}

	// DELETE => delete the distributorPurchase from the server
	deleteDistributorPurchase(distributorPurchaseId: number): Observable<DistributorPurchase> {
		const url = `${API_ROLES_URL}/${distributorPurchaseId}`;
		return this.http.delete<DistributorPurchase>(url);
	}

    // Check DistributorPurchase Before deletion
    isDistributorPurchaseAssignedToUsers(distributorPurchaseId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?distributorPurchaseId=' + distributorPurchaseId);
    }

    // DistributorPurchase
    findDistributorPurchase(queryParams: any, data: any): Observable<any> {
        const url = `get-distributor-purchase`;
        return this.http.post<DistributorPurchase[]>(url, data, { params: queryParams })
    }

        /**
     * From Retailer notification scren
     * Get distributor purchase for approval 
     */
    findDistributorPurchaseAsPurchase(data: any): Observable<any> {
        const url = `get-distributor-purchase`;
        return this.http.post<DistributorPurchase[]>(url, data);
    }

    /**
     * From Retailer notification scren
     * Get distributor purchase return for approval 
     */
    findDistributorPurchaseReturnAsPurchaseReturn(data: any): Observable<any> {
        const url = `get-distributor-purchase-return`;
        return this.http.post<DistributorPurchase[]>(url, data);
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
