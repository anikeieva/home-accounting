import { Component, Input } from '@angular/core';
import {ChartData} from '../../../shared/models/chartData';

@Component({
  selector: 'acc-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss']
})
export class HistoryChartComponent {
  chartView: number[] = [545, 355];
  @Input() data: ChartData[] = [];
}
