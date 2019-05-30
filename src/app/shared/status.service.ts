import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Status} from './status.model';
@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(private firestore: AngularFirestore) { }
  addStatus(stat){
    this.firestore.collection('status').add(stat);
  }
  getStatus(t,uid){
    return this.firestore.collection('status', ref => ref.where('type','==',t).where('userId','==',uid)).snapshotChanges();
  }
}
