import { Component, OnInit } from '@angular/core';
import { TodosService } from 'src/app/shared/todos.service';
import { Todo } from 'src/app/shared/todo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
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
  data: any;
  userId: any;
  prior: 0;
  updateArray = [];
  fadingArray = [];
  d1: Date;
  d2: Date;
  flag = 0;
  maxPri = 0;
  x: any;
  taskAddition = false;
  type: string;
  office: any;
  currentDate = new Date();
  assignTask: string;
  // tslint:disable-next-line:max-line-length
  constructor(private todoService: TodosService, private router: Router, private afAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService) {
  }
  ngOnInit() {
    console.log(this.currentDate);
    this.type = this.route.snapshot.paramMap.get('type');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
    this.todoService.getTodo().subscribe(data => {
      this.todos = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Todo;
      });
      this.todos.forEach(val => {
        if (val.priority > this.maxPri) {
          this.maxPri = val.priority;
        }
      });
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].type !== this.type) {
          this.todos.splice(i, 1);
          i--;
        }
      }
      this.todos.sort((a, b) => {
        return a.priority - b.priority;
      });
    });
    this.userService.getUser().subscribe(data => {
      this.user = data.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
      this.user.forEach(user => {
        if (user.userId === this.userId) {  
          this.office = user.officeName;
        }
      });
      for (let i = 0; i < this.user.length; i++) {
        if (this.user[i].officeName !== this.office || this.user[i].userId===this.userId) {
          this.user.splice(i, 1);
          i--;
        }
      }
    });
  }
  makeTodo() {
    if (this.flag === 1) {
      this.flag = 0;
      return;
    }
    // tslint:disable-next-line:max-line-length
    this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: this.userId, priority: this.maxPri + 1, type: this.type });
    this.todoService.createTodo(this.data);
    this.user.forEach(user => {
      if (this.assignTask !== undefined && user.userName.toLowerCase() === this.assignTask.toLowerCase()) {  
        // tslint:disable-next-line:max-line-length
        this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: user.userId, priority: this.maxPri + 1, type: this.type });
        this.todoService.createTodo(this.data);
      }
    });
    this.updateArray.push(false);
    this.fadingArray.push(false);
    this.work = '';
    this.prior = 0;
    this.completionDate = new Date();
    this.taskAddition = false;
  }
  delete(id) {
    let pri: any;
    this.updateArray.pop();
    this.fadingArray.pop();
    this.todos.forEach(val => {
      if (val.id === id) {
        pri = val.priority;
      }
      if (val.priority >= pri) {
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
      if (user.userName === this.assignTask) {  
        // tslint:disable-next-line:max-line-length
        this.data = Object.assign({}, { work: this.work, completionDate: this.completionDate, daysDelayed: this.dateDiff(this.completionDate, new Date()), idOfUser: user.userId, priority: this.maxPri + 1, type: this.type });
        this.todoService.createTodo(this.data);
      }
    });
    this.updateArray[i] = false;
    this.work = '';
    this.prior = 0;
    this.completionDate = new Date();
  }

  completed(id, i) {
    this.fadingArray[i] = true;
    let pri: any;
    setTimeout(() => {
      this.todos.forEach(val => {
        if (val.id === id) {
          pri = val.priority;
        }
        if (val.priority > pri) {
          this.todoService.update(val.id, { priority: val.priority - 1 });
        }
      });
      this.todoService.deleteTodo(id);
      this.updateArray.pop();
      this.fadingArray.splice(i, 1);
    }, 2000, id, i);

  }

  dateDiff(date1, date2) {
    this.d1 = new Date(date1);
    this.d2 = new Date(date2);
    // tslint:disable-next-line:max-line-length
    return Math.floor((Date.UTC(this.d1.getFullYear(), this.d1.getMonth(), this.d1.getDate()) - Date.UTC(this.d2.getFullYear(), this.d2.getMonth(), this.d2.getDate())) / (1000 * 60 * 60 * 24));
  }
  toggleTask() {
    this.taskAddition = !this.taskAddition;
  }
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    // console.log(this.todos[event.previousIndex].priority, this.todos[event.currentIndex].priority);
    const pri = this.todos[event.currentIndex].priority;
    if (this.todos[event.previousIndex].priority > this.todos[event.currentIndex].priority) {
      this.todos.forEach(val => {
        // tslint:disable-next-line:max-line-length
        if (val.priority < this.todos[event.previousIndex].priority && val.idOfUser === this.userId) {
          this.todoService.update(val.id, { priority: val.priority + 1 });
        }
      });
      this.todoService.update(this.todos[event.previousIndex].id, { priority: pri });
    }
    if (this.todos[event.previousIndex].priority < this.todos[event.currentIndex].priority) {
      this.todos.forEach(val => {
        // tslint:disable-next-line:max-line-length
        if (val.priority > this.todos[event.previousIndex].priority && val.idOfUser === this.userId) {
          this.todoService.update(val.id, { priority: val.priority - 1 });
        }
      });
      this.todoService.update(this.todos[event.previousIndex].id, { priority: pri });
    }
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);

  }
}
