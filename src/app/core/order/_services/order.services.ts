import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../_models/order.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/order';

@Injectable()
export class OrderService {
    constructor(private http: HttpClient) {}

    // Order
    getAllOrder(data: any): Observable<any> {
        const url = environment.superSALESApi+`getSTSyncSalesOrders`;
        return this.http.post<Order[]>(url, data);
    }
    
    // Order
    getAllorderselect(data: any): Observable<any> {
        const url = environment.superSALESApi+`getSTSyncSalesOrders`;
        return this.http.get<Order[]>(url, {params:data});
    }

    getOrderById(orderId: number): Observable<Order> {
		return this.http.get<Order>(API_ROLES_URL + `/${orderId}`);
    }

    // CREATE =>  POST: add a new order to the server
	createOrder(data: any): Observable<any> {
		const url = environment.superSALESApi+`addsalesorder`;
        return this.http.post(url, data)
	}

    // UPDATE => PUT: update the order on the server
	updateOrder(order: Order): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, order, { headers: httpHeaders });
	}

	// DELETE => delete the order from the server
	deleteOrder(orderId: number): Observable<Order> {
		const url = `${API_ROLES_URL}/${orderId}`;
		return this.http.delete<Order>(url);
	}

    // Check Order Before deletion
    isOrderAssignedToUsers(orderId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?orderId=' + orderId);
    }

    // Order
    findOrder(data: any): Observable<any> { 
        const url = environment.superSALESApi+`getSTSyncSalesOrders`;
        // const url = environment.superSALESApi+`getsalesorders`;
        // const url = environment.superSALESApiLiveTest+`getsalesorders`;
        // const url = `http://supersales.co:8080/salesproprod/getsalesorders?getsalesordersjson={"CreatedBy":9536,"CompanyID":1259}&UserID=9536&TokenID=D835BE21BE23EB400008F030012ED25C&PageNo=1&PageSize=20000000`;
        // const url = `http://supersales.co:8080/salesproprod/getsalesorders?getsalesordersjson=%7B%22CreatedBy%22%3A9536%2C%22CompanyID%22%3A1259%2C%22FilterUser%22%3A0%2C%22FilterProduct%22%3A0%2C%22CustomerID%22%3A0%2C%22FilterCategoryID%22%3A0%2C%22SortType%22%3A0%2C%22FilterType%22%3A0%7D&UserID=9536&TokenID=D835BE21BE23EB400008F030012ED25C&PageNo=1&PageSize=20000000`;
        return this.http.get<Order[]>(url, {params:data});
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
