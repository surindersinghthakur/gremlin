import { Component,Input, ElementRef, ViewContainerRef,Inject } from '@angular/core';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { PracticeModel } from 'src/app/models/practice-model';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { LocationModel } from 'src/app/models/location-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DsoModel } from 'src/app/models/dso-model';
import { MovePracticeToNewDso } from 'src/app/models/move-practice-to-new-dso';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-popup-location',
  templateUrl: './popup-location.component.html',
  styleUrls: ['./popup-location.component.css']
})
export class PopupLocationComponent {
  searchState: string = '';
  searchName: string = '';
  practiceData: PracticeModel[] = [];
  practiceColumns: DataGridColumns[] = [];
  locationData: LocationModel[] = [];
  locationColumns: DataGridColumns[] = [];
  selectedPracticeRow!: PracticeModel;
  selectedLocationRow!: LocationModel;
  locationDataActual: LocationModel[] = [];
  @Input() showCheckboxColumn: boolean = true;
  showModal: boolean = false;

  selectedCheckboxRows: PracticeModel[] = [];
  selectedLocationCheckboxRows: LocationModel[] = [];
  namesListDso: string[] = [];
  namesListPractice: string[] = [];
  selectedNameDso: string = '';
  selectedNamePractice: string = '';
  dsoData: DsoModel[] = [];
  practiceDataForLocationMove: PracticeModel[] = [];
  practiceIdsAndDsoIds: MovePracticeToNewDso[] = [];
  buttonDisabled: boolean = true;
  currentPracticeId: string;
  locationIdsArray: string[];

  // Pagination properties
  currentPaginationPage: number = 1;
  itemsPerPage: number = 50; // Set your desired number of items per page
  totalItems: number = 0;
  

  constructor(private gremlinapiService: GremlinapiService, private ngxUiLoaderService: NgxUiLoaderService, private dialog: MatDialog, private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<PopupLocationComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {

      this.currentPracticeId = data.firstRowPracticeId;
      this.locationIdsArray = data.locationIdsArray;

     this.onPracticeRowSelectionformoveingLocations()
  }

  ngOnInit(): void {
    this.fetchDsoNamesForMovingPractice()
  }

  fetchDataForPracticeGrids(): void {
    this.ngxUiLoaderService.start();

      // Check for leading or trailing whitespaces
      const selectedDso = this.dsoData.find((dso: any) => {
        // Check if the selectedName is included in the array of names
        return dso.Name.includes(this.selectedNameDso.trim());
      });
    
      const dsoId: string = selectedDso
      ? (Array.isArray(selectedDso.DsoId) ? selectedDso.DsoId[0] : selectedDso.DsoId) || ''
      : '';
      if (this.selectedNameDso) {

      this.gremlinapiService.searchPracticeDataByDsoName(dsoId,this.currentPaginationPage, this.itemsPerPage).subscribe(
        (result: { data: PracticeModel[], totalRecords: string }) => {
          this.ngxUiLoaderService.stop();
          this.practiceData = result.data;
          this.practiceColumns = this.createDataGridColumnsForPractice();
          this.totalItems = parseInt(result.totalRecords, 10);
          this.currentPaginationPage = 1;
          //this.showSuccessMessage('Practice data fetched successfully.'); 
        },
        (error) => {
          this.ngxUiLoaderService.stop();
          //this.showErrorMessage('Error loading practice data');
        }
      );
      // Handle dsoId as needed, keeping in mind that selectedDso might be undefined
    }else{
      this.gremlinapiService.searchPracticeDataByStateByStateOrName(this.searchState, this.searchName, dsoId,this.currentPaginationPage,this.itemsPerPage).subscribe(
        (result: { data: PracticeModel[], totalRecords: string }) => {
          this.ngxUiLoaderService.stop();
          this.practiceData = result.data;
          this.practiceColumns = this.createDataGridColumnsForPractice();
          this.totalItems = parseInt(result.totalRecords, 10);
          //this.showSuccessMessage('Practice data fetched successfully.'); 
        },
        (error) => {
          this.ngxUiLoaderService.stop();
          //this.showErrorMessage('Error loading practice data');
        }
      );
    }
    
  }

  createDataGridColumnsForPractice(): DataGridColumns[] {
    return [
      { key: 'name', displayText: 'Name' },
      //{ key: 'practiceId', displayText: 'Dso Id' },
      { key: 'address', displayText: 'Address' },
      { key: 'city', displayText: 'City' },
      { key: 'state', displayText: 'State' },
      { key: 'postalCode', displayText: 'Zip' },
      { key: 'longitude', displayText: 'Longitude' },
      { key: 'latitude', displayText: 'Latitude' },
      { key: 'zone', displayText: 'Zone' },
    ];
  }

  //practice checkbox and move logic
  onCheckboxSelected(checked: boolean, row: PracticeModel): void {
    if (checked) {
      // Checkbox is checked, add to the selectedCheckboxRows array
      this.selectedCheckboxRows.push(row);
    } else {
      // Checkbox is unchecked, remove from the selectedCheckboxRows array
      const index = this.selectedCheckboxRows.findIndex(selectedRow => selectedRow === row);
      if (index !== -1) {
        this.selectedCheckboxRows.splice(index, 1);
      }
    }
    // Update the buttonDisabled property based on the selectedCheckboxRows array
    this.buttonDisabled = this.selectedCheckboxRows.length === 0;
  }

  onPracticeDataGridRowSelected(selectedItems: PracticeModel[]): void {
    this.selectedCheckboxRows = selectedItems;
    this.fetchDsoNamesForMovingPractice(); // Fetch names when checkboxes are selected
  }

  fetchDsoNamesForMovingPractice(): void {
    this.gremlinapiService.getDsoNameForDropdown().subscribe(
      (response: any) => {
        if (response.success) {
          const data = JSON.parse(response.data);
          if (Array.isArray(data)) {
            // Update the dsoData array
            this.dsoData = data;
            // Use map and concat to flatten the resulting array
            const flattenedArray: string[] = ([] as string[]).concat(...data.map((dso: any) => dso.Name));
            this.namesListDso = Array.from(new Set(flattenedArray));
          } else {
            console.error('Unexpected data structure:', data);
          }
        } else {
          console.error('Error in API response:', response);
        }
      },
      (error) => {
        console.error('Error fetching DSO names for dropdown:', error);
      }
    );
  }

  onPracticeRowSelectionformoveingLocations(): void {
    if (this.selectedCheckboxRows.length > 0) {
      const moveToPracticeId = Array.isArray(this.selectedCheckboxRows[0].practiceId)
        ? this.selectedCheckboxRows[0].practiceId[0]
        : String(this.selectedCheckboxRows[0].practiceId);

      this.ngxUiLoaderService.start();  
      this.gremlinapiService.moveLocationsToPractice(this.currentPracticeId, moveToPracticeId, this.locationIdsArray).subscribe(
        (response: any) => {
          // Handle the API response here
          console.log('API response:', response);
          this.showSnackBar('Locations moved successfully'); // Show success message
          // Optionally, perform any additional actions based on the response
          this.dialogRef.close();
          this.ngxUiLoaderService.stop();
        },
        (error: any) => {
          // Handle errors from the API call
          console.error('API error:', error);
          this.showSnackBar('Failed to move locations. Please try again.'); // Show error message
          this.dialogRef.close();
          this.ngxUiLoaderService.stop();
          // Optionally, perform any actions based on the error
        }
      );
    }
  }
  
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Adjust the duration as needed
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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

onPageChange(newPage: number): void {
  // Handle page change event
  this.currentPaginationPage = newPage;
  // Optionally, fetch data based on the new page
  // Example: this.loadData();
}
  
  
}
