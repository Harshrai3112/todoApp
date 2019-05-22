import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TodosService } from 'src/app/shared/todos.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { FormsModule} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { FirstPageComponent } from './first-page/first-page.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CanActivate } from '@angular/router';
import {UserService} from 'src/app/shared/user.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgSemanticModule} from 'ng-semantic';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectsService} from 'src/app/shared/projects.service';
import { OfficeService } from 'src/app/shared/office.service';
// import {SuiModule} from 'ng2-semantic-ui';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    FirstPageComponent,
    LoginComponent,
    SignUpComponent,
    HomePageComponent
  ],
  imports: [
    // SuiModule,
    NgSemanticModule,
    DragDropModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot([ 
      { path: '', redirectTo: 'login',  pathMatch: 'full'},
      { path: 'login', component: LoginComponent },
      {path: 'homePage', component: HomePageComponent},
      { path: 'todo/:type/:id', component: TodoListComponent},
      { path: 'register', component: SignUpComponent}
    ])
  ],
  providers: [TodosService, AngularFirestore, UserService, ProjectsService, OfficeService ],
  bootstrap: [AppComponent]
})
export class AppModule {
 
}
