import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class CommonService {
  constructor(private http: HttpClient) { }
  responseHandler(res: any) {
    const responseBody = res.body || null;
    return responseBody;
  }
  errorHandler(error: any) {
    return throwError(new Error(error.status))
  }
  getHttpGetResponse(url): Observable<any[]> {
    return this.http
      .get(url, { observe: 'response' })
      .pipe(
        map((res) => this.responseHandler(res)),
        catchError((err) => this.errorHandler(err))
      );
  }
  getAPIResponse(url, request = null, type): Observable<any[]> {
    if (!url) {
      return null
    }
    if (type === 'GET') {
      return this.getHttpGetResponse(url)
    }
  }
}
