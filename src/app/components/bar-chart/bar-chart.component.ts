import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Chart,registerables} from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  standalone: true
})
export class BarChartComponent implements OnInit, OnChanges {

  chart!: Chart;

  @Input() labels!: string [];
  @Input() data : number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
 // @Input() data!: AppointmentCountByMonth[];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
     const data = changes['data'].currentValue as any[];
     data.forEach(e=>{
       this.data[e.month - 1] = e.count;
     });
     this.addData(this.data);
  }

  ngOnInit(): void {
    this.createChart();
  }

  addData(graphData:number[]){
    // @ts-ignore
    this.chart.data.datasets.forEach((dataset,index) => {
      // @ts-ignore
      dataset.data = graphData;
    });
    this.chart.update();

  }



  createChart(){

    this.chart = new Chart('myChart',{
      type:'bar',
      data:{
        labels: this.labels,
        datasets: [
          {
            label:"Monthly Sales",
            //data:this.graphData,
            data:[0,100,10,10,10,10,10,10,10,10,10,10],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgba(135,159,208)',
              'rgb(206,206,111)',
              'rgb(43,118,43)',
              'rgb(243,186,186)',
              'rgb(123,123,255)'
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(135,159,208,0.2)',
              'rgb(206,206,111,0.2)',
              'rgb(43,118,43,0.2)',
              'rgb(243,186,186,0.2)',
              'rgb(123,123,255,0.2)'
            ],
            borderWidth:2
          },
        ],
      },
      options: {
        aspectRatio: 5,
        scales: {

        },
      }
    });
  }

}
