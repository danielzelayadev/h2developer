import { Component, OnInit } from '@angular/core';

import { Connection } from './domain/connection';
import { DBTreeRoot, SchemaTreeNode, UserTreeNode, DBObject, nonarrs } from './domain/db-tree';
import { ConnectionService } from './connection.service';
import { Result } from './domain/result';
import { UtilsService } from './utils.service';

import { Confirmation, Message, TreeNode, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';

const templateMapping = {
  constants: 'createConstant',
  constraints: 'createConstraint',
  functions: 'createFunction',
  indexes: 'createIndex',
  sequences: 'createSequence',
  tables: 'createTable',
  triggers: 'createTrigger',
  views: 'createView'
};

const schemaMapping = {
  constants: 'constant_schema',
  constraints: 'constraint_schema',
  functions: 'alias_schema',
  indexes: 'table_schema',
  sequences: 'sequence_schema',
  tables: 'table_schema',
  triggers: 'trigger_schema',
  views: 'table_schema'
};

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

  result : Result = null;
  columnOptions : SelectItem[] = [];

  text : string = '';

  constructor(
    private connService : ConnectionService,
    private confService : ConfirmationService,
    private utils : UtilsService){}

  async ngOnInit() {
    await this.getConnections();
    await this.getSession();
  }

  async run(statement : string) {
    const result = await this.connService.run(statement);
    this.result = result;
    this.columnOptions = this.result.resultSet.columns.map(c => ({ label: c, value: c }));

    if (this.result.updateCount !== -1)
      await this.getSession();
  }

  onNodeSelect(ev) {
    const { type, query } = ev.node.data;
    if (type !== 'conn')
      this.run(query);
  }

  onNodeCtxSelect(ev) {
    const { type, ddl, query, templates } = ev.node.data;
    const hasDDL = type !== 'other-users' && !type.includes('GRP');

    if (type === 'conn') {
      this.ctxMenuItems = [
        { label: 'Delete Connection', icon: 'fa-trash',
          command: e => this.deleteConnectionCmd(this.ctxSelectedNode.label) }
      ];

      if (this.session && ev.node.label === this.session.url)
        this.ctxMenuItems = [
          { label: 'Create Schema', icon: 'fa-plus', command: e => this.text = templates.createSchema  },
          { label: 'Create User',   icon: 'fa-user-plus', command: e => this.text = templates.createUser  },
          { label: 'Change Admin',  icon: 'fa-user', command: e => this.text = templates.setAdmin },
          { label: 'Change Password', icon: 'fa-key', command: e => this.text = templates.setPassword  },
          { label: 'Disonnect', icon: 'fa-plug', command: e => this.disconnect() },
          ...this.ctxMenuItems
        ]
      else
        this.ctxMenuItems = [
          { label: 'Connect', icon: 'fa-plug', command: e => this.onNodeExpand(ev) },
          ...this.ctxMenuItems
        ]
    }
    // else if () {
    //   this.ctxMenuItems = [
    //     { label: 'Show DDL', icon: 'fa-eye', command: e => this.text = node.data.ddl; }
    //   ];
    // }
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

      if (conn === this.session.url) {
        this.session = null;
        this.conNode = null;
      }

    } catch (errMsg) {
      this.msgs.push(this.utils.error('Connection Delete Failed', errMsg));
    }
  }

  async connect(conn : Connection) {
    try {
      const dbTree = await this.connService.connect(conn);

      if (this.session)
        this.conNode.children = [];

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

  synchTree(dbTree : DBTreeRoot) {
    if (!dbTree) return;

    this.conNode = this.tree.find(node => node.label === this.session.url);
    this.conNode.children = [];
    this.conNode.data.templates = dbTree.templates;

    const otherUsersNode = {
      label: 'Other Users', data:
      { type: 'other-users', ddl: '',
        query: `select * from information_schema.users where name!='${this.session.username.toUpperCase()}'`,
        templates: { createUser: dbTree.templates.createUser } },
      icon: 'fa-users', children: [], leaf: false
    };

    dbTree.userSchemas.map(this.pushSchemaNode.bind(this, this.conNode));
    dbTree.otherUsers.map(this.pushUserNode.bind(this, otherUsersNode));

    this.conNode.children.push(otherUsersNode);
  }

  pushSchemaNode(root : TreeNode, schemaNode : SchemaTreeNode) {
    const newNode : TreeNode = {
      label: schemaNode.schema, data: { type: 'schema', ddl: schemaNode.ddl, query: schemaNode.query,
        templates: schemaNode.templates },
      expandedIcon: 'fa-folder-open', collapsedIcon: 'fa-folder',
      children: [], leaf: false
    };

    const schemaObjs = Object.keys(schemaNode).filter(so => !nonarrs.includes(so));

    schemaObjs.map(this.pushObjGroupNode.bind(this, newNode, schemaNode));

    root.children.push(newNode);
  }

  pushUserNode(root : TreeNode, userNode : UserTreeNode) {
    const newNode : TreeNode = {
      label: userNode.user, data: { type: 'user', ddl: userNode.ddl, query: userNode.query,
        templates: userNode.templates },
      expandedIcon: "fa-user-o", collapsedIcon: "fa-user",
      children: [], leaf: false
    };

    userNode.schemas.map(this.pushSchemaNode.bind(this, newNode));

    root.children.push(newNode);
  }

  pushObjGroupNode(root : TreeNode, schemaNode : SchemaTreeNode, group : string) {
    const newNode : TreeNode = {
      label: group.toUpperCase(), data:
      { type: `GRP-${group}`, ddl: '', query:
      `select * from information_schema.${
        group === 'functions' ? 'function_aliases' : group
      } where ${schemaMapping[group]}='${root.label}'`,
      templates: { [templateMapping[group]]: schemaNode.templates[templateMapping[group]] } },
      expandedIcon: 'fa-folder-open', collapsedIcon: 'fa-folder',
      children: [], leaf: false
    };

    schemaNode[group].map(this.pushObjNode.bind(this, newNode, group));

    root.children.push(newNode);
  }

  pushObjNode(root : TreeNode, group : string, obj : DBObject) {
    root.children.push({
      label: obj.name, data:
      { type: `OBJ-${group}-${obj}`, ddl: obj.ddl, query: obj.query,
        templates: obj.templates },
      icon: 'fa-table', children: []
    });
  }

  pushNewConn(label : string) {
    this.tree.push({
      label, data: { type: 'conn', ddl: '', query: '', templates: [] },
      icon: "fa-database", children: [],
      leaf: false
    });
  }

  onConnectSubmit(conn : Connection) {
    this.displayConnModal = false;
    this.connect(conn);
    this.connUrl = '';
  }

  onNodeExpand({ node }) {
    if (node.data.type !== 'conn' || (this.session !== null && this.session.url === node.label))
      return;

    this.connUrl = node.label;
    this.displayConnModal = true;
  }

}
