import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef, HostBinding  } from '@angular/core';
import { DataGridColumns } from 'src/app/models/data-grid-columns';

@Component({
  selector: 'app-shared-datagrid',
  templateUrl: './shared-datagrid.component.html',
  styleUrls: ['./shared-datagrid.component.css']
})
export class SharedDatagridComponent implements OnChanges{
  rowHeight: number = 9; 
  @Input() columns: DataGridColumns[] = [];
  @Input() data: any[] = [];
  @Input() showCheckboxColumn: boolean = false;
  @Input() maxHeight: string = '100%';
  @Input() maxWidth: string = '100%';
  @Output() selectRow: EventEmitter<any> = new EventEmitter();
  @Output() selectedVOToProcess: EventEmitter<any> = new EventEmitter();
  
  @HostBinding('style.maxWidth') get hostMaxWidth() {
    return this.maxWidth;
  }

  @HostBinding('style.maxHeight') get hostMaxHeight() {
    return this.maxHeight;
  }


  currentPage = 1;
  pageSize = 10;
  totalPages: number = 0;
  math = Math;
  selectedRowIndex: number = -1;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    if (this.data) {
      this.totalPages = Math.ceil(this.data.length / this.pageSize);
    }
  }

  onHeaderClick(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.data.sort((a, b) => {
      let res = 0;
      if (a[column] < b[column]) res = -1;
      if (a[column] > b[column]) res = 1;
      return this.sortDirection === 'asc' ? res : -res;
    });
  }

  toggleCheckbox(row:any) {
    row.selected = !row.selected;
    const selectedItems = this.data.filter((row) => row.selected);
    this.selectedVOToProcess.emit(selectedItems);
  }

  onRowClick(rowIndex: number, row: any ) {
    this.selectedRowIndex = rowIndex;
    this.selectRow.emit(row);
    this.cdr.detectChanges();
    console.log(this.selectedRowIndex); 
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  shouldDisplayPage(page: number): boolean {
    const offset = 2;
    return (page <= offset || page > this.totalPages - offset || (page > this.currentPage - offset && page < this.currentPage + offset));
  }

  getPagesArray(): number[] {
    return new Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

}
