import { Component, OnInit } from '@angular/core';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { Counts } from 'src/app/models/counts';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit  {
  apiResponse: Counts = {
    totalDsos: '0',
    totalPractices: '0',
    totalLocations: '0',
  };

  constructor(private gremlinapiService: GremlinapiService,private ngxUiLoaderService:NgxUiLoaderService,
    private snackBar: MatSnackBar ) {}

    ngOnInit(): void {
      this.ngxUiLoaderService.start();
      this.gremlinapiService.getTotalCounts().subscribe(
        (response) => {
          this.apiResponse = response;
          this.ngxUiLoaderService.stop();
          //this.showSuccessMessage('Total counts loaded successfully.'); // Display success message
        },
        (error) => {
          this.ngxUiLoaderService.stop();
          console.error('Error loading total counts:', error);
          //this.showErrorMessage('Failed to load total counts. Please try again.'); // Display error message
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
}

