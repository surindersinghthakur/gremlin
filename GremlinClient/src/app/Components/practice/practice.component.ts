import { Component, ElementRef, ViewContainerRef} from '@angular/core';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { PracticeModel } from 'src/app/models/practice-model';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { LocationModel } from 'src/app/models/location-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PayloadComponent } from '../payload-practice/payload-practice.component';
import { PayloadLocationComponent } from '../payload-location/payload-location.component';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent {
  searchState: string = '';
  practiceData: PracticeModel[] = [];
  practiceColumns: DataGridColumns[] = [];
  locationData: LocationModel[] = [];
  locationColumns: DataGridColumns[] = [];
  selectedPracticeRow!: PracticeModel;
  locationDataActual: LocationModel[] = [];
  showModal: boolean = false;
  private dialogRef: MatDialogRef<PayloadComponent> | undefined;
  private dialogRef1:MatDialogRef<PayloadLocationComponent> | undefined;
  

  constructor(private gremlinapiService: GremlinapiService, private ngxUiLoaderService: NgxUiLoaderService, private dialog: MatDialog, private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,) {
  }

  ngOnInit(): void {
  }

  fetchDataForGrids(): void {
    this.ngxUiLoaderService.start();
    this.gremlinapiService.searchByStateForPracticeData(this.searchState).subscribe(
      (data: PracticeModel[]) => {
        this.ngxUiLoaderService.stop();
        this.practiceData = data;
        this.practiceColumns = this.createDataGridColumnsForPractice();
      },
      (error) => {
        this.ngxUiLoaderService.stop();
        console.error('Error loading practice data:', error);
      }
    );
  }

  createDataGridColumnsForPractice(): DataGridColumns[] {
    return [
      { key: 'name', displayText: 'Name' },
      { key: 'dsoId', displayText: 'Dso Id' },
      { key: 'address', displayText: 'Address' },
      { key: 'city', displayText: 'City' },
      { key: 'state', displayText: 'State' },
      { key: 'postalCode', displayText: 'Zip' },
      { key: 'longitude', displayText: 'Longitude' },
      { key: 'latitude', displayText: 'Latitude' },
      { key: 'zone', displayText: 'Zone' },
    ];
  }

  createDataGridColumnsForLocation(): DataGridColumns[] {
    return [
      { key: 'name', displayText: 'Name' },
      { key: 'address', displayText: 'Address' },
      { key: 'city', displayText: 'City' },
      { key: 'state', displayText: 'State' },
      { key: 'postalCode', displayText: 'Zip' },
      { key: 'reportsToRegion', displayText: 'Reporting Zone' },
      { key: 'longitude', displayText: 'Longitude' },
      { key: 'latitude', displayText: 'Latitude' },
    ];
  }

  onPracticeDataGridRowSelected(selectedItems: PracticeModel[]): void {
    // Handle the selected rows as needed
    console.log('Selected dso  Details:', selectedItems);
  }

  onPracticeRowSelected(row: any) {
    this.selectedPracticeRow = (row as PracticeModel);
    this.fetchLocationData(this.selectedPracticeRow);
  }

  fetchLocationData(selectedRow: PracticeModel) {
    this.ngxUiLoaderService.start();
    this.locationData = this.locationDataActual.filter(cond => cond.practiceId === selectedRow.practiceId);
    this.gremlinapiService.searchPracticeIdForLocationData(selectedRow.practiceId).subscribe(
      (data: LocationModel[]) => {
        this.ngxUiLoaderService.stop();
        this.locationData = data;
        this.locationColumns = this.createDataGridColumnsForLocation();
      },
      (error) => {
        this.ngxUiLoaderService.stop();
        console.error('Error loading location data:', error);
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
        console.log('Dialog closed with result:', result);
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
        console.log('Dialog closed with result:', result);
        this.dialogRef1 = undefined; // Reset the dialogRef when the dialog is closed
        // You can perform any additional actions here if needed
      });
    }
  }
  
}
