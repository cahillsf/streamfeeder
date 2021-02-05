import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { ModalController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  private myForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public httpClient: HttpClient, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.myForm = formBuilder.group({
      field1: ['', [Validators.required, Validators.email]],
      field2: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required]
      });
   }

  ngOnInit() {
  }
  //
  saveForm(){
    console.log(this.myForm.value);
    console.log(this.myForm.value.field1);
    console.log(this.myForm.value.field2);
    let email = this.myForm.value.field1;
    let password = this.myForm.value.field2;
    let firstName = this.myForm.value.firstName;
    let lastName = this.myForm.value.lastName;
    const postdata = `{"id":7688, "email":"${email}", "password":"${password}", "firstName":"${firstName}", "lastName":"${lastName}"}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+ this.userAppAuth,
        }),
      };
      this.httpClient.post('http://localhost:8080/user', postdata ,httpOptions)
      .subscribe((response) => {
        console.log('my response: ', response);
        this.confirmAccount();
        this.modalCtrl.dismiss();
      },
      (err) => console.log('HTTP Error', err)
    );

  }

  get field1() {
    return this.myForm.get('field1');
  }

  async confirmAccount() {
    const toast = await this.toastCtrl.create({
      message: 'Account Successfully Created',
      duration: 2000,
      position: 'top',
      color: 'secondary'
    });
    toast.present();
    this.modalCtrl.dismiss();
  }
}
