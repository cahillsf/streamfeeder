import { Component, OnInit } from '@angular/core';
import { RedditServiceService } from '../services/reddit-service.service';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  public gotPosts: Boolean;
  public savedPosts;
  public folder2: string;
  public userAppAuth: string;
  public userName: string;
  public redditData;
  public child;

  constructor(public redditServe: RedditServiceService, public httpClient: HttpClient, private cookieService: CookieService) {
    this.folder2 = "STREAMFEEDER"
   }

  ngOnInit() {
    console.log(this.redditServe.userAppAuth);
    //console.log(this.redditServe.messages);
    this.userAppAuth = this.redditServe.userAppAuth;
    this.getUserInfo();
    //this.getSavedPosts();
  }

  getUserInfo(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ (this.cookieService.get('redditUserAuth')),
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/api/v1/me', httpOptions)
      .subscribe(data => {
        //this.gotPosts = true;
        console.log('my user info: ', data);
        console.log('my name is ' + data['name']);
        this.userName = data['name'];
        //this.savedPosts = data['data']['children'];
        this.getSavedPosts();
        //this.getPostedPosts();
      
    });

  }
  getSavedPosts(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ (this.cookieService.get('redditUserAuth')),
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/user/'+ this.userName +'/saved', httpOptions)
      .subscribe(data => {
        this.redditData = data;
        console.log('my data: ', data);
        this.getPosts();
      
    });
  }

  getPostedPosts(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ (this.cookieService.get('redditUserAuth')),
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/user/'+ this.userName +'/submitted', httpOptions)
      .subscribe(response => {
        console.log('my response postedPosts: ', response);
        //console.log('accessing  ', response['data']['data']['children'])
        console.log("post: " + response['data']['children']);
        var newPosts = response['data']['children'];
        newPosts.forEach(element => {
          if(element['data']['thumbnail'] == "self" || element['data']['thumbnail'] == "default"){
            element['data']['hasPreview'] = false;
          }
          else{
            element['data']['hasPreview'] = true;
          }
          element['data'] = this.addShortText(element['data']);
          this.savedPosts.push(element);
        });
        
      },
      (err) => console.log('HTTP Error', err)
      );
  }

  getPosts(){
    
    this.savedPosts = this.redditData['data']['children'];
    this.child = this.savedPosts[0]['data'];
    this.savedPosts.forEach(element => {
      // console.log(element['data']);
      //console.log(element['data']['thumbnail']);
      if(element['data']['thumbnail'] == "self" || element['data']['thumbnail'] == "default"){
        element['data']['hasPreview'] = false;
      }
      else{
        element['data']['hasPreview'] = true;
      }
      element['data'] = this.addShortText(element['data']);
      //console.log(element['data']['title']);
    });
    //console.log(this.child);
    this.child = this.addShortText(this.child)
    this.gotPosts = true;
    this.getPostedPosts();

  }

  addShortText(posting){
    if (posting['selftext'].length > 280){
      posting['shortText'] = posting['selftext'].substring(0, 280).concat("...");
    }
    else{
      posting['shortText'] = posting['selftext'];
    }
    return posting;
  }

  copyToClipboard(redditURL) {
    const URLpreface = 'https://www.reddit.com';
    document.addEventListener('copy', (e: ClipboardEvent) => {
      //'text/plain' is default value for textual files
      e.clipboardData.setData('text/plain', (URLpreface + redditURL));
      //If event isn't explicitly handled, its default action shouldn't be taken as it normally would be
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  testPlease(){
    //this.bool = true;
    let place = "US";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        }),
      };
  
    this.httpClient.get('http://localhost:8080/postNewComment', httpOptions)
    .subscribe(data => {
      console.log('my data: ', data);
    });
    
  }

  testCommentsPlease(){
    //this.bool = true;
    let place = "US";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        }),
      };
  
    this.httpClient.get('http://localhost:8080/getComments', httpOptions)
    .subscribe(data => {
      console.log('my data: ', data);
    });
  }

  commentOnThis(postName){
    console.log(postName);
    const postdata = `{"postName":"${postName}", "message":"oy mate"}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.post('http://localhost:8080/postNewComment', postdata ,httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
      },
      (err) => console.log('HTTP Error', err)
    );
  }


}
