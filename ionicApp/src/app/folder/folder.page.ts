import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs'
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { IonButton } from '@ionic/angular';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public folder2: string;
  public channel: Observable<any>;
  public channel2: Observable<any>;
  public appAuth: string;
  public redditData;
  public child;
  public bool: Boolean;
  public bool2: Boolean;
  public posts;
  public postsList;
  public burritos;
  @ViewChild('helloBut') helloButton: IonButton;

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    // this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    // this.channel.subscribe(data => {
    //   console.log('my data: ', data);
    // })
    this.bool = false;
    this.authorizeApp();
   }

  ngOnInit() {
    //this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.burritos = [{name: 'Burrito1', url: '../../assets/burrito1.jpeg'}, {name: 'Burrito2', url: '../../assets/burrito2.jpeg'}];
    this.folder = "Streamfeeder";
    this.folder2 = "STREAMFEEDER";
    let urlString: string = "https://www.reddit.com/api/v1/authorize?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration + "&scope=" + environment.scope
    var helloButton = (<HTMLAnchorElement>document.getElementById("helloButton"));
    helloButton.href = urlString;
    // this.helloButton.href = urlString
    // let urlString2: string = "https://www.reddit.com/api/v1/authorize?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration + "&scope=" + environment.scope
    // var authButton = (<HTMLAnchorElement>document.getElementById("helloButton"));
    // authButton.href = urlString;

  }

  testExpress(){
    this.channel = this.httpClient.get('https://jsonplaceholder.typicode.com/posts/1')
    //this.channel = this.httpClient.get('https://reddit.com/subreddits/popular')
    this.channel.subscribe(data => {
      console.log('my data: ', data);
    })
  }
  testExpress2(){
    this.channel2 = this.httpClient.get('http://localhost:3000/info')
    this.channel2.subscribe(data => {
      console.log('my data: ', data);
    })
  }

  authorizeApp(){
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret),
      }),
    };
      
    const grantType = "client_credentials";
    const postdata = `grant_type=${grantType}`;
    this.httpClient.post('https://www.reddit.com/api/v1/access_token', postdata, httpOptions
    ).subscribe((response) => {
        console.log(response);
        this.appAuth = response["access_token"];
        console.log(this.appAuth);
        this.getData();
    });

  }

  getData(){
    this.bool = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+this.appAuth,
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/r/popular', httpOptions)
      .subscribe(data => {
      console.log('my data: ', data);
      this.redditData = data;
      console.log("0 index:" + this.redditData['data']['children'][0])
      this.getPosts();

    });

  }

  getPosts(){
    this.posts = this.redditData['data']['children'];
    this.child = this.posts[0]['data'];
    this.posts.forEach(element => {
      // console.log(element['data']);
      console.log(element['data']['thumbnail']);
      if(element['data']['thumbnail'] == "self" || element['data']['thumbnail'] == "default"){
        element['data']['hasPreview'] = false;
      }
      else{
        element['data']['hasPreview'] = true;
      }
      element['data'] = this.addShortText(element['data']);
      console.log(element['data']['title']);
    });
    console.log(this.child);
    this.child = this.addShortText(this.child)
    this.bool2 = true;

  }

  addShortText(posting){
    if (posting['selftext'].length > 280){
      posting['shortText'] = posting['selftext'].substring(0, 280).concat("...");
    }
    else{
      posting['shortText'] = posting['selfdtext'];
    }
    return posting;
  }


}

