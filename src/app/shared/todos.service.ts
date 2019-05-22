import { Injectable } from '@angular/core';
import { Todo } from 'src/app/shared/todo.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private firestore: AngularFirestore) { }
  createTodo(todo: Todo) {
    this.firestore.collection('todos').add(todo);
  }
  getTodo() {
    return this.firestore.collection('todos').snapshotChanges();
  }
  deleteTodo(id) {
    this.firestore.doc('todos/' + id).delete();
  }
  update(id, data) {
    this.firestore.doc('todos/' + id).update(data);
  } 
}
