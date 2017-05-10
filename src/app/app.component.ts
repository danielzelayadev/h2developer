import { Component, OnInit } from '@angular/core';

import { Connection } from './domain/connection';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayConnectionModal = false;

  constructor(private connService : ConnectionService){}

  ngOnInit() {}

  async onNewConnectionSubmit(conn : Connection) {
    this.displayConnectionModal = false;
    try {
      const newConn = await this.connService.newConnection(conn);
      console.log("New Connection:", newConn);
    } catch (err) {
      console.error(err);
    }
  }

}
