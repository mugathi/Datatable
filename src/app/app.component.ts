import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  errorMsg = '';
  dataFields = [
    'name,first',
    'name,last',
    'name,title',
    'location,city',
    'location,street,name',
    'dob,date',
    'phone',
    'picture,thumbnail',
  ];
  columnNames = [
    'Name',
    'FullName',
    'Location',
    'Dob',
    'Phone Number',
    'Picture',
  ];
  filters = [
    { name: 'First', checked: false },
    { name: 'Last', checked: false },
    { name: 'Date', checked: false },
    { name: 'City', checked: false },
    { name: 'Street', checked: false },
    { name: 'Phone', checked: false },
  ];

  data = [];
  originalData = this.data;
  selectedFilterList = [];

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.errorMsg = '';
    this.http.get<any>('https://randomuser.me/api').subscribe(
      (data) => {
        if (data.results.length) {
          let maxLength = Math.min(10,data.results.length);
          for (let index=0;index<maxLength;index++) {
            let result = data.results[index];
            let resObj = {};

            for (let dataField of this.dataFields) {
              let fields = dataField.split(',');
              let resultData = fields.reduce((acc, val) => {
                return (acc && acc[val]) || undefined;
              }, result);

              let fieldName = fields[fields.length - 1] == 'name' ? 'street': fields[fields.length - 1];
              resultData = fields[fields.length-1]=='date' ? resultData && resultData.substring(0,10):resultData;

              resObj[fieldName] = resultData;
            }
            this.originalData.push(resObj);
          }
          this.data = this.originalData;
        }
      },
      (error) => {
        this.errorMsg = 'Fetching Users has failed';
      }
    );
  }

  onSearchChange(searchInput) {
    if(searchInput==""){
      this.data = this.originalData;
      return;
    }

    let currentData = [];
    let filterChecks = this.selectedFilterList;
    if (this.selectedFilterList.length==0) {
      filterChecks = this.filters.map((v) => v.name);
      filterChecks.push('title');
    }

    for (let value of this.originalData) {
      for (let index of filterChecks) {
        index = index.toLowerCase();
        if (value[index].indexOf(searchInput) != -1) {
          currentData.push(value);
          break;
        }
      }
    }

    this.data = currentData;
  }

  getFilterList(filterList) {
    this.selectedFilterList = filterList;
    if(filterList.length==0){
      this.data= this.originalData;
    }
  }

}
