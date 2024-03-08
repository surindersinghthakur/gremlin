import { Component, EventEmitter, Input, Output,OnInit, ViewChild  } from '@angular/core';

@Component({
  selector: 'my-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

    ngOnInit(): void {
    }

    handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
}
