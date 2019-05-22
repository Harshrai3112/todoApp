import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Project} from 'src/app/shared/project.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  proj: Project;
  constructor(private firestore: AngularFirestore) { }
  addProject(proj){
    this.firestore.collection('projects').add(proj);
  }
  getProject(){
    return this.firestore.collection('projects').snapshotChanges();
  }
  deleteProject(id){
    this.firestore.doc('projects/'+ id).delete();
  }
}
