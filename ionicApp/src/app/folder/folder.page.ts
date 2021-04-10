import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import {environment} from '../../environments/environment'
import { Observable, Subscription, VirtualTimeScheduler } from 'rxjs'
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from '@angular/common/http'
import { IonButton, ModalController } from '@ionic/angular';
import { RedditServiceService } from '../services/reddit-service.service';
import { LoginModalPage } from '../modals/login-modal/login-modal.page';
import { CookieService} from 'ngx-cookie-service';
import { IonInfiniteScroll } from '@ionic/angular';




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
  public twitterAppAuth: string;
  public userAppAuth: string;
  public userRefreshToken: string;
  public redditData;
  public child;
  public bool: Boolean;
  public posts;
  public postsList;
  public burritos;
  public bool2: Boolean;
  public browserRefresh: Boolean;
  public refreshSubscription: Subscription;
  public accessToken;
<<<<<<< Updated upstream
  public postsnew = [];
  page = 0;
  maximumPages=3;
=======
  public count;
  public after;
>>>>>>> Stashed changes
  
  @ViewChild('helloBut') helloButton: IonButton;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private httpClient: HttpClient, public redditService: RedditServiceService, private modalCtrl: ModalController, private cookieService: CookieService) {
    // this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    // this.channel.subscribe(data => {
    //   console.log('my data: ', data);
    // })

    this.bool = false;
    // if(!(this.cookieService.get('redditUserAuth'))){
      this.authorizeApp();
    // }
    // else{
    //   this.getUserData();
    // }
    
    // this.authorizeAppTwitter();
    // this.getTrendingPosts();
    this.getTrendingPosts2();
    
    //this.testAuth();
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
    let urlString: string = "https://www.reddit.com/api/v1/authorize.compact?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration2 + "&scope=" + environment.scope
    let redditLogin = (<HTMLAnchorElement>document.getElementById("redditLogin"));
    redditLogin.href = urlString;
<<<<<<< Updated upstream
    this.getData2();    
=======
    console.log("printing new cookie: "+ (this.cookieService.get('redditUserAuth')));

>>>>>>> Stashed changes
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
        //this.getSaved();
      },
      (err) => console.log('HTTP Error', err)

    );

  }
  authorizeAppTwitter(){
    console.log("in authorize app twitter");
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers':'Content-Type, Authorization',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + btoa(environment.twitterKey + ":" + environment.twitterSecretKey)
      }),
    };
    //application level authorization grant type is "client_credentials"
    const grantType = "client_credentials";
    const postdata = `grant_type=${grantType}`;
    this.httpClient.post('https://api.twitter.com/oauth2/token', postdata, httpOptions
    ).subscribe(
      (response) => {
        console.log("Successful response to twitter authorization grant ");
        console.log(response);
        this.twitterAppAuth = response["access_token"];
        console.log("Pulling out the access token: " + this.twitterAppAuth);
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
    const redirect = "https://localhost:8100/";
    const postdata = `grant_type=${grantType2}&code=${codeP}&redirect_uri=${redirect}`;
    this.httpClient.post('https://www.reddit.com/api/v1/access_token', postdata, httpOptions
    ).subscribe(
      (response) => {
        console.log("Successful response to user authorization grant ");
        console.log(response);
        this.userAppAuth = response["access_token"];
        this.userRefreshToken = response["refresh_token"];
        console.log("Pulling out the refresh token: " );
        console.log(this.userRefreshToken);
        console.log("Pulling out the access token: " );
        console.log(this.userAppAuth);
        this.redditService.pushUserAppAuth(this.userAppAuth);
        this.getSaved();
        this.cookieService.set('redditUserAuth', this.userAppAuth);
        console.log("printing new cookie: "+ (this.cookieService.get('redditUserAuth')));
        this.postToNode();

      },
      (err) => console.log('HTTP Error', err)

    );

  }

  getData(event?){
    this.bool = true;
    let place = "US";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ this.appAuth
        }),
      };
  
    this.httpClient.get('https://oauth.reddit.com/new', httpOptions)
    .subscribe(data => {
      console.log('my data: ', data);
      this.redditData = data;
      this.getPosts();
      
<<<<<<< Updated upstream
=======
    });
    

  }
  

  getUserData(){
    this.bool = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      console.log(httpOptions);
      this.httpClient.get('https://oauth.reddit.com/r/popular', httpOptions)
        .subscribe(data => {
        console.log('my data: ', data);
        this.redditData = data;
        this.getPosts();
    });

  }

  getSaved(){
    this.bool = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.get('https://oauth.reddit.com/user/cahillsf9/saved', httpOptions)
      .subscribe(data => {
      console.log('my saved posts!!!: ', data);
      //this.redditData = data;
      //this.getPosts();
>>>>>>> Stashed changes
    });

  }

  getData2(event?){
    this.httpClient.get('https://www.reddit.com/r/aww.json?raw_json=${this.page}')
      .subscribe((response: any)=>{
        console.log(response.data.children)
        this.postsnew = response.data.children;
        if(event){
      event.target.complete(); 
      }
    });
  }

  loadMore(event){
    console.log(event);
    this.page++;
    this.getData2(event);
    

  }

  getPosts(){
    this.after = this.redditData['data']['after']
    this.posts = this.redditData['data']['children'];
    this.child = this.posts[0]['data'];
    console.log("posts here " + this.posts);
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

    if(posting['likes']){
      posting['upvoted'] = true;
    }
    else if(!posting['likes']){
      posting['downvoted'] = true;
    }
    else{
      posting['upvoted'] = false;
      posting['downvoted'] = false;

    }


    return posting;
  }

  checkParams(){
    let codeParam = this.activatedRoute.snapshot.queryParams["code"];
    let stateParam = this.activatedRoute.snapshot.queryParams["state"];
    let oauthVerifier = this.activatedRoute.snapshot.queryParams["oauth_verifier"];
    if(codeParam != undefined){
      this.authorizeAppUser(codeParam);
    }
    if(oauthVerifier != undefined){
      this.postOauthVerifier(oauthVerifier);
    }
    else{
      this.testAuth();
    }
    // console.log("in check params");
    // console.log(codeParam);
    // console.log(stateParam);
  }

  async loginDatabase(){
    var myModal = await this.modalCtrl.create({component: LoginModalPage});
    return await myModal.present();

  }

  getTrendingPosts(){
    // this.bool = true;
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': 'Bearer '+ environment.twitterAppBearer,
    //     }),
    //   };
    //   this.httpClient.get('https://api.twitter.com/1.1/trends/place.json?id=2459115', httpOptions)
    //   .subscribe(data => {
    //   console.log('my data: ', data);
    //   // this.redditData = data;
    //   // this.getPosts();
    console.log("down here trending");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.get('http://localhost:8080/hello', httpOptions)
      .subscribe((response) => {
        console.log('my response: ', JSON.stringify(response));
        //this.modalCtrl.dismiss();
      },
      (err) => console.log('HTTP Error', err)
      );
    }

  getTrendingPosts2(){
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.get('http://localhost:8080/hello2', httpOptions)
      .subscribe((response) => {
        console.log('my response: ', JSON.stringify(response));
        //this.modalCtrl.dismiss();
      },
      (err) => console.log('HTTP Error', err)
      );
    }

  testAuth(){
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.get('http://localhost:8080/authorizeThis', httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
        console.log("response['data'} is " + response['data']);
        let urlString = response['data'];
        let twitterLogin = (<HTMLAnchorElement>document.getElementById("twitterLogin"));
        twitterLogin.href = urlString;
        //this.modalCtrl.dismiss();
      },
      (err) => console.log('HTTP Error', err)
      );
  }

  postOauthVerifier(verifier: string){
    console.log("in post verifier");
    const postdata = `{"verifier":"${verifier}"}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.post('http://localhost:8080/postVerifier', postdata ,httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
        //this.confirmAccount();
        //this.modalCtrl.dismiss();
        this.getAccessToken();
      },
      (err) => console.log('HTTP Error', err)
    );
  }

  getAccessToken(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.get('http://localhost:8080/accessToken', httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
        console.log("response['accessToken'] is " + response['accessToken']);
        let urlString = response['accessToken'];
        this.accessToken = urlString;
        console.log("access token stored: " + this.accessToken);
      },
      (err) => console.log('HTTP Error', err)
      );

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

  vote(postId, dir){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+ this.userAppAuth,
      }),
    };
    //user-level authorization grant type is "authorization_code"
    console.log(this.userAppAuth);
    const rank = "3";
    let idString: string = postId;
    let fullPostId = idString;
    const postdata = `dir=${dir}&id=${postId}&rank=${rank}`;
    console.log(postdata);
    this.httpClient.post('https://oauth.reddit.com/api/vote', postdata, httpOptions
    ).subscribe(
      (response) => {
        console.log("VOTE");
        console.log(response);
        
      },
      (err) => console.log('HTTP Error', err)
    );
    this.getData();

  }

  getMorePosts(event){
    console.log(this.after);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams().set("accessToken", (this.cookieService.get('redditUserAuth'))); 
    this.httpClient.get('http://localhost:8080/moreData', {headers: headers, params: params})
    .subscribe((response) => {
        console.log('my response: ', response);
        console.log('accessing  ', response['data']['data']['children'])
        var newPosts = response['data']['data']['children'];
        newPosts.forEach(element => {
          if(element['data']['thumbnail'] == "self" || element['data']['thumbnail'] == "default"){
            element['data']['hasPreview'] = false;
          }
          else{
            element['data']['hasPreview'] = true;
          }
          element['data'] = this.addShortText(element['data']);
          this.posts.push(element);
        });
        event.target.complete();
        
      },
      (err) => console.log('HTTP Error', err)
      );
    
    }

    postToNode(){
      console.log(this.userRefreshToken);
      let auth = this.userRefreshToken;
      const postdata = `{"auth":"${auth}"}`;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer '+ this.userAppAuth,
          }),
        };
        this.httpClient.post('http://localhost:8080/userAuth', postdata ,httpOptions)
        .subscribe((response) => {
          console.log('my response: ', response);
        },
        (err) => console.log('HTTP Error', err)
<<<<<<< Updated upstream
        );
      }

      testAuth(){
     
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'text',
            // 'Authorization': 'Bearer '+ this.userAppAuth,
            }),
          };
          this.httpClient.get('http://localhost:8080/authorizeThis', httpOptions)
          .subscribe((response) => {
            console.log('my response: ', response);
            console.log("response['data'} is " + response['data']);
            let urlString = response['data'];
            let twitterLogin = (<HTMLAnchorElement>document.getElementById("twitterLogin"));
            twitterLogin.href = urlString;
            //this.modalCtrl.dismiss();
          },
          (err) => console.log('HTTP Error', err)
          );
        }

        postOauthVerifier(verifier: string){
          console.log("in post verifier");
          const postdata = `{"verifier":"${verifier}"}`;
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer '+ this.userAppAuth,
              }),
            };
            this.httpClient.post('http://localhost:8080/postVerifier', postdata ,httpOptions)
            .subscribe((response) => {
              console.log('my response: ', response);
              //this.confirmAccount();
              //this.modalCtrl.dismiss();
              this.getAccessToken();
            },
            (err) => console.log('HTTP Error', err)
          );
        }

        getAccessToken(){
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'text',
              // 'Authorization': 'Bearer '+ this.userAppAuth,
              }),
            };
            this.httpClient.get('http://localhost:8080/accessToken', httpOptions)
            .subscribe((response) => {
              console.log('my response: ', response);
              console.log("response['accessToken'] is " + response['accessToken']);
              let urlString = response['accessToken'];
              this.accessToken = urlString;
              console.log("access token stored: " + this.accessToken);
            },
            (err) => console.log('HTTP Error', err)
            );

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
        
=======
      );
  
    }
    
  
  }
>>>>>>> Stashed changes

      
  
  
  
  


