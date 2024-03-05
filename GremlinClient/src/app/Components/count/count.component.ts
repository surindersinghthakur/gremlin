import { Component, OnInit } from '@angular/core';
import { GremlinapiService } from 'src/app/services/gremlinapi.service';
import { Counts } from 'src/app/models/counts';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit  {
  apiResponse: Counts = {
    totalDsos: 0,
    totalPractices: 0,
    totalLocations: 0,
  };

  constructor(private gremlinapiService: GremlinapiService,private ngxUiLoaderService:NgxUiLoaderService, ) {}

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.gremlinapiService.getTotalCounts().subscribe((response) => {
      this.apiResponse = response;
      this.ngxUiLoaderService.stop();
    });
  }
}
