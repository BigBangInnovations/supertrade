import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ReportsService {
    constructor(private http: HttpClient) { }
        
    exportReports(data: any): Observable<any> {
        const url = `export-reports`;
        return this.http.post(url, data)
    }

}
