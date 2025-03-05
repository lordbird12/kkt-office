import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from 'environments/environment.development';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ViewOrderComponent } from '../../view-order/view-order.component';
import { DateTime } from 'luxon';
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
    selector: 'report-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
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
        MatTabsModule,
        TranslocoModule,
        MatDatepickerModule,
        ReactiveFormsModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    form: FormGroup

    userData = null
    isLoading: boolean = false;
    // dtOptions: DataTables.Settings = {};

    dtOptions: any = {};
    // dtOptions: DataTables.Settings = {};
    positions: any[];
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    // public dataRow: any[];
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('printableTable') printableTable: ElementRef;
    constructor(
        private dialog: MatDialog,
        // @Inject(MAT_DIALOG_DATA) public _data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public _user_service: UserService,
        private translocoService: TranslocoService,
        private _fb: FormBuilder

    ) {
        this.form = this._fb.group({
            date: '',
        })
        this._user_service.user$.subscribe((resp: any) => {
            this.userData = resp

        })
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');

    }
    langues: any;
    lang: String;
    languageUrl: any;
    // _data: any;
    ngOnInit() {

        this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json'; // Default to English
        if (localStorage.getItem('lang') === 'en') {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json'; // Thai language URL
        }
        this.loadTable();
        // this._service.getPosition().subscribe((resp: any) => {
        //     this.positions = resp.data;
        // });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                data: element,
            }, // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
            }
        });
    }
    addElement() {
        this._router.navigate(['admin/stock/form']);
    }

    formatDate(isoDateString) {
        // แปลงวันที่จาก ISO 8601 string เป็น Luxon DateTime
        const dateTime = DateTime.fromISO(isoDateString);

        // แปลงวันที่เป็นรูปแบบ "yyyy-MM-dd"
        return dateTime.toFormat('yyyy-MM-dd');
    }

    reportDaily: any[] = []
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        const datePipe = new DatePipe('en-US');

        const date = datePipe.transform(
            this.form.value.date,
            'YYYY-MM-dd'
        );

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 100,
            serverSide: true,
            processing: true,
            searching: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = '';
                dataTablesParameters.type = '';
                dataTablesParameters.date = this.formatDate(this.form.value.date);

                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
                        // console.log( 'stock', this.dataRow);
                        this.reportDaily = resp.data.flatMap(order =>
                            order.lines.map(line => ({
                                date: order.date,
                                type: order.type,
                                product_name: line.product?.name,
                                product_code: line.product?.code,
                                qty: line.qty,
                                createby: order.create_by ?? 'admin',
                                in: order.type === 'IN' ? line.qty : 0,
                                out: order.type === 'OUT' ? line.qty : 0
                            }))
                        );

                        console.log('reportDaily', this.reportDaily);

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
                { data: 'No' },
                { data: 'date' },
                { data: 'code' },
                { data: 'name' },
                { data: 'in' },
                { data: 'out' },
                { data: 'create_by' },
            ],
            // dom: 'Bfrtip', // Include the buttons
            // buttons: [
            //     'excelHtml5',
            //     'print'
            // ]

        };

    }

    getTotalIn(): number {
        return this.reportDaily.reduce((total, item) => total + (+item.in || 0), 0);
    }

    getTotalOut(): number {
        return this.reportDaily.reduce((total, item) => total + (+item.out || 0), 0);
    }

    getTotalQty(): number {
        return this.getTotalIn() - this.getTotalOut();
    }

    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 11);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 11);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 11);
        return menu.save === 0;
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
                        label: 'ยืนยัน',
                        color: 'warn',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
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
                error: (err: any) => { };
            });
        }
        else if (this.langues == 'en') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete',
                message: 'Do you want to delete the information?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'submit',
                        color: 'warn',
                    },
                    cancel: {
                        show: true,
                        label: 'cancel',
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
        //             label: 'ยืนยัน',
        //             color: 'warn',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'ยกเลิก',
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
        //     error: (err: any) => { };
        // });
    }
    changeStatus(data: any, id: any): void {
        if (this.langues == 'tr') {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูล',
                message: 'คุณต้องการเปลี่ยนสถานะใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'accent',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.updateStatus(data, id).subscribe({
                        next: (resp: any) => {
                            this.rerender();
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ยืนยัน',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                            // console.log(err.error.message)
                        },
                    });
                }
            });
        }
        else if (this.langues == 'en') {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'Save data',
                message: 'Do you want to change the status ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'accent',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'submit',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'cancel',
                    },
                },
                dismissible: true,
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.updateStatus(data, id).subscribe({
                        next: (resp: any) => {
                            this.rerender();
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'Please enter information',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'submit',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'cancel',
                                    },
                                },
                                dismissible: true,
                            });
                            // console.log(err.error.message)
                        },
                    });
                }
            });
        }



    }


    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
    pdf(id: any) {
        window.open(environment.baseURL + `/api/export_stock/${id}`);
    }
    showPicture(imgObject: any): void {
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }

    goTo(id: any) {
        this._router.navigate(['admin/stock/edit/' + id]);
    }

    viewOrder(element: any) {

        const dialogRef = this.dialog.open(ViewOrderComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: element// ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
            }
        });
        // this._router.navigate(['admin/factories/edit/' + element]);

    }
    imgSelected: string;
    selectedItem: any = null;


    // viewOrder(item: any) {
    //     console.log(Element);  // เพิ่มบรรทัดนี้เพื่อดูข้อมูล
    //     if (this.selectedItem && this.selectedItem.id === item.id) {
    //         this.selectedItem = null;  // Toggle off
    //     } else {
    //         this.selectedItem = item;  // Toggle on
    //     }
    // }

    expandedItem: any = null;

    toggleItem(item: any) {
        this.expandedItem = this.expandedItem === item ? null : item;
    }
    printTable() {
        const printContents = this.printableTable.nativeElement.innerHTML;
        const originalContents = document.body.innerHTML;
        const popupWindow = window.open('', '_blank', 'width=800,height=600');

        const styles = `
          <style>
            /* สไตล์ทั่วไปสำหรับตาราง */
            .table {
              width: 100%;
              border-collapse: collapse;
              font-family: Arial, sans-serif;
            }
            .table th, .table td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            .table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .text-green-600 {
              color: green;
            }
            .text-red-600 {
              color: red;
            }
            .font-semibold {
              font-weight: 600;
            }
            .font-bold {
              font-weight: bold;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
          </style>
        `;

        popupWindow.document.open();
        popupWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              ${styles}
            </head>
            <body onload="window.print();window.close()">
              <div class="table-container">
                ${printContents}
              </div>
            </body>
          </html>
        `);
        popupWindow.document.close();
    }

    changeDate() {
        this.rerender();
    }
}
