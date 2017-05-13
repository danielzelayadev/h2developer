import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss']
})
export class QueryEditorComponent {

  @Input() disabled = false;
  @Output() textChange = new EventEmitter<string>();
  @Output() onCtrlEnter = new EventEmitter<string>();

  queryVal : string = "";

  @Input()
  get text() : string {
    return this.queryVal;
  }

  set text(val : string) {
    this.queryVal = val;
    this.textChange.emit(this.queryVal);
  }

  ctrlEnterPressed() {
    this.onCtrlEnter.emit(this.text);
  }

}
