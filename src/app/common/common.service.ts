import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

import { Observable, throwError, BehaviorSubject } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class CommonService {
  private newsData = new BehaviorSubject<Array<any>>([]);
  nwsData = this.newsData.asObservable()
  constructor(private http: HttpClient) { }
  responseHandler(res: any) {
    const responseBody = res.body || null;
    return responseBody;
  }
  errorHandler(error: any) {
    return throwError(new Error(error.status))
  }
  sendData(nwsData:Array<any>){
    this.newsData.next(nwsData);
  }
  getData(){
    return this.nwsData;
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
  setLocalStorage(itemN,value){
    localStorage.setItem(itemN,value);
  }
  getLocalStorage(itemN){
    return localStorage.getItem(itemN);
  }
}
