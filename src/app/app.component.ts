import { Component, OnInit } from '@angular/core';

import { Connection } from './domain/connection';
import { UserTreeNode } from './domain/db-tree';
import { ConnectionService } from './connection.service';
import { UtilsService } from './utils.service';

import { Confirmation, Message, TreeNode, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayNewConnModal = false;
  displayConnModal = false;

  tree : TreeNode[] = [];
  treeStyles = { height: '93.6%' };

  ctxSelectedNode : TreeNode;

  msgs : Message[] = [];

  ctxMenuItems : MenuItem[] = [];

  connUrl : string = '';

  session : Connection = null;
  conNode : TreeNode   = null;

  constructor(
    private connService : ConnectionService,
    private confService : ConfirmationService,
    private utils : UtilsService){}

  async ngOnInit() {
    await this.getConnections();
    await this.getSession();
  }

  onNodeCtxSelect(ev) {
    if (ev.node.data.isConn)
      this.ctxMenuItems = [
        { label: 'Delete Connection', icon: 'fa-trash', command: ev =>
          this.deleteConnectionCmd(this.ctxSelectedNode.label) }
      ];
    else
      this.ctxMenuItems = [];

    this.ctxSelectedNode = ev.node;
  }

  deleteConnectionCmd(conn : string) {
    this.confService.confirm({
      message:  `Are you sure you want to delete connection '${conn}'?`,
      accept: this.deleteConnection.bind(this, conn)
    })
  }

  onDisconnectClick() {
    this.disconnect();
  }

  async getSession() {
    try {
      const sessionData = await this.connService.getSession();
      this.session = sessionData.conn;
      this.synchTree(sessionData.dbTree);
    } catch (errMsg) {
      this.msgs.push(this.utils.error("Failed to Load Session", errMsg));
    }
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
    this.displayNewConnModal = false;
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
      this.session = null;
      this.conNode = null;
    } catch (errMsg) {
      this.msgs.push(this.utils.error('Connection Delete Failed', errMsg));
    }
  }

  async connect(conn : Connection) {
    try {
      const dbTree = await this.connService.connect(conn);
      this.session = conn;
      this.synchTree(dbTree);
    } catch (errMsg) {
      this.msgs.push(this.utils.error('Connection Failed,', errMsg));
    }
  }

  async disconnect() {
    try {
      await this.connService.disconnect();
      this.session = null;
      this.conNode.children = [];
      this.conNode = null;
    } catch (errMsg) {
      this.utils.error('Failed to Disconnect', errMsg);
    }
  }

  synchTree(dbTree : UserTreeNode[]) {
    if (!dbTree) return;

    this.conNode = this.tree.find(node => node.label === this.session.url);

    this.conNode.children.push({
      label: "Users", icon: "fa-users",
      leaf: false, children: []
    });

    const usersNode = this.conNode.children[0];

    dbTree.map(utn => {
      this.pushNewUser(usersNode, utn.user);

      const userNode = usersNode.children[usersNode.children.length - 1];

      userNode.children.push({
        label: "Schemas",
        expandedIcon: "fa-folder-open", collapsedIcon: "fa-folder",
        leaf: false, children: []
      });

      const schemasNode = userNode.children[0];

      utn.schemas.map(stn => {
        this.pushNewSchema(schemasNode, stn.schema);

        const schemaNode = schemasNode.children[schemasNode.children.length - 1];

        Object.keys(stn).slice(1).map(key => {
          const objs : string[] = stn[key];

          schemaNode.children.push({
            label: (() => key[0].toUpperCase()+key.slice(1))(), expandedIcon: "fa-folder-open",
            collapsedIcon: "fa-folder", leaf: false, children: []
          });

          const objNode = schemaNode.children[schemaNode.children.length - 1];

          objs.map(obj => this.pushNewDbObj(objNode, obj));
        })
      });
    });
  }

  pushNewConn(label : string) {
    this.tree.push({
      label, data: { isConn: true, url: label },
      icon: "fa-database", leaf: false, children: []
    });
  }

  pushNewUser(node : TreeNode, label : string) {
    node.children.push({
      label, data: { isUser: true, name: label },
      expandedIcon: "fa-user-o", collapsedIcon: "fa-user",
      leaf: false, children: []
    });
  }

  pushNewSchema(node : TreeNode, label : string) {
    node.children.push({
      label, data: { isSchema: true, name: label },
      expandedIcon: "fa-folder-open", collapsedIcon: "fa-folder",
      leaf: false, children: []
    });
  }

  pushNewDbObj(node : TreeNode, label : string) {
    node.children.push({
      label, data: { isDbObj: true, name: label },
      icon: "fa-table", leaf: true
    });
  }

  onConnectSubmit(conn : Connection) {
    this.displayConnModal = false;
    this.connect(conn);
    this.connUrl = '';
  }

  onNodeExpand({ node }) {
    if (!node.data.isConn || (this.session !== null && this.session.url === node.label))
      return;

    this.connUrl = node.label;
    this.displayConnModal = true;
  }

}
