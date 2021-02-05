import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import {environment} from '../../environments/environment'
import { Observable, Subscription } from 'rxjs'
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { IonButton, ModalController } from '@ionic/angular';
import { RedditServiceService } from '../services/reddit-service.service';
import { LoginModalPage } from '../modals/login-modal/login-modal.page';



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
  public userAppAuth: string;
  public redditData;
  public child;
  public bool: Boolean;
  public bool2: Boolean;
  public posts;
  public postsList;
  public burritos;
  public browserRefresh: Boolean;
  public refreshSubscription: Subscription;
  
  @ViewChild('helloBut') helloButton: IonButton;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private httpClient: HttpClient, public redditService: RedditServiceService, private modalCtrl: ModalController) {
    // this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    // this.channel.subscribe(data => {
    //   console.log('my data: ', data);
    // })

    this.bool = false;
    this.authorizeApp();
    this.refreshSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
        //console.log("Browser refresh = " + this.browserRefresh);
      }
    });
    
   }

  ngOnInit() {
    //this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkParams();
    this.burritos = [{name: 'Burrito1', url: '../../assets/burrito1.jpeg'}, {name: 'Burrito2', url: '../../assets/burrito2.jpeg'}];
    this.folder = "Streamfeeder";
    this.folder2 = "STREAMFEEDER";

    //link to my login button - passes the scope I'm requesting along with app client ID and a few other security related parameters
    let urlString: string = "https://www.reddit.com/api/v1/authorize.compact?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration + "&scope=" + environment.scope
    let redditLogin = (<HTMLAnchorElement>document.getElementById("redditLogin"));
    redditLogin.href = urlString;
  }


  //function for application-level authorization: in production would take place on a backend server to protect clientSecret
  authorizeApp(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret),
      }),
    };
    //application level authorization grant type is "client_credentials"
    const grantType = "client_credentials";
    const postdata = `grant_type=${grantType}`;
    this.httpClient.post('https://www.reddit.com/api/v1/access_token', postdata, httpOptions
    ).subscribe(
      (response) => {
        console.log("Successful response to authorization grant ");
        console.log(response);
        this.appAuth = response["access_token"];
        console.log("Pulling out the access token: " + this.appAuth);
        this.getData();
      },
      (err) => console.log('HTTP Error', err)

    );

  }

  //function for user-level authorization
  authorizeAppUser(codeP){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret),
      }),
    };
    //user-level authorization grant type is "authorization_code"
    const grantType2 = "authorization_code";
    const redirect = "http://localhost:8100/";
    const postdata = `grant_type=${grantType2}&code=${codeP}&redirect_uri=${redirect}`;
    this.httpClient.post('https://www.reddit.com/api/v1/access_token', postdata, httpOptions
    ).subscribe(
      (response) => {
        console.log("Successful response to user authorization grant ");
        console.log(response);
        this.userAppAuth = response["access_token"];
        console.log("Pulling out the access token: " );
        console.log(this.userAppAuth);
        this.redditService.pushUserAppAuth(this.userAppAuth);
        //this.getData();
      },
      (err) => console.log('HTTP Error', err)

    );

  }

  getData(){
    this.bool = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ this.appAuth,
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/r/popular', httpOptions)
      .subscribe(data => {
      console.log('my data: ', data);
      this.redditData = data;
      this.getPosts();
    });

  }

  getPosts(){
    this.posts = this.redditData['data']['children'];
    this.child = this.posts[0]['data'];
    this.posts.forEach(element => {
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
    this.bool2 = true;

  }

  //adds a property 'shortText' to each post object with a shortened version of the text to display on home screen of application
  addShortText(posting){
    if (posting['selftext'].length > 280){
      posting['shortText'] = posting['selftext'].substring(0, 280).concat("...");
    }
    else{
      posting['shortText'] = posting['selftext'];
    }
    return posting;
  }

  checkParams(){
    let codeParam = this.activatedRoute.snapshot.queryParams["code"];
    let stateParam = this.activatedRoute.snapshot.queryParams["state"];
    if(codeParam != undefined){
      this.authorizeAppUser(codeParam);
    }
    // console.log("in check params");
    // console.log(codeParam);
    // console.log(stateParam);
  }

  async loginDatabase(){
    var myModal = await this.modalCtrl.create({component: LoginModalPage});
    return await myModal.present();

  }


}

