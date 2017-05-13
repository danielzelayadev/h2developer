import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss']
})
export class QueryEditorComponent {

  @Input() disabled = false;
  @Output() onCtrlEnter = new EventEmitter<string>();

  text : string = '';

  ctrlEnterPressed() {
    this.onCtrlEnter.emit(this.text);
  }

}
