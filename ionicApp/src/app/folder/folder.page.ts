
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {

  constructor(private authService: AuthenticationService, private router: Router) {}

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}



