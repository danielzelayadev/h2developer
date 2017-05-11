import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Connection } from '../domain/connection';

@Component({
  selector: 'new-connection-form',
  templateUrl: './new-connection-form.component.html',
  styleUrls: ['./new-connection-form.component.scss']
})
export class NewConnectionFormComponent implements OnInit {

  @Output("onSubmit") _onSubmit = new EventEmitter<Connection>();

  model : Connection = new Connection('', '', '');
  submitted = false;

  ngOnInit() {
    this.reset();
  }

  onSubmit(form) : void {
    this.submitted = true;
    this._onSubmit.emit(this.model);
    form.reset();
    this.reset();
  }

  reset() : void {
    this.model.url = 'jdbc:h2:';
    this.model.username = '';
    this.model.password = '';
    this.submitted = false;
  }

}
