import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/shared/projects.service';
import { Project } from 'src/app/shared/project.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TodosService } from 'src/app/shared/todos.service';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { forEach } from '@angular/router/src/utils/collection';
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
  constructor(private router: Router, private proService: ProjectsService, private afAuth: AngularFireAuth, private todoService: TodosService, private userService: UserService) { }

  ngOnInit() {
    this.proService.getProject().subscribe(data => {
      this.arr = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Project;
      });
    });
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
    this.userService.getUser().subscribe(data => {
      this.user = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < this.user.length; i++) {
      //   if (this.user[i].userId === this.userId && this.user[i].officeName !== '') {
      //     this.proService.addProject({ type: 'office', userId: this.userId });
      //   }
      // }
    });
  }
  addProject() {
    this.proService.addProject({ type: this.project, userId: this.userId });
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
    this.proService.deleteProject(this.arr[i].id);
  }
}
