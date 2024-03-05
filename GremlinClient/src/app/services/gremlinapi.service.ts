import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map , catchError  } from 'rxjs/operators';
import { Counts } from '../models/counts';
import { DsoModel } from '../models/dso-model';
import { ApiResponseForDSO } from '../models/api-response-for-dso';
import { DsoPayloadModel } from '../models/dso-payload-model';
import { PracticeAddPayload } from '../models/practice-add-payload';
import { LocationAddPayload } from '../models/location-add-payload';
import { PracticeModel } from '../models/practice-model';
import { LocationModel } from '../models/location-model';

@Injectable({
  providedIn: 'root'
})
export class GremlinapiService {

  readonly baseApiUrl =  "https://localhost:7116";
  constructor(private http: HttpClient) { }

  //1st api call for counts
  getTotalCounts(): Observable<Counts> {
    return this.http.get<string>(this.baseApiUrl + '/counts', { responseType: 'text' as 'json' }).pipe(
      map((response: string) => this.parseApiResponse(response))
    );
  }
  
  //2nd api call for dso's
  getDsoData(): Observable<DsoModel[]> {
    return this.http.get<any>(this.baseApiUrl + '/dso').pipe(
      map((response: any) => this.parseDsoApiResponse(response))
    );
  }
  
  //3rd api calling for adding dso
  addDso(dsoPayload: DsoPayloadModel): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseApiUrl}/dso/add`, dsoPayload, { headers });
  }
  
  //4th api calling for practice
  searchByStateForPracticeData(state: string): Observable<PracticeModel[]> {
    const apiUrl = `${this.baseApiUrl}/practice/${state}/10`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => this.parsePracticeApiResponse(response))
    );
  }
  
  //5th api call for location data based on practice id
  searchPracticeIdForLocationData(practiceId: string[]): Observable<LocationModel[]> {
    const apiUrl = `${this.baseApiUrl}/location/${practiceId}`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => this.parseLocationApiResponse(response))
    );
  }

  //6th api calling for adding dso
  addPractice(practicePayload: PracticeAddPayload): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseApiUrl}/practice/add`, practicePayload, { headers });
  }

  //7th api calling for adding dso
  addLocation(locationPayload: LocationAddPayload): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseApiUrl}/location/add`, locationPayload, { headers });
  }

  private parseApiResponse(response: string): Counts {
    // Split the response string and extract the numeric values
    const values = response.match(/\d+/g);
  
    // Check if values is not null and has the expected length
    if (values !== null && values.length === 3) {
      // Destructure the values array for better readability
      const [totalDsos, totalPractices, totalLocations] = values.map(Number);
  
      // Create a Counts object with the extracted values
      return {
        totalDsos,
        totalPractices,
        totalLocations
      };
    } else {
      // Handle the case where the values are not as expected
      console.error('Invalid response format:', response);
      // Return a default Counts object or throw an error based on your requirements
      return { totalDsos: 0, totalPractices: 0, totalLocations: 0 };
    }
  }

  private parseDsoApiResponse(response: any): DsoModel[] {
    try {
      // Check if the response is an object with a 'data' property
      if (response && response.data) {
        // Attempt to parse the 'data' property into an array of DsoModel objects
        const dataArray: DsoModel[] = JSON.parse(response.data);
        return dataArray;
      } else {
        console.error('Unexpected API response structure:', response);
        return []; // Return an empty array or handle the error as needed
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return []; // Return an empty array or handle the error as needed
    }
  }

  private parseLocationApiResponse(response: any): LocationModel[] {
    try {
      if (response && response.data) {
        let dataArray: any[];
  
        // Check if the data is a string representation of an empty array
        if (typeof response.data === 'string' && response.data.trim() === '[]') {
          dataArray = [];
        } else {
          // Parse the data as JSON
          dataArray = JSON.parse(response.data);
        }
  
        if (Array.isArray(dataArray)) {
          return dataArray.map((item: any) => {
            const practiceModel: LocationModel = {
              tenantId: item?.TenantId?.[0] || '',
              locationId: item?.locationId?.[0] || '',
              practiceId: item?.PracticeId?.[0] || '',
              name: item?.Name?.[0] || '',
              address: item?.Address?.[0] || '',
              city: item?.City?.[0] || '',
              state: item?.State?.[0] || '',
              postalCode: item?.PostalCode?.[0] || '',
              longitude: item?.Longitude?.[0] || '',
              latitude: item?.Latitude?.[0] || '',
              reportsToRegion: item?.ReportsToRegion?.[0] || '',
              // Map other properties similarly
            };
  
            return practiceModel;
          });
        } else {
          console.error('Unexpected API response data structure:', response.data);
          return [];
        }
      } else {
        console.error('Unexpected API response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return [];
    }
  }

  private parsePracticeApiResponse(response: any): PracticeModel[] {
  try {
    if (response && response.data) {
      let dataArray: any[];

      // Check if the data is a string representation of an empty array
      if (typeof response.data === 'string' && response.data.trim() === '[]') {
        dataArray = [];
      } else {
        // Parse the data as JSON
        dataArray = JSON.parse(response.data);
      }

      if (Array.isArray(dataArray)) {
        return dataArray.map((item: any) => {
          const practiceModel: PracticeModel = {
            tenantId: item?.TenantId?.[0] || '',
            practiceId: item?.PracticeId?.[0] || '',
            dsoId: item?.DsoId?.[0] || '',
            name: item?.Name?.[0] || '',
            address: item?.Address?.[0] || '',
            city: item?.City?.[0] || '',
            state: item?.State?.[0] || '',
            postalCode: item?.PostalCode?.[0] || '',
            longitude: item?.Longitude?.[0] || '',
            latitude: item?.Latitude?.[0] || '',
            zone: item?.Zone?.[0] || ''
            // Map other properties similarly
          };

          return practiceModel;
        });
      } else {
        console.error('Unexpected API response data structure:', response.data);
        return [];
      }
    } else {
      console.error('Unexpected API response structure:', response);
      return [];
    }
  } catch (error) {
    console.error('Error parsing API response:', error);
    return [];
  }

  } 
}





