import { Component, OnInit, Input } from '@angular/core';
import { DataSource } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() dataSource: DataSource<unknown>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.refresh();
  }

}
