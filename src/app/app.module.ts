import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
import { ButtonModule } from 'primeng/components/button/button';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { PasswordModule } from 'primeng/components/password/password';
import { TreeModule } from 'primeng/components/tree/tree';
import { GrowlModule } from 'primeng/components/growl/growl';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ContextMenuModule } from 'primeng/components/contextmenu/contextmenu';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ConfirmationService } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ConnectionFormComponent } from './connection-form/connection-form.component';

import { ConnectionService } from './connection.service';
import { UtilsService } from './utils.service';
import { NewConnectionFormComponent } from './new-connection-form/new-connection-form.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionFormComponent,
    NewConnectionFormComponent,
    QueryEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    TreeModule,
    GrowlModule,
    ConfirmDialogModule,
    ContextMenuModule,
    TooltipModule,
    InputTextareaModule,
    DataTableModule
  ],
  providers: [ ConnectionService, UtilsService, ConfirmationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
