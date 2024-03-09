import { Component } from '@angular/core';
import { DsoModel } from 'src/app/models/dso-model';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupDsoComponent } from '../popup-dso/popup-dso.component';

@Component({
  selector: 'app-dso',
  templateUrl: './dso.component.html',
  styleUrls: ['./dso.component.css']
})
export class DsoComponent {
  dsoData: DsoModel[] = [];
  dsoColumns: DataGridColumns[] = [];

  constructor(private gremlinapiService:GremlinapiService, private ngxUiLoaderService:NgxUiLoaderService,
    private snackBar: MatSnackBar,private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadDsoDataGrid();
  }

  loadDsoDataGrid(): void {
    this.ngxUiLoaderService.start();
    this.gremlinapiService.getDsoData().subscribe(
      (data: DsoModel[]) => {
        this.ngxUiLoaderService.stop();
        this.dsoData = data;
        // Populate errorLogDetailsColumns based on your requirements
        this.dsoColumns = this.createDataGridColumns(); // Adjust this function accordingly
        //this.showSuccessMessage('Data loaded successfully.'); // Display success message
      },
      (error) => {
        this.ngxUiLoaderService.stop();
        console.error('Error loading error log details:', error);
        //this.showErrorMessage('Failed to load data. Please try again.'); // Display error message
      }
    );
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

  createDataGridColumns(): DataGridColumns[] {
    // Implement logic to create DataGridColumns based on your Dso structure
    // Example:
    return [
      { key: 'Name', displayText: 'Name' },
     // { key: 'DsoId', displayText: 'Dso Id' },
      { key: 'Address', displayText: 'Address' },
      { key: 'City', displayText: 'City' },
      { key: 'State', displayText: 'State' },
      { key: 'PostalCode', displayText: 'Zip' },
      { key: 'Phone', displayText: 'Phone' },
      { key: 'Email', displayText: 'Email' }
      // Add more columns as needed
    ];
  }

  onDsoDataGridRowSelected(selectedItems: DsoModel[]): void {
    // Handle the selected rows as needed
    console.log('Selected dso  Details:', selectedItems);
  }

  openAddDsoClick() {
    const dialogRef = this.dialog.open(PopupDsoComponent, {
      width: '1000px', // Set the width as per your requirement
      // You can add more configuration options as needed
    });
  
    // Optionally, subscribe to the afterClosed event to perform actions when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }
}
