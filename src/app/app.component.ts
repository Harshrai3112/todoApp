import { Component } from '@angular/core';
import {webNotification} from 'simple-web-notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todoApp';

  // onClick(){
  //   console.log(webNotification);
  //   webNotification.showNotification('Todo Notfication',{
  //     body: 'Notification testing',
  //     onClick: function onNotificationClicked(){
  //       console.log('notyy clicked');
  //     },
  //     autoClose: 3000
  //   },(error, hide) =>{
  //     if(error){
  //       window.alert('unable to show notification'+error.message);
  //     } else {
  //       console.log('Notification shown');
  //       setTimeout(function hideNotification(){
  //         console.log('hiding notification');
  //         hide();
  //       },4000);
  //     }
  //   });
  // }
}
