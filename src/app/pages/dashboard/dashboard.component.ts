import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit
{


  tableData: any[] = [];

  constructor(private service: DashboardService)
  {

  }


  ngOnInit(): void
  {


  }

}
