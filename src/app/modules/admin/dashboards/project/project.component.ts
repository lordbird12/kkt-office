import { project } from './../../../../mock-api/dashboards/project/data';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DashboardWeekComponent } from '../dashboardweek/dashboard-week.component';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TranslocoModule,
        MatIconModule, MatButtonModule,
        MatRippleModule, MatMenuModule,
        MatTabsModule, MatButtonToggleModule,
        NgApexchartsModule, NgFor, NgIf,
        MatTableModule, NgClass, CurrencyPipe,
        DashboardWeekComponent
    ],
})
export class ProjectComponent implements OnInit, OnDestroy {
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    githubIssuesData: any;
    itemdata: any

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private translocoService: TranslocoService,
        private _service: ProjectService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    lastWeeks = {
        mon: 10,
        tue: 50,
        wed: 20,
        thu: 32,
        fri: 56,
        sat: 80,
        son: 90
    };
    
    months = {
        1: 2084,
        2: 4972,
        3: 1048,
        4: 5027,
        5: 5021,
        6: 2120,
        7: 5048,
        8: 2845,
        9: 4937,
        10: 3123,
        11: 4109,
        12: 4841
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    getData() {
        // เรียกใช้ service เพื่อดึงข้อมูล
        this._projectService.getDatas().subscribe(data => {
            // นำข้อมูลที่ได้ไปเก็บในตัวแปร
            this.githubIssuesData = data;
            // ตรวจสอบข้อมูลที่ได้
        });
        const valueDashboard = {
            year: '',
            user: ''
        }
        this._projectService.dashboard(valueDashboard).subscribe((resp: any) => {
            this.itemdata = resp.data
            console.log(this.itemdata, 'dashboard');

        })
    }
    factory: string;
    in: string;
    material: string;
    orders: string;
    out: string;
    packaging: string;
    products: string;
    ngOnInit(): void {

        this.updateChart();
        this.factory = sessionStorage.getItem('factory');
        this.in = sessionStorage.getItem('in');
        this.material = sessionStorage.getItem('material');
        this.orders = sessionStorage.getItem('orders');
        this.out = sessionStorage.getItem('out');
        this.packaging = sessionStorage.getItem('packaging');
        this.products = sessionStorage.getItem('products');

        this.getData();
        // console.log("ดูข้อมูล", this._projectService.getDatas());
        // console.log("ดูข้อมูล888", this.getData());

        // this._projectService.getDatas().subscribe();
        // console.log("ดูข้อมูล",this._projectService.getDatas());

        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        const lastWeeksData = {
            mon: 50338,
            tue: 234777,
            wed: 88800,
            thu: 0,
            fri: 0,
            sat: 0,
            sun: 0,
        };

        // 🔹 เตรียม labels และ series
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = labels.map(label => {
            const key = label.toLowerCase() as keyof typeof lastWeeksData;
            return lastWeeksData[key] || 0;
        });

        const rawData = {
            last_weeks: { mon: 50338, tue: 234777, wed: 88800, thu: 0, fri: 0, sat: 0, sun: 0 },
            months: { 1: 0, 2: 0, 3: 1315791, 4: 392515, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }
        };

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        const chartDataFormat: any = {
            this_week: [
                {
                    name: 'New issues',
                    type: 'line',
                    data: [] // ยังไม่มีข้อมูล this_week
                }
            ],
            last_week: [
                {
                    name: 'New issues',
                    type: 'line',
                    data: days.map(day => rawData.last_weeks[day] || 0)
                },
                {
                    name: 'Closed issues',
                    type: 'column',
                    data: days.map(() => 0) // สมมุติยังไม่มีข้อมูล closed
                }
            ]
        };
        console.log(chartDataFormat, 1);
        console.log(chartDataFormat, 2);
        // Github issues
        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: labels,
            // labels     : this.data.last_weeks,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: chartDataFormat,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: this.data.taskDistribution.labels,
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: this.itemdata?.last_weeks,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'radar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: true,
                formatter: (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style: {
                    fontSize: '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding: 4,
                },
                offsetY: -15,
            },
            markers: {
                strokeColors: '#818CF8',
                strokeWidth: 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            // series: this.data.budgetDistribution.series,
            stroke: {
                width: 2,
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis: {
                labels: {
                    show: true,
                    style: {
                        fontSize: '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis: {
                max: (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#22D3EE'],
            series: this.data.weeklyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#4ADE80'],
            series: this.data.monthlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FB7185'],
            series: this.data.yearlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }

    getChartData(view: 'week' | 'year') {
        if (view === 'week') {
            const labels = Object.keys(this.lastWeeks).map((d) => d.toUpperCase());
            const data = Object.values(this.lastWeeks) as number[];
            return {
                labels,
                series: [{ name: 'Weekly Data', data }],
            };
        } else {
            const labels = Object.keys(this.months).map((m) => `เดือน ${m}`);
            const data = Object.values(this.months) as number[];
            return {
                labels,
                series: [{ name: 'Yearly Data', data }],
            };
        }
    }
    

    viewMode: 'week' | 'year' = 'week';

    updateChart() {
        const chartData = this.getChartData(this.viewMode);
        this.chartGithubIssues.labels = chartData.labels;
        this.chartGithubIssues.series = chartData.series;
    }
}
