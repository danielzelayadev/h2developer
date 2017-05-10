import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Connection } from './domain/connection';
import { SERVER_URL } from './constants';

@Injectable()
export class ConnectionService {

  url : string = `${SERVER_URL}/connections`;

  constructor(private http : Http) { }

  async newConnection(conn : Connection) : Promise<Connection> {
    try {
      const response = await this.http.post(`${this.url}`, conn).toPromise();
      console.log(response);
      return response.json();
    } catch (e) {
      console.error(e);
    }
  }

}
