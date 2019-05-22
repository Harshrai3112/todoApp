import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  flag = 0;
  error: any;
  userArray: any;
  email: any;
  passwd: any;
  constructor(private afAuth: AngularFireAuth, private router: Router, private ngZone: NgZone, private userService: UserService) {
    this.userService.getUser().subscribe(data => {
      this.userArray = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
    });
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['homePage']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  doGoogleLogin() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['homePage']);
        });
        if (this.userArray.length === 0) {
          this.userService.createUser({ userId: result.user.uid, displayName: result.user.displayName });
        }
        this.userArray.forEach(element => {
          if ((result.user.uid) === element.userId) {
            console.log(JSON.stringify(result.user) );
            // console.log('existing user');
            this.flag = 1;
          }// else {  
          //   this.userService.createUser({ userId: result.user.uid, displayName: result.user.displayName });
          // }
        });
        if (this.flag === 0) {
          this.userService.createUser({ userId: result.user.uid, displayName: result.user.displayName });
        }
      }).catch((error) => {
        window.alert(error);
      });
  }
  signIn() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.passwd)
      .then(result => {
        this.router.navigate(['homePage']);
        console.log(JSON.stringify(this.afAuth.auth.currentUser));
      }).catch(error => {
        window.alert(error.message);
      });

  }
  isLoggedIn() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
  }
  ngOnInit() {
  }

}
