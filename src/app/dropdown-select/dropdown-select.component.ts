import { Component, Input, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.css']
})
export class DropdownSelectComponent {
  showDropDown = false;
  selectedList:string[] = [];
  @Input('filterList')  filters;
  @Output('selectList') selectedValue = new EventEmitter();

  constructor() { }

  setSelectedValue(flag, selectedValue) {
    if (flag) {
      this.selectedList.push(selectedValue.name);
    } else {
      var index = this.selectedList.indexOf(selectedValue.name);
      this.selectedList.splice(index, 1);
    }

    this.selectedValue.emit(this.selectedList);
  }
}
