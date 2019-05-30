import { Component, OnInit } from '@angular/core';
import { TodosService } from 'src/app/shared/todos.service';
import { Todo } from 'src/app/shared/todo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { StatusService } from '../shared/status.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Status } from '../shared/status.model';
import { MatSnackBar,MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-todo-list',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
      })),
      state('closed', style({
        backgroundColor: 'rgb(179, 53, 50)',
        opacity: 0.1,
        color: 'green',
      })),
      transition('open => closed', [
        animate('2s  ease-out')
      ]),
      transition('closed => open', [
        animate('2s  ease-out')
      ]),
    ]),
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  work = '';
  completionDate: Date;
  todos = [];
  user = [];
  status = [];
  data: any;
  userId: any;
  prior: 0;
  updateArray = [];
  fadingArray = [];
  d1: Date;
  d2: Date;
  flag = 0;
  maxPri = [];
  x: any;
  taskAddition = [];
  type: string;
  office: any;
  currentDate = new Date();
  assignTask: string;
  list = '';
  stat = [];
  noOfStatArray = [];
  listAddition = false;
  horizontalPosition = 'center';
  verticalPositon = 'top';
  action = true;
  actionButtonLabel = 'DO IT';
  userName: string;
  // tslint:disable-next-line:max-line-length
  constructor(private todoService: TodosService, private router: Router, private afAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService, private firestore: AngularFirestore, private statService: StatusService, private snackBar: MatSnackBar) {
  }
  ngOnInit() {
    
    this.type = this.route.snapshot.paramMap.get('type').toLowerCase();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
      // tslint:disable-next-line:max-line-length
      this.firestore.collection('todos', ref => ref.where('idOfUser', '==', this.userId).where('type', '==', this.type)).snapshotChanges().subscribe(val => {
        this.todos = val.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Todo;
        });
        this.statService.getStatus(this.type,this.userId).subscribe(temp => {
          this.status = temp.map(item => {
            this.maxPri.push(0);
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            } as Status;
          });
          // const len = this.status.length;,
          // let i = 0;
          this.status.forEach((value, i) => {
            this.todos.forEach(val => {
              if (value.status === val.taskStatus && val.priority > this.maxPri[i]) {
                this.maxPri[i] = val.priority;
              }
            });
            this.noOfStatArray.push(i.toString());
          });
          this.stat = this.status;
        });
        this.todos.sort((a, b) => {
          return a.priority - b.priority;
        });
        this.firestore.collection('User', ref => ref.where('userId', '==', this.userId)).snapshotChanges().subscribe(temp => {
          this.office = temp.map(item => {
            this.userName = Object.assign(item.payload.doc.data()).userName;
            return Object.assign(item.payload.doc.data()).officeId;
          })[0];

          // tslint:disable-next-line:max-line-length
          console.log(this.office);
          this.firestore.collection('User', ref => ref.where('officeId', '==', this.office)).snapshotChanges().subscribe(val => {
            this.user = val.map(item => {
              return item.payload.doc.data();
            });
          });
        });
      });
    });

  }
  toggleList() {
    this.listAddition = !this.listAddition;
    console.log(this.listAddition);
  }
  addList() {
    this.taskAddition.push(false);
    this.statService.addStatus({ status: this.list, type: this.type, userId: this.userId });
    console.log(this.maxPri);
    this.list = '';
    this.listAddition = !this.listAddition;
  }
  makeTodo(i, status) {
    if (this.flag === 1) {
      this.flag = 0;
      return;
    }
    let p: any;
    this.status.forEach((data, i) => {
      if (data.status === status) {
        p = this.maxPri[i];
      }
    });
    // tslint:disable-next-line:max-line-length
    this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: this.userId, priority: p + 1, type: this.type, taskStatus: status });
    this.todoService.createTodo(this.data);
    this.user.forEach(user => {
      if (this.assignTask !== undefined && user.email.toLowerCase() === this.assignTask.toLowerCase()) {
        // tslint:disable-next-line:max-line-length
        this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: user.userId, priority: p + 1, type: this.type, taskStatus: status });
        this.todoService.createTodo(this.data);
      }
    });
    this.updateArray.push(false);
    this.fadingArray.push(false);
    this.work = '';
    this.prior = 0;
    this.completionDate = new Date();
    this.taskAddition[i] = false;
  }
  delete(pri, status, id) {
    this.updateArray.pop();
    this.fadingArray.pop();
    this.todos.forEach(val => {
      if (val.priority >= pri && val.taskStatus === status) {
        this.todoService.update(val.id, { priority: val.priority - 1 });
      }
    });
    this.todoService.deleteTodo(id);
  }
  update(i) {
    this.updateArray[i] = true;
  }
  updateTodo(id, i) {
    // tslint:disable-next-line:max-line-length
    this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()) });
    this.todoService.update(id, this.data);
    this.user.forEach(user => {
      if (this.assignTask !== undefined && user.userName.toLowerCase() === this.assignTask.toLowerCase()) {
        // tslint:disable-next-line:max-line-length
        this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: user.userId, priority: this.maxPri[0] + 1, type: this.type });
        this.todoService.createTodo(this.data);
      }
    });
    this.updateArray[i] = false;
    this.work = '';
    this.prior = 0;
    this.completionDate = new Date();
  }

  completed(id, i, status, pri) {
    this.fadingArray[i] = true;
    // let pri: any;
    setTimeout(() => {
      this.todos.forEach(val => {
        if (val.priority > pri && val.taskStatus === status) {
          this.todoService.update(val.id, { priority: val.priority - 1 });
        }
      });
      this.todoService.deleteTodo(id);
      this.updateArray.pop();
      this.fadingArray.splice(i, 1);
    }, 2000, id, i, status);
  }

  dateDiff(date1, date2) {
    this.d1 = new Date(date1);
    this.d2 = new Date(date2);
    // tslint:disable-next-line:max-line-length
    return Math.floor((Date.UTC(this.d1.getFullYear(), this.d1.getMonth(), this.d1.getDate()) - Date.UTC(this.d2.getFullYear(), this.d2.getMonth(), this.d2.getDate())) / (1000 * 60 * 60 * 24));
  }
  toggleTask(i) {
    this.taskAddition[i] = !this.taskAddition[i];
  }
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
  drop(event: CdkDragDrop<string[]>, status) {
    if (event.previousContainer !== event.container) {
      if (this.todos[event.currentIndex] === undefined) {
        this.todos.forEach(value => {
          // tslint:disable-next-line:max-line-length
          if (value.priority >= this.todos[event.previousIndex].priority && value.taskStatus === this.todos[event.previousIndex].taskStatus) {
            this.todoService.update(value.id, { priority: value.priority - 1 });
          }
        });
        this.todoService.update(this.todos[event.previousIndex].id, { taskStatus: status, priority: 1 });
      } else {
        const pri = this.todos[event.currentIndex].priority;
        this.todos.forEach((value, i) => {
          if (value.priority >= this.todos[event.currentIndex].priority && value.taskStatus === status) {
            this.todoService.update(value.id, { priority: value.priority + 1 });
          }
          // tslint:disable-next-line:max-line-length
          if (value.priority >= this.todos[event.previousIndex].priority && value.taskStatus === this.todos[event.previousIndex].taskStatus) {
            this.todoService.update(value.id, { priority: value.priority - 1 });
          }

        });
        // tslint:disable-next-line:max-line-length
        this.todoService.update(this.todos[event.previousIndex].id, { taskStatus: this.todos[event.currentIndex].taskStatus, priority: pri });
      }
    } else {
      // console.log(this.todos[event.previousIndex].priority, this.todos[event.currentIndex].priority);
      const pri = this.todos[event.currentIndex].priority;
      if (this.todos[event.previousIndex].priority > this.todos[event.currentIndex].priority) {
        this.todos.forEach(val => {
          // tslint:disable-next-line:max-line-length
          if (val.priority < this.todos[event.previousIndex].priority && val.taskStatus === status && val.priority >= pri) {
            this.todoService.update(val.id, { priority: val.priority + 1 });
          }
        });
        this.todoService.update(this.todos[event.previousIndex].id, { priority: pri });
      }
      if (this.todos[event.previousIndex].priority < this.todos[event.currentIndex].priority) {
        this.todos.forEach(val => {
          // tslint:disable-next-line:max-line-length
          if (val.priority > this.todos[event.previousIndex].priority && val.taskStatus === status && val.priority <= pri) {
            this.todoService.update(val.id, { priority: val.priority - 1 });
          }
        });
        this.todoService.update(this.todos[event.previousIndex].id, { priority: pri });
      }
      // moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    }
  }
}
