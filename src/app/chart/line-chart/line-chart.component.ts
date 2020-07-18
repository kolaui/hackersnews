import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import { NEWS } from '../../shared/news';
import { CommonService } from '../../common/common.service';
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
    nwsArticls: any;
    constructor(private cmnser: CommonService) { }
    datas(val) {
        this.xAxisData = [];
        this.yAxisData = [];
        val.forEach((val, idx) => {
            this.xAxisData.push(val.upVote)
            this.yAxisData.push(val.voteCount)
        })
        this.addOptions();
        this.createChart();
    }
    ngOnInit() {
        this.cmnser.nwsData.subscribe((val) => {
            this.nwsArticls = val;
            this.datas(this.nwsArticls);
        })
    }
    createChart() {
        Highcharts.chart('linechart', this.chartOptions);
    }
    addOptions() {
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
                name: 'Votes',
                showInLegend: false,
                type: "line",
                data: this.yAxisData,
            }]
        };
    }


}