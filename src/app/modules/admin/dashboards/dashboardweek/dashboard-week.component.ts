import { NgFor, NgIf, NgClass, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import {
    ApexChart,
    ApexAxisChartSeries,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexGrid,
    ApexTooltip,
    ApexYAxis,
    ApexLegend,
    ApexPlotOptions,
    ChartComponent,
    ApexOptions,
    NgApexchartsModule
} from 'ng-apexcharts';
import { ProjectService } from '../project/project.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    grid: ApexGrid;
    tooltip: ApexTooltip;
    yaxis: ApexYAxis;
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    labels: string[];
    colors: string[];
};

@Component({
    selector: 'app-dashboard-week',
    templateUrl: './dashboard-week.component.html',
    standalone: true,
     changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule,
        MatIconModule, MatButtonModule,
        MatRippleModule, MatMenuModule,
        MatTabsModule, MatButtonToggleModule,
        NgApexchartsModule, NgFor, NgIf,
        MatTableModule, NgClass, CurrencyPipe, FormsModule
    ],
})
export class DashboardWeekComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    viewMode: 'week' | 'year' = 'week';

    lastWeeks : any

    months : any
    constructor(
        private _service: ProjectService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
  
      
    }

    ngOnInit() {
        const data = {
            year: '2025',
            user: 'All'
        }
        this._service.dashboard(data).subscribe((resp: any) => {
            this.lastWeeks = resp.data.last_weeks;
            this.months = resp.data.months;
               this.updateChart();
               this._changeDetectorRef.markForCheck()
        });
     
    }

    getChartData(view: 'week' | 'year') {
        if (view === 'week') {
            const labels = Object.keys(this.lastWeeks).map(d => d.toUpperCase());
            const data = Object.values(this.lastWeeks) as number[];
            return { labels, series: [{ name: 'Weekly', data }] };
        } else {
            const monthShortTh = [
                'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
            ];
            const labels = Object.keys(this.months).map(m => monthShortTh[+m - 1]);
            const data = Object.values(this.months) as number[];
            return { labels, series: [{ name: 'Yearly', data }] };
        }
    }
    updateChart() {
        const chartData = this.getChartData(this.viewMode);
        this.chartOptions = {
            chart: {
                type: 'line',
                height: 350,
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: 'inherit',
                foreColor: 'inherit',
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: { borderWidth: 0 },
            },
            grid: {
                borderColor: '#E5E7EB', // tailwind border-gray-200
            },
            xaxis: {
                categories: chartData.labels,
                labels: {
                    style: {
                        colors: '#6B7280', // tailwind text-gray-500
                    },
                },
                axisTicks: {
                    color: '#E5E7EB',
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: '#6B7280',
                    },
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            stroke: {
                width: [3],
            },
            series: chartData.series,
            labels: chartData.labels,
        };
    }
}
