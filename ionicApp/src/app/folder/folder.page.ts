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
  @ViewChild('helloBut') helloButton: IonButton;

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    this.channel.subscribe(data => {
      console.log('my data: ', data);
    })
   }

  ngOnInit() {
    //this.folder = this.activatedRoute.snapshot.paramMap.get('id');
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
    });

  }

}

