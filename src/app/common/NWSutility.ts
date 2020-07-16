import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class NWSutility {
  constructor() { }
  static isLocal = !environment.production;
  static urlParams = {
    nwsSourceUrl : {url:`https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=30`, type:'GET'}
  }
}