import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Connection } from './domain/connection';
import { DBTreeRoot, orderObjs } from './domain/db-tree';
import { SessionData } from './domain/session-data';
import { Result } from './domain/result';
import { SERVER_URL } from './constants';

@Injectable()
export class ConnectionService {

  url : string = `${SERVER_URL}/connections`;

  constructor(private http : Http) { }

  async connect(conn : Connection) : Promise<DBTreeRoot> {
    try {
      const response = await this.http.post(`${this.url}/connect`, conn).toPromise();
      const tree = response.json();
      orderObjs(tree);
      return tree;
    } catch (e) {
      return this.handleError(e);
    }
  }

  async disconnect() : Promise<any> {
    try {
      await this.http.post(`${this.url}/disconnect`, {}).toPromise();
    } catch (e) {
      return this.handleError(e);
    }
  }

  async getSession() : Promise<SessionData> {
    try {
      const response = await this.http.get(`${this.url}/session`).toPromise();
      const sd : SessionData = response.json();
      orderObjs(sd.dbTree);
      return sd;
    } catch(e) {
      return this.handleError(e);
    }
  }

  async getConnections() : Promise<string[]> {
    try {
      const response = await this.http.get(this.url).toPromise();
      return response.json().map(e => e.url);
    } catch(e) {
      return this.handleError(e);
    }
  }

  async newConnection(conn : Connection) : Promise<Connection> {
    try {
      const response = await this.http.post(this.url, conn).toPromise();
      return response.json();
    } catch (e) {
      return this.handleError(e);
    }
  }

  async deleteConnection(url : string) : Promise<any> {
    try {
      await this.http.delete(this.url, { body: { url } }).toPromise();
    } catch(e) {
      return this.handleError(e);
    }
  }

  async run(statement: string) : Promise<Result> {
    try {
      const response = await this.http.post(`${this.url}/run`, statement).toPromise();
      return response.json();
    } catch(e) {
      return this.handleError(e);
    }
  }

  private handleError(e : any) : Promise<any> {
    const error = JSON.parse(e._body);
    console.error('Server says:\n', error.log);
    return Promise.reject(error.message);
  }

}
