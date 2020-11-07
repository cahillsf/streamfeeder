import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs'
import {HttpClient, HttpClientModule} from '@angular/common/http'

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public channel: Observable<any>; 

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    this.channel.subscribe(data => {
      console.log('my data: ', data);
    })
   }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    let urlString: string = "https://www.reddit.com/api/v1/authorize?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration + "&scope=" + environment.scope
    var helloButton = (<HTMLAnchorElement>document.getElementById("helloButton"));
    helloButton.href = urlString;
    



  }

}
