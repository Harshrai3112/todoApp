import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/shared/projects.service';
import { Project } from 'src/app/shared/project.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TodosService } from 'src/app/shared/todos.service';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { StatusService } from '../shared/status.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  arr = [];
  user = [];
  project: string;
  flag = false;
  userId: any;
  office: string;
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private proService: ProjectsService, private afAuth: AngularFireAuth, private todoService: TodosService, private userService: UserService, private firestore: AngularFirestore, private statusService: StatusService) { }

  ngOnInit() {
    
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.userId = user.uid;
      }
      this.firestore.collection('User', ref => ref.where('userId','==',this.userId)).snapshotChanges().subscribe(temp => {
        this.user = temp.map(item => {
          return Object.assign(item.payload.doc.data());
        });
      });
      this.proService.getProject(this.userId).subscribe(data => {
        this.arr = data.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Project;
        });
      });
    });

  }
  addProject() {
    this.statusService.addStatus({ status: 'todo', type: this.project.toLowerCase(), userId: this.userId });
    this.statusService.addStatus({ status: 'doing', type: this.project.toLowerCase(), userId: this.userId });
    this.statusService.addStatus({ status: 'done', type: this.project.toLowerCase(), userId: this.userId });
    this.proService.addProject({ type: this.project.toLowerCase(), userId: this.userId });
    this.flag = !this.flag;
  }
  toggleProject() {
    this.flag = !this.flag;
  }
  navigate(type) {
    this.router.navigate(['todo/' + type + '/' + this.userId]);
  }
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
  close(i) {
    console.log('close');
    this.proService.deleteProject(this.arr[i].id, this.arr[i].type, this.userId);
  }
}
