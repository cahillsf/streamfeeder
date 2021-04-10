import { Component, OnInit } from '@angular/core';
import { RedditServiceService } from '../services/reddit-service.service';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  public gotMessages: Boolean;
  public messages;
  public folder2: string;
  public userAppAuth: string;

  constructor(public redditServe: RedditServiceService, public httpClient: HttpClient, private cookieService: CookieService) {
    this.folder2 = "STREAMFEEDER"
   }

  ngOnInit() {
    console.log(this.cookieService.get('redditUserAuth'));
    //console.log(this.redditServe.messages);
    this.userAppAuth = this.redditServe.userAppAuth;
    this.getMessages();
  }

  getMessages(){
    //this.bool = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ (this.cookieService.get('redditUserAuth')),
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/message/inbox', httpOptions)
      .subscribe(data => {
        this.gotMessages = true;
        console.log('my data: ', data);
        this.messages = data['data']['children'];
      
    });
  }



}
