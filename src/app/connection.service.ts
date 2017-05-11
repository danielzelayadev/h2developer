import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Connection } from './domain/connection';
import { UserTreeNode } from './domain/db-tree';
import { SERVER_URL } from './constants';

@Injectable()
export class ConnectionService {

  url : string = `${SERVER_URL}/connections`;

  constructor(private http : Http) { }

  async connect(conn : Connection) : Promise<UserTreeNode[]> {
    try {
      const response = await this.http.post(`${this.url}/connect`, conn).toPromise();
      return response.json();
    } catch (e) {
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

  private handleError(e : any) : Promise<any> {
    const error = JSON.parse(e._body);
    console.error('Server says:\n', error.log);
    return Promise.reject(error.message);
  }

}
