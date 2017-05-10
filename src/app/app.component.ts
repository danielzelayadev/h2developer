import { Component, OnInit } from '@angular/core';

import { Connection } from './domain/connection';
import { ConnectionService } from './connection.service';
import { UtilsService } from './utils.service';

import { Confirmation, Message, TreeNode, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayConnectionModal = false;

  tree : TreeNode[] = [];
  treeStyles = { height: '93.6%' };

  ctxSelectedNode : TreeNode;

  msgs : Message[] = [];

  ctxMenuItems : MenuItem[] = [];

  constructor(
    private connService : ConnectionService,
    private confService : ConfirmationService,
    private utils : UtilsService){}

  ngOnInit() {
    this.getConnections();

    this.ctxMenuItems = [
      { label: 'Delete Connection', icon: 'fa-trash', command: ev =>
        this.deleteConnectionCmd(this.ctxSelectedNode.label) }
    ]

  }

  onNodeCtxSelect(ev) {
    this.ctxSelectedNode = ev.node;
  }

  deleteConnectionCmd(conn : string) {
    this.confService.confirm({
      message:  `Are you sure you want to delete connection '${conn}'?`,
      accept: this.deleteConnection.bind(this, conn)
    })
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

  async deleteConnection(conn : string) {
    try {
      await this.connService.deleteConnection(conn);
      this.tree = this.tree.filter(node => node.label !== conn);
    } catch (errMsg) {
      this.msgs.push(this.utils.error('Connection Delete Failed', errMsg));
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
