import { Component } from '@angular/core';
import { DsoModel } from 'src/app/models/dso-model';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { DataGridColumns } from 'src/app/models/data-grid-columns';
import { DsoPayloadModel } from 'src/app/models/dso-payload-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dso',
  templateUrl: './dso.component.html',
  styleUrls: ['./dso.component.css']
})
export class DsoComponent {
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

  constructor(private gremlinapiService:GremlinapiService, private ngxUiLoaderService:NgxUiLoaderService) {
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
      },
      (error) => {
        this.ngxUiLoaderService.stop();
        console.error('Error loading error log details:', error);
      }
    );
  }

  createDataGridColumns(): DataGridColumns[] {
    // Implement logic to create DataGridColumns based on your Dso structure
    // Example:
    return [
      { key: 'Name', displayText: 'Name' },
      { key: 'DsoId', displayText: 'Dso Id' },
      { key: 'Address', displayText: 'Address' },
      { key: 'City', displayText: 'City' },
      { key: 'State', displayText: 'State' },
      { key: 'PostalCode', displayText: 'Zip' },
      { key: 'Phone', displayText: 'Phone' },
      { key: 'Email', displayText: 'Email' }
      // Add more columns as needed
    ];
  }

  addDso() {
    this.gremlinapiService.addDso(this.dsoPayload).subscribe(
      (response: any) => {
        // Handle the success response if needed
        console.log('DSO added successfully:', response);
        // Optionally, reset the form after successful submission
        this.resetForm();
      },
      (error:any) => {
        // Handle the error response if needed
        console.error('Error adding DSO:', error);
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

  onDsoDataGridRowSelected(selectedItems: DsoModel[]): void {
    // Handle the selected rows as needed
    console.log('Selected dso  Details:', selectedItems);
  }
}
