import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
    selector: 'list-report-stock',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
        DataTablesModule,
        TranslocoModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    dataRow: any[] = [];
    pickList: any = {
        date: '2025-05-13',
        total_orders: 20,
        product_summary: [
            {
                product_id: 'P001',
                product_name: 'เตา JMOS-T รุ่น F4888',
                sku: 'F4888',
                total_quantity: 150,
                unit: 'ชิ้น',
                orders: [
                    { order_id: '#OR-00311', quantity: 30 },
                    { order_id: '#OR-00311', quantity: 50 },
                    { order_id: '#OR-00308', quantity: 70 }
                ]
            },
            {
                product_id: 'P002',
                product_name: 'เตา JMOS รุ่น F4574',
                sku: 'F4574',
                total_quantity: 75,
                unit: 'ชิ้น',
                orders: [
                    { order_id: '#OR-00311', quantity: 25 },
                    { order_id: '#OR-00309', quantity: 50 }
                ]
            },
            {
                product_id: 'P003',
                product_name: 'เตา JMOS-T รุ่น JK922',
                sku: 'JK922',
                total_quantity: 200,
                unit: 'ชิ้น',
                orders: [
                    { order_id: '#OR-00311', quantity: 100 },
                    { order_id: '#OR-00309', quantity: 100 }
                ]
            }
        ]
    };
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    languageUrl: any;

    ngOnInit() {
        this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json'; // Default to English
        if (localStorage.getItem('lang') === 'en') {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json'; // Thai language URL
        }
        this.loadTable();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }
    fetchPickList() {
        console.log('Loading pick list for date:', this.pickList.date);
    }
    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 3);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 3);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 3);
        return menu.save === 0;
    }
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = null;
                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
    delete(itemid: any) {
        if (this.langues == 'tr') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'ลบข้อมูล',
                message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'Remove',
                        color: 'warn',
                    },
                    cancel: {
                        show: true,
                        label: 'Cancel',
                    },
                },
                dismissible: true,
            });
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.delete(itemid).subscribe((resp) => {
                        this.rerender();
                    });
                }
                // this.rerender();
                error: (err: any) => { };
            });
        }
        if (this.langues == 'en') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete data',
                message: 'Do you want to delete the information?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'Remove',
                        color: 'warn',
                    },
                    cancel: {
                        show: true,
                        label: 'Cancel',
                    },
                },
                dismissible: true,
            });
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.delete(itemid).subscribe((resp) => {
                        this.rerender();
                    });
                }
                // this.rerender();
                error: (err: any) => { };
            });
        }

        // const confirmation = this._fuseConfirmationService.open({
        //     title: 'ลบข้อมูล',
        //     message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
        //     icon: {
        //         show: true,
        //         name: 'heroicons_outline:exclamation-triangle',
        //         color: 'warning',
        //     },
        //     actions: {
        //         confirm: {
        //             show: true,
        //             label: 'Remove',
        //             color: 'warn',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'Cancel',
        //         },
        //     },
        //     dismissible: true,
        // });
        // confirmation.afterClosed().subscribe((result) => {
        //     if (result === 'confirmed') {
        //         this._service.delete(itemid).subscribe((resp) => {
        //             this.rerender();
        //         });
        //     }
        //     // this.rerender();
        //     error: (err: any) => {};
        // });
    }


    addElement() {
        this._router.navigate(['/admin/transport/form']);
    }
    editElement(element: any) {
        this._router.navigate(['admin/transport/edit/' + element]);
    }

    printPickList(): void {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.text('ใบจัดสินค้า (Pick List)', 14, 20);
        doc.setFontSize(12);
        doc.text(`วันที่: ${this.pickList.date}`, 14, 28);
        doc.text(`รวมออเดอร์: ${this.pickList.total_orders} รายการ`, 14, 34);

        // Prepare data for table
        const tableBody: any[] = [];

        this.pickList.product_summary.forEach((product, index) => {
            const orderDetails = product.orders.map(o => `${o.order_id}: ${o.quantity} ${product.unit}`).join(', ');
            tableBody.push([
                index + 1,
                product.product_name,
                product.sku,
                product.total_quantity,
                product.unit,
                orderDetails
            ]);
        });

        // Create table
        autoTable(doc, {
            startY: 40,
            head: [['#', 'ชื่อสินค้า', 'รหัสสินค้า', 'จำนวนรวม', 'หน่วย', 'ออเดอร์ที่เกี่ยวข้อง']],
            body: tableBody,
            styles: {
                font: 'THSarabun', // หากต้องการภาษาไทย ต้องโหลดฟอนต์เข้า
                fontSize: 11
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255]
            },
            margin: { left: 14, right: 14 }
        });

        // Save PDF
        doc.save(`PickList-${this.pickList.date}.pdf`);
    }

}
