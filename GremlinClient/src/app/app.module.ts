import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkConnectedOverlay} from '@angular/cdk/overlay';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { CountComponent } from './Components/count/count.component';
import { DsoComponent } from './Components/dso/dso.component';
import { PracticeComponent } from './Components/practice/practice.component';
import { SharedDatagridComponent } from './Components/shared-datagrid/shared-datagrid.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayloadComponent } from './Components/payload-practice/payload-practice.component';
import { PayloadLocationComponent } from './Components/payload-location/payload-location.component';
import { PopupLocationComponent } from './Components/popup-location/popup-location.component';
import { PopupDsoComponent } from './Components/popup-dso/popup-dso.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CountComponent,
    DsoComponent,
    PracticeComponent,
    SharedDatagridComponent,
    PayloadComponent,
    PayloadLocationComponent,
    PopupLocationComponent,
    PopupDsoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CdkConnectedOverlay,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
