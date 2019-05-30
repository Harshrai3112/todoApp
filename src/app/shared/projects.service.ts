import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from 'src/app/shared/project.model';
import { StatusService } from './status.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  proj: Project;
  statId = [];
  flag = 0;
  constructor(private firestore: AngularFirestore, private statusService: StatusService) {

  }
  addProject(proj) {
    console.log('add');
    this.firestore.collection('projects').add(proj);
  }
  getProject(uid) {
    return this.firestore.collection('projects', ref => ref.where('userId','==',uid)).snapshotChanges();
  }
  deleteProject(id, ty, uid) {
    this.flag = 1;
    console.log('delete');
    this.firestore.collection('status', ref => ref.where('type', '==', ty).where('userId','==',uid)).snapshotChanges().subscribe(temp => {
      if (this.flag === 1) {
        temp.map(item => {
          this.firestore.doc('status/' + item.payload.doc.id).delete();
        });
        this.flag = 0;
      }
    });
    this.firestore.doc('projects/' + id).delete();
  }
}
