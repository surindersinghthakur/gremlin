import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef, HostBinding, SimpleChanges   } from '@angular/core';
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
  @Output() selectCheckbox: EventEmitter<any> = new EventEmitter();
  
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
  //for pagination
  @Input() currentPaginationPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  displayedData: any[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['currentPage'] || changes['itemsPerPage']) {
      this.updateDisplayedData();
      this.calculateTotalPages();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  updateDisplayedData(): void {
    const startIndex = (this.currentPaginationPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.data.slice(startIndex, endIndex);
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

  toggleCheckbox(row: any) {
    row.selected = !row.selected;
    const selectedItems = this.data.filter((r) => r.selected);
    this.selectedVOToProcess.emit(selectedItems);
    this.selectCheckbox.emit({ checked: row.selected, row });
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

  changePages(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageChange.emit(newPage);
      this.currentPaginationPage = newPage === 2 ? 2 : newPage; // Set currentPaginationPage to 2 if newPage is 2
      this.updateDisplayedData(); // Update displayed data when page changes
    }
  }

}
