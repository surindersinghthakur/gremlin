import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PracticeAddPayload } from 'src/app/models/practice-add-payload';
import { MatDialog } from '@angular/material/dialog';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';

@Component({
  selector: 'app-payload-practice',
  templateUrl: './payload-practice.component.html',
  styleUrls: ['./payload-practice.component.css']
})
export class PayloadComponent {
  //related to form for payload
  practiceForm!: FormGroup;
  practicePayload: PracticeAddPayload = {
    dsoId:'',
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode:'',
    phoneNumber: '',
    zone: '',
    longitude:0,
    latitude:0
  };

  constructor(private fb: FormBuilder,private dialogRef:MatDialog, private gremlinapiService:GremlinapiService) {
    //related to form for payload
    this.practiceForm = this.fb.group({
      dsoId: [''],
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      phoneNumber: [''],
      zone: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
    });
  }
  
  //related to form for payload
  onAddPractice() {
    this.gremlinapiService.addPractice(this.practicePayload).subscribe(
      (response: any) => {
        // Handle the success response if needed
        console.log('Practice added successfully:', response);
        // Optionally, reset the form after successful submission
        this.resetForm();
      },
      (error:any) => {
        // Handle the error response if needed
        console.error('Error adding Practice:', error);
      }
    );
  }

  resetForm(): void {
    // Reset the form fields as needed
    this.practicePayload = {
      dsoId:'',
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode:'',
      phoneNumber: '',
      zone: '',
      longitude:0,
      latitude:0
    };
  }

}
