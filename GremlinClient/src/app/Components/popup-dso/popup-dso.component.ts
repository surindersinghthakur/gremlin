import { Component } from '@angular/core';
import { DsoModel } from 'src/app/models/dso-model';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { DsoPayloadModel } from 'src/app/models/dso-payload-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-dso',
  templateUrl: './popup-dso.component.html',
  styleUrls: ['./popup-dso.component.css']
})
export class PopupDsoComponent {
  dsoData: DsoModel[] = [];
  dsoColumns: DataGridColumns[] = [];
  dsoPayload: DsoPayloadModel = {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    phoneNumber: '',
    email: '',
    website: ''
  };

  constructor(private gremlinapiService:GremlinapiService, private ngxUiLoaderService:NgxUiLoaderService,
    private snackBar: MatSnackBar,public dialogRef: MatDialogRef<PopupDsoComponent>) {
  }

  onSaveClick() {
    this.gremlinapiService.addDso(this.dsoPayload).subscribe(
      (response: any) => {
        // Handle the success response if needed
        console.log('DSO added successfully:', response);
        this.showSuccessMessage('DSO added successfully.'); // Display success message
        // Optionally, reset the form after successful submission
        this.resetForm();
      },
      (error: any) => {
        // Handle the error response if needed
        console.error('Error adding DSO:', error);
        this.showErrorMessage('Failed to add DSO. Please try again.'); // Display error message
      }
    );
  }



  resetForm(): void {
    // Reset the form fields as needed
    this.dsoPayload = {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      phoneNumber: '',
      email: '',
      website: ''
    };
  }

   // Function to display a success message using MatSnackBar
   private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration for which the message will be displayed in milliseconds
      horizontalPosition: 'center', // Positioning the message horizontally
      verticalPosition: 'top', // Positioning the message vertically
      panelClass: 'success-snackbar' // You can add a custom CSS class for styling
    });
  }
  
  // Function to display an error message using MatSnackBar
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration for which the message will be displayed in milliseconds
      horizontalPosition: 'center', // Positioning the message horizontally
      verticalPosition: 'top', // Positioning the message vertically
      panelClass: 'error-snackbar' // You can add a custom CSS class for styling
    });
  }

  onCloseClick(): void{
    this.dialogRef.close();
  }


}
