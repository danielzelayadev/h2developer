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

import { AppComponent } from './app.component';
import { NewConnectionFormComponent } from './new-connection-form/new-connection-form.component';

import { ConnectionService } from './connection.service';
import { UtilsService } from './utils.service';

@NgModule({
  declarations: [
    AppComponent,
    NewConnectionFormComponent
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
    GrowlModule
  ],
  providers: [ ConnectionService, UtilsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
