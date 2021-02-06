import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import {environment} from '../../environments/environment'
import { Observable, Subscription } from 'rxjs'
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { IonButton } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class RedditServiceService {
  public channel: Observable<any>;
  public channel2: Observable<any>;
  public appAuth: string;
  public userAppAuth: string;
  public messages;
  constructor(private httpClient: HttpClient) {
   }

  pushUserAppAuth(appAuth: string){
    this.userAppAuth = appAuth;
  }

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
        //this.getData();
      },
      (err) => console.log('HTTP Error', err)

    );
  }

  getMessages(){
      //this.bool = true;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer '+ this.userAppAuth,
          }),
        };
        this.httpClient.get('https://oauth.reddit.com/message/inbox', httpOptions)
        .subscribe(data => {
        console.log('my data: ', data);
        this.messages = data;
        
    });

  }

  
}

