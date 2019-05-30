import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {User} from '../shared/user.model';
import {UserService} from '../shared/user.service';
import { OfficeService } from '../shared/office.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any ;
  // tslint:disable-next-line:max-line-length
  constructor(private firestore : AngularFirestore, private afAuth: AngularFireAuth, private router: Router, private userService: UserService, private officeService: OfficeService) { }
  emailUp = false;
  companyUp = false;
  company: string;
  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.firestore.collection('User',ref => ref.where('userId','==',user.uid)).snapshotChanges().subscribe(val => {
        this.user = val.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
        } as User ;
      });
    });
  });
}

  companyChange(){
    this.companyUp =! this.companyUp;
  }
  updateCompany(){
    this.firestore.collection('office', ref => ref.where('name','==',this.company.toLowerCase())).snapshotChanges().subscribe(temp => {
      if(temp.length === 0){
        this.officeService.createOffice({name: this.company});
      }
    });
    this.userService.updateUser(this.user[0].id,{officeId: this.company});
    this.companyUp = false;
  }
  signOut(){
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

}
