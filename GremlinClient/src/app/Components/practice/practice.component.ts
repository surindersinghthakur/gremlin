import { Component, ElementRef, ViewContainerRef,Input,Output,EventEmitter} from '@angular/core';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { PracticeModel } from 'src/app/models/practice-model';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { LocationModel } from 'src/app/models/location-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PayloadComponent } from '../payload-practice/payload-practice.component';
import { PayloadLocationComponent } from '../payload-location/payload-location.component';
import { DsoModel } from 'src/app/models/dso-model';
import { MovePracticeToNewDso } from 'src/app/models/move-practice-to-new-dso';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupLocationComponent } from '../popup-location/popup-location.component';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent {
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
  private dialogRef: MatDialogRef<PayloadComponent> | undefined;
  private dialogRef1:MatDialogRef<PayloadLocationComponent> | undefined;

  selectedCheckboxRows: PracticeModel[] = [];
  selectedLocationCheckboxRows: LocationModel[] = [];
  namesListDso: string[] = [];
  namesListPractice: string[] = [];
  selectedNameDso: string = '';
  selectedNamePractice: string = '';
  dsoData: DsoModel[] = [];
  practiceDataForLocationMove: PracticeModel[] = [];
  practiceIdsAndDsoIds: MovePracticeToNewDso[] = [];

  //for pagination
  //1st practice grid
  @Input() currentPaginationPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() practiceTotalItems: number = 0;
  
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  // for location grid
  @Input() currentLocationPaginationPage: number = 1;
  @Input() locationTotalItems: number = 0;



  displayedData: any[] = [];

  //for zone dropdown
  selectedZone: string = ''; // Initialize with an empty string or default value
  zonesList: string[] = ['North', 'South', 'East', 'West']; // Your list of zones
  
  

  constructor(private gremlinapiService: GremlinapiService, private ngxUiLoaderService: NgxUiLoaderService, private dialog: MatDialog, private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,private snackBar: MatSnackBar ) {
  }

  ngOnInit(): void {
    this.fetchDsoNamesForMovingPractice()
  }

  fetchDataForPracticeGrids(currentPaginationPage: number): void {
    this.ngxUiLoaderService.start();

      // Check for leading or trailing whitespaces
      const selectedDso = this.dsoData.find((dso: any) => {
        // Check if the selectedName is included in the array of names
        return dso.Name.includes(this.selectedNameDso.trim());
      });

      this.currentPaginationPage = currentPaginationPage;
    
      const dsoId: string = selectedDso
      ? (Array.isArray(selectedDso.DsoId) ? selectedDso.DsoId[0] : selectedDso.DsoId) || ''
      : '';

      if (this.selectedNameDso) {
      this.selectedCheckboxRows = [];
      this.currentPaginationPage = 1;
      this.gremlinapiService.searchPracticeDataByDsoName(dsoId,this.currentPaginationPage, this.itemsPerPage).subscribe(
        (result: { data: PracticeModel[], totalRecords: string }) => {
          this.ngxUiLoaderService.stop();
          this.practiceData = result.data;
          this.practiceColumns = this.createDataGridColumnsForPractice();
          this.practiceTotalItems = parseInt(result.totalRecords, 10);
          //this.showSuccessMessage('Practice data fetched successfully.'); 
        },
        (error) => {
          this.ngxUiLoaderService.stop();
          //this.showErrorMessage('Error loading practice data');
        }
      );
      // Handle dsoId as needed, keeping in mind that selectedDso might be undefined
    }
    else if(this.selectedZone){
      this.gremlinapiService.searchPracticeDataByStateByStateOrNameOrZone(this.searchState, this.searchName, this.selectedZone, dsoId,this.currentPaginationPage,this.itemsPerPage).subscribe(
        (result: { data: PracticeModel[], totalRecords: string }) => {
          this.ngxUiLoaderService.stop();
          this.practiceData = result.data;
          this.practiceColumns = this.createDataGridColumnsForPractice();
          this.practiceTotalItems = parseInt(result.totalRecords, 10);
          //this.showSuccessMessage('Practice data fetched successfully.'); 
        },
        (error) => {
          this.ngxUiLoaderService.stop();
          //this.showErrorMessage('Error loading practice data');
        }
      );
    }
    else{
      this.gremlinapiService.searchPracticeDataByStateByStateOrNameOrZone(this.searchState, this.searchName, this.selectedZone, dsoId,this.currentPaginationPage,this.itemsPerPage).subscribe(
        (result: { data: PracticeModel[], totalRecords: string }) => {
          this.ngxUiLoaderService.stop();
          this.practiceData = result.data;
          this.practiceColumns = this.createDataGridColumnsForPractice();
          this.practiceTotalItems = parseInt(result.totalRecords, 10);
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
      //{ key: 'dsoId', displayText: 'Dso Id' },
      { key: 'address', displayText: 'Address' },
      { key: 'city', displayText: 'City' },
      { key: 'state', displayText: 'State' },
      //{ key: 'postalCode', displayText: 'Zip' },
      { key: 'latitude', displayText: 'Latitude' },
      { key: 'longitude', displayText: 'Longitude' },
      { key: 'zone', displayText: 'Zone' },
    ];
  }

  createDataGridColumnsForLocation(): DataGridColumns[] {
    return [
      { key: 'name', displayText: 'Name' },
      //{ key: 'locationId', displayText: 'Location' },
      { key: 'address', displayText: 'Address' },
      { key: 'city', displayText: 'City' },
      { key: 'state', displayText: 'State' },
      //{ key: 'postalCode', displayText: 'Zip' },
      //{ key: 'reportsToRegion', displayText: 'Reporting Zone' },
      { key: 'latitude', displayText: 'Latitude' },
      { key: 'longitude', displayText: 'Longitude' },
      
    ];
  }

  onPracticeRowSelected(row: any) {
    this.selectedPracticeRow = (row as PracticeModel);
    this.fetchLocationData(this.selectedPracticeRow);
  }

  fetchLocationData(selectedRow: PracticeModel) {
    this.ngxUiLoaderService.start();
    this.locationData = this.locationDataActual.filter(cond => cond.practiceId === selectedRow.practiceId);
    this.gremlinapiService.searchPracticeIdForLocationData(selectedRow.practiceId).subscribe(
      (result: { data: LocationModel[], totalRecords: string }) => {
        this.ngxUiLoaderService.stop();
        this.locationData = result.data;
        this.locationColumns = this.createDataGridColumnsForLocation();
        this.locationTotalItems = parseInt(result.totalRecords, 10);
        //this.showSuccessMessage('Location data fetched successfully.'); 
      },
      (error) => {
        this.ngxUiLoaderService.stop();
        //this.showErrorMessage('Error loading location data:');
      }
    );
  }
  
  //related topractice add payload pop-up
  openPracticePayloadFormDialog() {
    if (this.dialogRef) {
      // If dialog is already open, close it
      this.dialogRef.close();
      this.dialogRef = undefined; // Reset the dialogRef
    } else {
      // If dialog is not open, open it
      this.dialogRef = this.dialog.open(PayloadComponent, {
        width: '80%',
        disableClose: true,
      });
  
      // Subscribe to the afterClosed event to handle any data returned from the dialog
      this.dialogRef.afterClosed().subscribe(result => {
        //console.log('Dialog closed with result:', result);
        this.dialogRef = undefined; // Reset the dialogRef when the dialog is closed
        // You can perform any additional actions here if needed
      });
    }
  }
  
  openLocationPayloadFormDialog() {
    if (this.dialogRef1) {
      // If dialog is already open, close it
      this.dialogRef1.close();
      this.dialogRef1 = undefined; // Reset the dialogRef
    } else {
      // If dialog is not open, open it
      this.dialogRef1 = this.dialog.open(PayloadLocationComponent, {
        width: '80%',
        disableClose: true,
      });
  
      // Subscribe to the afterClosed event to handle any data returned from the dialog
      this.dialogRef1.afterClosed().subscribe(result => {
        //console.log('Dialog closed with result:', result);
        this.dialogRef1 = undefined; // Reset the dialogRef when the dialog is closed
        // You can perform any additional actions here if needed
      });
    }
  }

  //practice checkbox and move logic
  onPracticeCheckboxSelected(checked: boolean, row: PracticeModel): void {
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

    // Fetch names when checkboxes are selected
    this.fetchDsoNamesForMovingPractice();
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
            //this.showSuccessMessage('Dso Names fetched successfully.');
          } else {
            this.showErrorMessage('Unexpected data structure:');
          }
        } else {
         // this.showErrorMessage('Error in API response:');
        }
      },
      (error) => {
        //this.showErrorMessage('Error fetching DSO names for dropdown:');
      }
    );
  }
  
  
  onDsoNameSelected(): void {
    if (this.selectedNameDso && this.selectedCheckboxRows.length > 0) {
      // Check for leading or trailing whitespaces
      const selectedDso = this.dsoData.find((dso: any) => {
        // Check if the selectedName is included in the array of names
        return dso.Name.includes(this.selectedNameDso.trim());
      });
  
      if (selectedDso) {
        const dsoId: string = Array.isArray(selectedDso.DsoId) ? selectedDso.DsoId[0] : selectedDso.DsoId;

  
        // Extract PracticeIds from the selectedCheckboxRows
        const practiceIdsAndDsoIds = this.selectedCheckboxRows.map(practice => ({
          practiceId: Array.isArray(practice.practiceId)
            ? practice.practiceId[0] // If it's an array, use the first element
            : practice.practiceId, // If it's a string, use it as is
          dsoId: Array.isArray(practice.dsoId)
            ? practice.dsoId[0]
            : practice.dsoId
        }));

        this.ngxUiLoaderService.start();
        // Make API call using DsoId and PracticeIds
        this.gremlinapiService.movePracticesToNewDso(dsoId, practiceIdsAndDsoIds).subscribe(
          (response: any) => {
            // Handle the response as needed
            this.showSuccessMessage('Practice moved to new Dso successfully.');
            // Reset the selectedCheckboxRows after successful API call
            this.ngxUiLoaderService.stop();
          },
          (error) => {
            this.showErrorMessage('Error making API call:');
            this.ngxUiLoaderService.stop();
          }
        );
      } else {
        this.showErrorMessage('Selected Dso not found.');
      }
    }
    else{
      this.showErrorMessage('Please select a Dso name');
    }
  }

  //location checkbox selection and move logic
  onLocationCheckboxSelected(checked: boolean, row: LocationModel): void {
    if (checked) {
      // Checkbox is checked, add to the selectedCheckboxRows array
      this.selectedLocationCheckboxRows.push(row);
    } else {
      // Checkbox is unchecked, remove from the selectedCheckboxRows array
      const index = this.selectedLocationCheckboxRows.findIndex(selectedRow => selectedRow === row);
      if (index !== -1) {
        this.selectedLocationCheckboxRows.splice(index, 1);
      }
    }
  }
  

  /*fetchPracticeNamesForMovingLocation(state : string): void {
    this.gremlinapiService.getPracticeNameForDropdown(state).subscribe(
      (response: any) => {
        if (response.success) {
          const data = JSON.parse(response.data);
          if (Array.isArray(data)) {
            // Update the dsoData array
            this.practiceDataForLocationMove = data;
            // Use map and concat to flatten the resulting array
            const flattenedArray: string[] = ([] as string[]).concat(...data.map((practice: any) => practice.Name));
            this.namesListPractice = Array.from(new Set(flattenedArray));
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
  }*/

  /*onPracticeNameSelected(): void {
    if (this.selectedNamePractice && this.selectedCheckboxRows.length > 0) {
      // Check for leading or trailing whitespaces
      const selectedDso = this.dsoData.find((dso: any) => {
        // Check if the selectedName is included in the array of names
        return dso.Name.includes(this.selectedNamePractice.trim());
      });
  
      if (selectedDso) {
        const dsoId: string = Array.isArray(selectedDso.DsoId) ? selectedDso.DsoId[0] : selectedDso.DsoId;

  
        // Extract PracticeIds from the selectedCheckboxRows
        const practiceIdsAndDsoIds = this.selectedCheckboxRows.map(practice => ({
          practiceId: Array.isArray(practice.practiceId)
            ? practice.practiceId[0] // If it's an array, use the first element
            : practice.practiceId, // If it's a string, use it as is
          dsoId: Array.isArray(practice.dsoId)
            ? practice.dsoId[0]
            : practice.dsoId
        }));

  
        // Make API call using DsoId and PracticeIds
        this.gremlinapiService.movePracticesToNewDso(dsoId, practiceIdsAndDsoIds).subscribe(
          (response: any) => {
            // Handle the response as needed
            console.log('API call response:', response);
          },
          (error) => {
            console.error('Error making API call:', error);
          }
        );
      } else {
        console.error('Selected Dso not found.');
      }
    }
  }*/
  

  onLocationsSelected(): void {
    if (this.selectedLocationCheckboxRows.length > 0) {
      // Extract Practice ID for the first row
      const firstRowPracticeId = this.selectedLocationCheckboxRows[0].practiceId;
  
      // Extract Location IDs for all rows in an array
      const locationIdsArray = this.selectedLocationCheckboxRows.map(row => row.locationId);
  
      // Log the extracted data for verification (you can remove this in the final code)
      //console.log('First Row Practice ID:', firstRowPracticeId);
      //console.log('Location IDs Array:', locationIdsArray);
  
      // Open the LocationPopupComponent as a pop-up with the extracted data
      const dialogRef = this.dialog.open(PopupLocationComponent, {
        width: '1100px', // Set the width as needed
        data: {
          firstRowPracticeId: firstRowPracticeId,
          locationIdsArray: locationIdsArray
        }
      });
  
      // Subscribe to the afterClosed event to handle actions after the pop-up is closed
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The LocationPop-up was closed', result);
        // Perform actions based on the result if needed
      });
    }
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

changePages(): void {
 
}
}
