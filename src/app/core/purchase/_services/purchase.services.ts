import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Purchase } from '../_models/purchase.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/purchase';

@Injectable()
export class PurchaseService {
    constructor(private http: HttpClient) {}

    // Purchase
    getAllPurchase(data: any): Observable<any> {
        const url = `get-purchase`;
        return this.http.post<Purchase[]>(url, data);
    } 

    getPurchaseById(purchaseId: number): Observable<Purchase> {
		return this.http.get<Purchase>(API_ROLES_URL + `/${purchaseId}`);
    }

    // CREATE =>  POST: add a new purchase to the server
	createPurchase(data: any): Observable<any> {
		const url = `add-purchase`;
        return this.http.post(url, data)
    }
    
    returnPurchase(data: any): Observable<any> {
		const url = `add-purchase-return`;
        return this.http.post(url, data)
	}

    // UPDATE => PUT: update the purchase on the server
	updatePurchase(purchase: Purchase): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, purchase, { headers: httpHeaders });
	}

	// DELETE => delete the purchase from the server
	deletePurchase(purchaseId: number): Observable<Purchase> {
		const url = `${API_ROLES_URL}/${purchaseId}`;
		return this.http.delete<Purchase>(url);
	}

    // Check Purchase Before deletion
    isPurchaseAssignedToUsers(purchaseId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?purchaseId=' + purchaseId);
    }

    // Purchase
    findPurchase(data: any): Observable<any> {
        const url = `get-purchase`;
        return this.http.post<Purchase[]>(url, data);
    }

    /**
     * From Retailer notification scren
     * Get distributor sale for approval 
     */
    findDistributorSaleAsPurchase(data: any): Observable<any> {
        const url = `get-distributor-sales`;
        return this.http.post<Purchase[]>(url, data);
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
