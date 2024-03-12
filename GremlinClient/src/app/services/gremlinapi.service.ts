import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders,HttpParams  } from '@angular/common/http';
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
import { MovePracticeToNewDso } from '../models/move-practice-to-new-dso';

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
  searchPracticeDataByStateByStateOrName(state: string, name: string, dsoId: string, pageNo: number, pageSize: number): Observable<{ data: PracticeModel[], totalRecords: string }> {
    const apiUrl = `${this.baseApiUrl}/practice`;
  
    // Constructing the query parameters using the correct syntax
    const urlWithParams = `${apiUrl}?state=${state}&name=${name}&dsoId=${dsoId}&pageNo=${pageNo}&pazeSize=${pageSize}`;
  
    const output = this.http.get<any>(urlWithParams).pipe(
      map((response: any) => this.parsePracticeApiResponse(response))
    );
    return output;
  }
  
  //5th get practice data by dsoname
  searchPracticeDataByDsoName(dsoId: string, pageNo: number, pageSize: number): Observable<{ data: PracticeModel[], totalRecords: string }> {
    const apiUrl = `${this.baseApiUrl}/practice/dso/${dsoId}/?pageNo=${pageNo}&pazeSize=${pageSize}`;
    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => this.parsePracticeDataByDsoName(response))
    );
  }
  
  
  //6th api call for location data based on practice id 
  searchPracticeIdForLocationData(practiceId: string): Observable<{ data: LocationModel[], totalRecords: string }> {
    const apiUrl = `${this.baseApiUrl}/location/${practiceId}`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => this.parseLocationApiResponse(response))
    );
  }
  

  //7th api calling for adding dso
  addPractice(practicePayload: PracticeAddPayload): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseApiUrl}/practice/add`, practicePayload, { headers });
  }

  //8th api calling for adding dso
  addLocation(locationPayload: LocationAddPayload): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseApiUrl}/location/add`, locationPayload, { headers });
  }
  
  //9th api calling for dso names for the dropdown of practice
  getDsoNameForDropdown(): Observable<DsoModel[]> {
    return this.http.get<DsoModel[]>(this.baseApiUrl + '/dso');
  }
  
  //10th api calling for moving practice to new dso
  movePracticesToNewDso(dsoid: string, payload: MovePracticeToNewDso[]): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/dso/practice/move`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Make the HTTP request with moveToDsoId as a query parameter
    return this.http.post<any>(`${apiUrl}?moveToDsoId=${dsoid}`, payload, { headers });
  }

  //11th api calling for moving locations to new practice
  getPracticeNameForDropdown(state: string): Observable<PracticeModel[]> {
    return this.http.get<PracticeModel[]>(`${this.baseApiUrl}/practice/${state}/100`);
  }

  //12th api calling for moving practice to new dso
  moveLocationsToPractice(currentPracticeId: string,moveToPracticeId: string, payload: string[]): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/practice/move/locations`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Make the HTTP request with moveToDsoId as a query parameter
    return this.http.post<any>(`${apiUrl}?currentPracticeId=${currentPracticeId}&moveToPracticeId=${moveToPracticeId}`, payload, { headers });
  }


  private formatNumberWithCommas(number: number): string {
    return number.toLocaleString();
  }
  
  private parseApiResponse(response: string): Counts {
    // Split the response string and extract the numeric values
    const values = response.match(/\d+/g) ?? [];
  
    // Check if values has the expected length
    if (values.length === 3) {
      // Destructure the values array for better readability
      const [totalDsos, totalPractices, totalLocations] = values.map(Number);
  
      // Format the numeric values with commas
      const formattedTotalDsos = totalDsos.toLocaleString();
      const formattedTotalPractices = totalPractices.toLocaleString();
      const formattedTotalLocations = totalLocations.toLocaleString();
  
      // Create a Counts object with the formatted values as strings
      return {
        totalDsos: formattedTotalDsos,
        totalPractices: formattedTotalPractices,
        totalLocations: formattedTotalLocations
      };
    } else {
      // Handle the case where the values are not as expected
      console.error('Invalid response format:', response);
      // Return a default Counts object or throw an error based on your requirements
      return { totalDsos: '0', totalPractices: '0', totalLocations: '0' };
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

  private parseLocationApiResponse(response: any): { data: LocationModel[], totalRecords: string } {
    //console.log('Before parsing:', response.data);
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
          const locationModels = dataArray.map((item: any) => {
            const locationModel: LocationModel = {
              tenantId: item?.v?.TenantId?.[0] || '',
              locationId: item?.v?.LocationId?.[0] || '',
              practiceId: item?.v?.PracticeId?.[0] || '',
              name: item?.v?.Name?.[0] || '',
              address: item?.v?.Address?.[0] || '',
              city: item?.v?.City?.[0] || '',
              state: item?.v?.State?.[0] || '',
              postalCode: item?.v?.PostalCode?.[0] || '',
              longitude: item?.v?.Longitude?.[0] || '',
              latitude: item?.v?.Latitude?.[0] || '',
              reportsToRegion: item?.v?.ReportsToRegion?.[0] || '',
              // Map other properties similarly
            };
  
            return locationModel;
          });
  
          const totalRecords = response.totalRecords || '';
  
          return { data: locationModels, totalRecords };
        } else {
          console.error('Unexpected API response data structure:', response.data);
          return { data: [], totalRecords: '' };
        }
      } else {
        console.error('Unexpected API response structure:', response);
        return { data: [], totalRecords: '' };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return { data: [], totalRecords: '' };
    }
  }
  

  private parsePracticeApiResponse(response: any): { data: PracticeModel[], totalRecords: string } {
    //console.log('Before parsing:', response);
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
          const practiceModels = dataArray.map((item: any) => {
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
  
          const totalRecords = response.totalRecords || '';
  
          return { data: practiceModels, totalRecords };
        } else {
          console.error('Unexpected API response data structure:', response.data);
          return { data: [], totalRecords: '' };
        }
      } else {
        console.error('Unexpected API response structure:', response);
        return { data: [], totalRecords: '' };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return { data: [], totalRecords: '' };
    }
  }

  private parsePracticeDataByDsoName(response: any): { data: PracticeModel[], totalRecords: string } {
    //console.log('Before parsing:', response.data);
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
          const practiceModels = dataArray.map((item: any) => {
            const practiceModel: PracticeModel = {
              tenantId: item?.v?.TenantId?.[0] || '',
              practiceId: item?.v?.PracticeId?.[0] || '',
              dsoId: item?.v?.DsoId?.[0] || '',
              name: item?.v?.Name?.[0] || '',
              address: item?.v?.Address?.[0] || '',
              city: item?.v?.City?.[0] || '',
              state: item?.v?.State?.[0] || '',
              postalCode: item?.v?.PostalCode?.[0] || '',
              longitude: item?.v?.Longitude?.[0] || '',
              latitude: item?.v?.Latitude?.[0] || '',
              zone: item?.v?.Zone?.[0] || ''
              // Map other properties similarly
            };
  
            return practiceModel;
          });
  
          const totalRecords = response.totalRecords || '';
  
          return { data: practiceModels, totalRecords };
        } else {
          console.error('Unexpected API response data structure:', response.data);
          return { data: [], totalRecords: '' };
        }
      } else {
        console.error('Unexpected API response structure:', response);
        return { data: [], totalRecords: '' };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return { data: [], totalRecords: '' };
    }
  }
  
}





