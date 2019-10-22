import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class OpeningStockService {
    constructor(private http: HttpClient) { }
        
    addOpeningStock(data: any): Observable<any> {
        const url = `upload-opening-stock`;
        return this.http.post(url, data)
    }

    freezeOpeningStock(data: any): Observable<any> {
        const url = `freeze-opening-stock`;
        return this.http.post(url, data)
    }
}
