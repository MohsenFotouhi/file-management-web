import {Component, Input} from '@angular/core';
import {ApexOptions} from "@vex/components/vex-chart/vex-chart.component";
import {defaultChartOptions} from "@vex/utils/default-chart-options";
import {DateTime} from "luxon";

@Component({
  selector: 'vex-user-storage',
  templateUrl: './user-storage.component.html',
  styleUrl: './user-storage.component.scss'
})
export class UserStorageComponent {

  options: ApexOptions = defaultChartOptions(
    {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: '78%',
        type: 'donut',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.8,
          opacityTo: 0.7,
          stops: [0, 50, 100]
        }
      },
      colors: ['#008ffb', '#f03343'],
      labels: ['فضای خالی', 'استفاده شده'],
      dataLabels: {
        enabled: true
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'left',

          }
        }
      }],
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'right',
        width: 100
      },
    }
  );

  series: any = [44, 55];

  createDateArray(length: number) {
    const dates: number[] = [];

    for (let i = 0; i < length; i++) {
      dates.push(+DateTime.local().minus({day: i}).toJSDate());
    }

    return dates.reverse();
  }

}
