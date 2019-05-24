import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { Router } from '@angular/router';
import { OfficeService } from 'src/app/shared/office.service';
import { Office } from '../shared/office.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import {ProjectsService} from 'src/app/shared/projects.service';
import { pipe } from 'rxjs';
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
  constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router, private officeService: OfficeService, private firstore: AngularFirestore, private projectService: ProjectsService) { }
  signUp() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(result => {
      // this.officeService.createOffice({ name: this.officeName.toLowerCase() });
      this.firstore.doc('office/' + this.officeName.toLowerCase()).snapshotChanges().pipe(take(1)).toPromise().then(resp => {
        if (resp.payload.id !== undefined) {
          this.officeService.createOffice({ name: this.officeName.toLowerCase() });
          // tslint:disable-next-line:max-line-length
          this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: this.officeName.toLowerCase(), email: this.email });
        } else {
          this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: resp.payload.id, email: this.email });
        }
      });
      if(this.officeName!==undefined){
        this.projectService.addProject({type: 'office',userId: result.user.uid});
      }
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

