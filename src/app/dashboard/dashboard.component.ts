import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';
import { NWSutility } from '../common/NWSutility';
import { Nsource } from '../model/nsource';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  firstTimeLoad = false;
  nwsResponse: any;
  nwsArticle = [];
  pagination: number = 0;
  disableBtnP: boolean = false;
  disableBtnN: boolean = false;
  nbPages: number = 0;
  loader: boolean = true;
  removeStory = [];
  constructor(private commonservice: CommonService) {
    const item = JSON.parse(this.commonservice.getLocalStorage('removedItem'));
    if(item){
      this.removeStory = item;
    }else{
      this.removeStory = []
    }
  }
  ngOnInit(): void {
    this.getNws(this.pagination);
  }
  getNws(pageno) {
    this.nwsArticle = []
    this.loader = true;
    const d = new Date();
    const timeStamp = d.setHours(d.getHours() - 2) / 1000;
    const apiUrl = NWSutility.urlParams.nwsSourceUrl.url + '&numericFilters=created_at_i>' + timeStamp + '&page=' + pageno;
    const apiType = NWSutility.urlParams.nwsSourceUrl.type;
    this.commonservice.getAPIResponse(apiUrl, null, apiType).subscribe((response: any) => {
      this.nwsResponse = response.hits;
      this.nbPages = response.nbPages;
      this.hackNws(this.nwsResponse);
    })
  }
  hackNws(data) {
    if (!data) {
      return;
    }
    this.nwsArticle = [];
    data.map(ele => {
      if(!this.removeStory.includes(ele.objectID)){
        data = {
          'comments': Math.floor(Math.random() * 500),
          'voteCount': Math.floor(Math.random() * 1000),
          'title': this.checkLeng(ele.title),
          'source': this.domainUrl(ele.url),
          'author': ele.author,
          'time': this.tConvert(ele.created_at_i),
          'upVote': ele.objectID,
        }
        this.nwsArticle.push(data);
      }      
    });
    this.loader = false;
    this.commonservice.sendData(this.nwsArticle)
    //this.commonservice.nwsData.subscribe(message => this.nwsArticle = message)
  }
  checkLeng(title) {
    const max_chars = 50;
    if (!title) {
      return;
    }
    if (title.length > max_chars) {
      return title.substr(0, max_chars);
    } else {
      return title;
    }
  }
  domainUrl(url) {
    if (!url) {
      return '';
    }
    let hostname;
    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    }
    else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  }
  tConvert(time) {
    return moment(time).fromNow()
  }
  prev() {
    if (this.pagination == 0) {
      return false;
    }
    this.pagination = this.pagination - 1;
    if (this.pagination <= 0) {
      this.disableBtnP = true;
      return false;
    }
    this.getNws(this.pagination);
  }
  next() {
    this.pagination = this.pagination + 1;
    if (this.pagination >= this.nbPages) {
      this.disableBtnN = true;
      return false;
    }
    this.getNws(this.pagination);
  }
  hiderow(storyId,index) {
    this.removeStory.push(storyId);
    this.commonservice.setLocalStorage('removedItem',JSON.stringify(this.removeStory));
    this.nwsArticle.splice(index, 1);
    this.commonservice.sendData(this.nwsArticle)
  }
  upvote(vote,indx){
    vote = vote + 30;
    this.nwsArticle[indx]['voteCount'] = vote;
    //console.log(this.nwsArticle[indx]['voteCount'])
    this.commonservice.sendData(this.nwsArticle)
  }
}
