import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public channel: Observable<any>; 

  constructor(private authService: AuthenticationService, private router: Router, private activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    this.channel = this.httpClient.get('http://localhost:3000/subreddits/popular')
    this.channel.subscribe(data => {
      console.log('my data: ', data);
    })
   }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    let urlString: string = "https://www.reddit.com/api/v1/authorize?client_id=" + environment.clientId + "&response_type=code&state=" + environment.apiState + "&redirect_uri=" + environment.redirect + "&duration=" + environment.duration + "&scope=" + environment.scope
    var helloButton = (<HTMLAnchorElement>document.getElementById("helloButton"));
    helloButton.href = urlString;
    



  }

}
