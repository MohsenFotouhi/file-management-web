import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SearchUser} from "../interface/search-interface";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  API_URL = environment.api;

  constructor(private http: HttpClient) {
  }

  search(searchPhrase: string): Observable<SearchUser[]> {
    const url = this.API_URL + '/api/Auth/search'
    return this.http.get<SearchUser[]>(url, {params: {searchPhrase}})
  }

}
