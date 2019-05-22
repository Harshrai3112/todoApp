import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { Router } from '@angular/router';
import { OfficeService } from 'src/app/shared/office.service';
import { Office } from '../shared/office.model';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  email: any;
  password: any;
  officeName: any;
  name: string;
  flag = 0;
  officeId: any;
  // tslint:disable-next-line:max-line-length
  constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router, private officeService: OfficeService, private firstore: AngularFirestore) { }
  signUp() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(result => {
      this.firstore.collection('office', ref => ref.where('name', '==', this.officeName)).snapshotChanges().subscribe(temp => {
        this.officeId = temp.map(item => {
          console.log('temop');
          this.flag = 1;
          return item.payload.doc.id;
        })[0];
      },
      () => {
        console.log('() inside');
        if (this.flag === 0) {
          console.log('if');
          let x = this.officeService.createOffice({ name: this.officeName });
          x.then(res => {
            this.officeId = res.id;
            this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: this.officeId, email: this.email });
          });
        } else {
          console.log('else');
          this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: this.officeId, email: this.email });
        }
      }
      );
      // console.log(JSON.stringify(result.user));
      window.alert('successfully registered');
      this.afAuth.auth.currentUser.sendEmailVerification()
        .then(res => {
          console.log(res);
          this.router.navigate(['/login']);
        },
          err => {
            window.alert(err.message);
          });
    }).catch(error => {
      window.alert(error.message);
    });
  }
  ngOnInit() {
  }

}
