import { Component } from '@angular/core';
import { LocationAddPayload } from 'src/app/models/location-add-payload';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payload-location',
  templateUrl: './payload-location.component.html',
  styleUrls: ['./payload-location.component.css']
})
export class PayloadLocationComponent {
  locationForm!: FormGroup;
  locationPayload: LocationAddPayload = {
    practiceId:'',
    name: '',
    address1: '',
    city: '',
    state: '',
    zipcode:'',
    phoneNumber: '',
    reportsToRegion: '',
    longitude:0,
    latitude:0
  };

  constructor(private fb: FormBuilder, private dialogRef:MatDialog, private gremlinapiService:GremlinapiService){
    this.locationForm = this.fb.group({
      practiceId: [''],
      name: ['', Validators.required],
      address1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      phoneNumber: [''],
      reportsToRegion: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
    });
  }
  

  onAddLocation() {
    this.gremlinapiService.addLocation(this.locationPayload).subscribe(
      (response: any) => {
        // Handle the success response if needed
        console.log('Location added added successfully:', response);
        // Optionally, reset the form after successful submission
        this.resetForm();
      },
      (error:any) => {
        // Handle the error response if needed
        console.error('Error adding Location:', error);
      }
    );
  }

  resetForm(): void {
    // Reset the form fields as needed
    this.locationPayload = {
      practiceId:'',
      name: '',
      address1: '',
      city: '',
      state: '',
      zipcode:'',
      phoneNumber: '',
      reportsToRegion: '',
      longitude:0,
      latitude:0
    };
  }
}
