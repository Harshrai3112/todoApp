import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Office} from 'src/app/shared/office.model';
@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  createOffice(office){
    return this.firestore.collection('office').doc(office.name).set(office);
  }
  getOffice(){
   return this.firestore.collection('office').snapshotChanges();
  }
  constructor(private firestore: AngularFirestore) { }
}
