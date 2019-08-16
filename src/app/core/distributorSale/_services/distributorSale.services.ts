import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DistributorSale } from '../_models/distributorSale.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/distributorSale';

@Injectable()
export class DistributorSaleService {
    constructor(private http: HttpClient) {}

    // DistributorSale
    getAllDistributorSale(data: any): Observable<any> {
        const url = `get-distributor-sales`;
        return this.http.post<DistributorSale[]>(url, data);
    } 

    getDistributorSaleById(distributorSaleId: number): Observable<DistributorSale> {
		return this.http.get<DistributorSale>(API_ROLES_URL + `/${distributorSaleId}`);
    }

    // CREATE =>  POST: add a new distributorSale to the server
	createDistributorSale(data: any): Observable<any> {
		const url = `add-distributor-sales`;
        return this.http.post(url, data)
    }
    
    returnDistributorSale(data: any): Observable<any> {
		const url = `add-distributor-sales-return`;
        return this.http.post(url, data)
    }
    
    acceptRejectPurchase(data: any): Observable<any> {
		const url = `retailer-purchase-approve`;
        return this.http.post(url, data)
    }
    
    acceptRejectPartialSaleAcceptedByRetailer(data: any): Observable<any> {
		const url = `distributor-partialAccepted-sales-approve`;
        return this.http.post(url, data)
	}

    // UPDATE => PUT: update the distributorSale on the server
	updateDistributorSale(distributorSale: DistributorSale): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, distributorSale, { headers: httpHeaders });
	}

	// DELETE => delete the distributorSale from the server
	deleteDistributorSale(distributorSaleId: number): Observable<DistributorSale> {
		const url = `${API_ROLES_URL}/${distributorSaleId}`;
		return this.http.delete<DistributorSale>(url);
	}

    // Check DistributorSale Before deletion
    isDistributorSaleAssignedToUsers(distributorSaleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?distributorSaleId=' + distributorSaleId);
    }

    // DistributorSale
    findDistributorSale(data: any): Observable<any> {
        const url = `get-distributor-sales`;
        return this.http.post<DistributorSale[]>(url, data);
    }

        /**
     * From Retailer notification scren
     * Get distributor sale for approval 
     */
    findDistributorSaleAsPurchase(data: any): Observable<any> {
        const url = `get-distributor-sales`;
        return this.http.post<DistributorSale[]>(url, data);
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
