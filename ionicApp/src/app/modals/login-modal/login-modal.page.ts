import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  private myForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public httpClient: HttpClient) {
    this.myForm = formBuilder.group({
      field1: ['', Validators.required],
      field2: ['', Validators.required]
      });
   }

  ngOnInit() {
  }

  saveForm(){
    console.log(this.myForm.value);
    console.log(this.myForm.value.field1);
    console.log(this.myForm.value.field2);
    let email = this.myForm.value.field1;
    let password = this.myForm.value.field2;
    const postdata = `{"id":7688, "email":"${email}", "password":"${password}"}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.post('http://localhost:8080/user', postdata ,httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
      },
      (err) => console.log('HTTP Error', err)
    );

  }
}
