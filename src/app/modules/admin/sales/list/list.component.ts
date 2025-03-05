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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'environments/environment.development';
import { MatDividerModule } from '@angular/material/divider';
import { UpdateDialogComponent } from '../update-status/update-dialog.component';

@Component({
    selector: 'employee-list',
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
        TranslocoModule,
        MatTabsModule,
        MatMenuModule,
        MatDividerModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    selectedStatus: string = '';  // เก็บสถานะที่เลือก
    selectedStatusIndex = 0;
    // public dataRow: any[];
    dataRow: any[] = [];
    status: any[] = [
        {
            value: 'Ordered',
            name: 'รอดำเนินการ'
        },
        {
            value: 'Approve',
            name: 'อนุมัติ'
        },
        {
            value: 'Recived',
            name: 'รอจัดส่ง'
        },
        {
            value: 'Finish',
            name: 'จัดส่ง'
        },
        {
            value: 'ToClient',
            name: 'ได้รับสินค้า'
        },
    ]
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
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
        // this._service.getPosition().subscribe((resp: any) => {
        //     this.positions = resp.data;
        // });
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigateByUrl('admin/sales/view/' + element)
    }



    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.save === 0;
    }
    addElement() {
        this._router.navigate(['admin/sales/form']);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    // โหลดตารางข้อมูล
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
                dataTablesParameters.status = this.selectedStatus || ''; // ส่งสถานะไปที่ API
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    this.pages.begin = resp.current_page > 1 ? resp.per_page * (resp.current_page - 1) : 0;

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
                { data: 'code' },
                { data: 'date' },
                { data: 'client' },
                { data: 'vat' },
                { data: 'discount' },
                { data: 'total_price' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
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

    onStatusChange(index: number): void {
        if (index === 0) {
            this.selectedStatus = ''; // เลือก "ทั้งหมด"
        } else {
            this.selectedStatus = this.status[index - 1].value; // ดึงค่าของสถานะที่เลือก
        }
        this.rerender();
    }

    // ฟังก์ชันแปลงค่า status เป็นชื่อที่อ่านง่าย
    getStatusName(value: string): string {
        const foundStatus = this.status.find(s => s.value === value);
        return foundStatus ? foundStatus.name : '-';
    }

    // ฟังก์ชันตรวจสอบว่าต้องเปลี่ยนสีพื้นหลังหรือไม่
    shouldHighlightRow(item: any): boolean {
        return item.status === 'Ordered' && item.discount > 0;
    }

    viewPDF(element: any) {
        window.open(environment.baseURL + '/api/invoice/' + element, '_blank');

    }

    updateStatus(data): void {
        this.dialog
            .open(UpdateDialogComponent, {
                width: '40%',
                height: 'auto',
                autoFocus: false,
                data: data

            })
            .afterClosed()
            .subscribe((foundItem) => {
                if (foundItem) {
               
                    this.rerender()
                }
            });
    }
}
