import { Component, OnInit, NgZone } from '@angular/core';
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
import { ProjectsService } from 'src/app/shared/projects.service';
import { pipe } from 'rxjs';
import { StatusService } from '../shared/status.service';
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
  userArray: any;
  company: any;
  // tslint:disable-next-line:max-line-length
  constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router, private officeService: OfficeService, private firstore: AngularFirestore, private projectService: ProjectsService, private statService: StatusService, private ngZone: NgZone) { }
  signUp() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(result => {
      // this.officeService.createOffice({ name: this.officeName.toLowerCase() });
      if (this.officeName !== undefined) {
        this.firstore.doc('office/' + this.officeName.toLowerCase()).snapshotChanges().pipe(take(1)).toPromise().then(resp => {
          if (resp.payload.id !== undefined) {
            this.officeService.createOffice({ name: this.officeName.toLowerCase() });
            // tslint:disable-next-line:max-line-length
            this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: this.officeName.toLowerCase(), email: this.email });
            this.projectService.addProject({ type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'todo', type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'doing', type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'done', type: 'office', userId: result.user.uid });
          } else {
            this.userService.createUser({ userName: this.name, userId: result.user.uid, officeId: resp.payload.id, email: this.email });
          }
        });
        if (this.officeName !== undefined) {

        }
      } else {
        // tslint:disable-next-line:max-line-length
        this.userService.createUser({ userName: this.name, userId: result.user.uid, email: this.email });
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
  doGoogleLogin() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        if (this.userArray.length === 0) {
          this.userService.createUser({ userId: result.user.uid, displayName: result.user.displayName });
        }
        this.userArray.forEach(element => {
          if ((result.user.uid) === element.userId) {
            console.log('existing user');
            this.flag = 1;
          }
        });
        this.ngZone.run(() => {
          this.router.navigate(['homePage']);
        });
        if (this.flag === 1) {
          window.alert('you are Existing User')
          this.ngZone.run(() => {
            this.router.navigate(['login']);
          });
        }
        if (this.flag === 0) {
          this.company = window.prompt('Do You Work in any company ? Write Your Company name so that you can work collaboratively');
          console.log(this.company, typeof this.company, typeof null);
          if (this.company !== null) {
            // tslint:disable-next-line:max-line-length
            this.projectService.addProject({ type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'todo', type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'doing', type: 'office', userId: result.user.uid });
            this.statService.addStatus({ status: 'done', type: 'office', userId: result.user.uid });
            console.log('if');
            // tslint:disable-next-line:max-line-length
            this.userService.createUser({ userId: result.user.uid, userName: result.user.displayName, email: result.user.email, officeId: this.company.toLowerCase() });
          } else {
            console.log('else');
            this.userService.createUser({ userName: result.user.displayName, userId: result.user.uid, email: result.user.email });
          }
        }
      }).catch((error) => {
        window.alert(error);
      });
  }
  ngOnInit() {
    this.userService.getUser().subscribe(data => {
      this.userArray = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
    });


  }
}
