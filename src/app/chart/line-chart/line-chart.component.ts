import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import { NEWS } from '../../shared/news';

@Component({
    selector: 'app-line-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
    @ViewChild('charts', { static: true }) public chartEl: ElementRef;
    title = 'Line Chart';
    highcharts = Highcharts;
    chartOptions: Options;
    xAxisData = [];
    yAxisData = [];
    constructor() {
        this.datas()
    }
    datas() {
        this.xAxisData = [];
        this.yAxisData = [];
        NEWS.forEach((val, idx) => {
            this.xAxisData.push(val.id)
            this.yAxisData.push(val.votes)
        })
    }
    ngOnInit() {
        this.addOptions();
        this.createChart();
    }
    createChart() {
        Highcharts.chart('linechart', this.chartOptions);
    }
    addOptions() {
        console.log(this.xAxisData);
        console.log(this.yAxisData);
        this.chartOptions = {
            chart: {
                type: "spline"
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: this.xAxisData,
                title: {
                    text: "ID"
                }
            },
            yAxis: {
                lineWidth: 1,
                max: Math.max(...this.yAxisData),
                //categories: this.yAxisData,
                title: {
                    text: "Votes"
                }
            },
            tooltip: {
            },
            series: [{
                name:'Votes',
                showInLegend: false,
                type: "line",
                data: this.yAxisData,
            }]
        };
    }


}