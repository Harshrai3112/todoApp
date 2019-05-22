import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User} from 'src/app/shared/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  createUser(user){
    this.firestore.collection('User').add(user);
  }
  getUser(){
    return this.firestore.collection('User').snapshotChanges();
  }
  constructor(private firestore: AngularFirestore) { }
}
