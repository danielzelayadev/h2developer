import { Component } from '@angular/core';

import { Connection } from './domain/connection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayConnectionModal = false;

  onNewConnectionSubmit(conn : Connection) {
    this.displayConnectionModal = false;
  }

}
