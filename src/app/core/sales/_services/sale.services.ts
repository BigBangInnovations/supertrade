import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Sale } from '../_models/sale.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/sales';

@Injectable()
export class SalesService {
    constructor(private http: HttpClient) {}

    // Sales
    getAllSales(data: any): Observable<any> {
        const url = `get-sales`;
        return this.http.post<Sale[]>(url, data);
    } 

    getSaleById(saleId: number): Observable<Sale> {
		return this.http.get<Sale>(API_ROLES_URL + `/${saleId}`);
    }

    // CREATE =>  POST: add a new sale to the server
	createSale(data: any): Observable<any> {
		const url = `add-sales`;
        return this.http.post(url, data)
	}

    // UPDATE => PUT: update the sale on the server
	updateSale(sale: Sale): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, sale, { headers: httpHeaders });
	}

	// DELETE => delete the sale from the server
	deleteSale(saleId: number): Observable<Sale> {
		const url = `${API_ROLES_URL}/${saleId}`;
		return this.http.delete<Sale>(url);
	}

    // Check Sale Before deletion
    isSaleAssignedToUsers(saleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?saleId=' + saleId);
    }

    // findSales(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    //     // This code imitates server calls
    //     const httpHeaders = new HttpHeaders();
    //     httpHeaders.set('Content-Type', 'application/json');
    //     return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findSales', queryParams, { headers: httpHeaders});
        
    //     const url = `get-sales`;
    //     return this.http.post<Sale[]>(url, data);
    // }
    
    // Sales
    findSales(data: any): Observable<any> {
        const url = `get-sales`;
        return this.http.post<Sale[]>(url, data);
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
