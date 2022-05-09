import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
  errorMsg = '';
  limitNumber = 1;
  data = [];
  originalData = this.data;
  selectedFilterList = [];
  columnNames = [
    'Name',
    'FullName',
    'Location',
    'Dob',
    'Phone Number',
    'Picture',
  ];
  filters = this.columnNames.slice(0,5).map((value)=>{
    return {name:value,checked:false}
  });

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchResults(this.limitNumber);

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
    }

    for (let value of this.originalData) {
      for (let index of filterChecks) {
        if (value[index].toLowerCase().indexOf(searchInput.toLowerCase()) != -1) {
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

  fetchResults(limit){
    this.originalData = [];
    this.errorMsg = '';
    this.http.get<any>('https://randomuser.me/api?results=10&limit='+limit).subscribe(
      (data) => {
        if (data.results.length) {
          let dataArray = [];
          for (let index=0;index<10;index++) {
            let result = data.results[index];
            let resObj = {};
            this.storeData(result,resObj);
            dataArray.push(resObj);
          }

          this.originalData = this.generateData(dataArray);
          this.data = this.originalData;
        }
      },
      (error) => {
        this.errorMsg = 'Fetching Users has failed';
      }
    );
  }

  fetchPreviousPage(){
    this.limitNumber-=10;
    this.fetchResults(this.limitNumber);
  }

  fetchNextPage(){
    this.limitNumber+=10;
    this.fetchResults(this.limitNumber);
  }

  storeData(result,obj){
      for(let val in result){
        if(!result.hasOwnProperty(val)){
          return;
        }
        if(typeof result[val] === 'object' && result[val]!=null){
          this.storeData(result[val],obj);
        }else if(result[val]!=null){
          obj[val]=result[val];
        }
      }
  }

  generateData(data){
    let generatedData = [];
    for(let resultData of data){
      let result = {};
      for(let name of this.columnNames){
        switch(name){
          case "Name":
            result[name]=resultData['first'];
            break;
          case "FullName":
            result[name]=resultData['title']+" "+resultData['first']+" "+resultData['last'];
            break;
          case "Location":
            result[name]=resultData['city']||result['country'];
            break;
          case "Dob":
            result[name]=resultData['date'].substring(0,10);
            break;
          case "Phone Number":
            result[name]=resultData['phone'];
            break;
          default:
            result[name]=resultData['medium'];
        }
      }
      generatedData.push(result);
    }
    return generatedData;
  }
}
