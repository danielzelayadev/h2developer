import { Component, OnInit } from '@angular/core';

import { Connection } from './domain/connection';
import { ConnectionService } from './connection.service';
import { UtilsService } from './utils.service';

import { Message, TreeNode } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayConnectionModal = false;

  connections : string[] = [];

  tree : TreeNode[] = [];
  treeStyles = { height: '93.6%' };

  msgs : Message[] = [];

  constructor(
    private connService : ConnectionService,
    private utils : UtilsService){}

  ngOnInit() {
    this.getConnections();
  }

  async getConnections() {
    try {
      const conns = await this.connService.getConnections();
      conns.map(this.pushNewConn.bind(this));
    } catch (errMsg) {
      this.msgs.push(this.utils.error("Failed to Load Connections", errMsg));
    }
  }

  async onNewConnectionSubmit(conn : Connection) {
    this.displayConnectionModal = false;
    try {
      const newConn = await this.connService.newConnection(conn);
      this.pushNewConn(newConn.url);
      this.msgs.push(this.utils.success('Success', 'Connection added to H2Developer.'));
    } catch (errMsg) {
      this.msgs.push(this.utils.error('New Connection Failed', errMsg));
    }
  }

  pushNewConn(label : string) {
    this.tree.push({
      label, data: { isConn: true, label },
      icon: "fa-database", leaf: false
    })
  }

  onNodeExpand(e) {
  }

}
