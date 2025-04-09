import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { tap } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PictureComponent } from '../picture/picture.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'warehouse-list',
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
    public dataRow: any[];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _matDialog: MatDialog,
        private translocoService: TranslocoService,
        private _fuseConfirmationService: FuseConfirmationService,

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

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigate(['/admin/warehouse/edit/' + element.id]);
    }

    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 4);
        return menu.save === 0;
    }
    addElement() {
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
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
                { data: 'detail' },
                { data: 'picture' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    // handlePageEvent(event) {
    //     this.loadData(event.pageIndex + 1, event.pageSize);
    // }

    showPicture(imgObject: any): void {
        this._matDialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this.rerender();
            });
    }
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    delete(itemid: any) {
        if(this.langues=='tr'){
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
                        label: 'ลบ',
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
                error: (err: any) => {};
            });
        }
        else if(this.langues=='en'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete data',
                message: 'Do you want to delete the data ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'delete',
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
                error: (err: any) => {};
            });
        }
    }

    // delete(itemid: any) {
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'ลบข้อมูล',
    //         message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
    //         icon: {
    //             show: true,
    //             name: 'heroicons_outline:exclamation-triangle',
    //             color: 'warning',
    //         },
    //         actions: {
    //             confirm: {
    //                 show: true,
    //                 label: 'ลบ',
    //                 color: 'warn',
    //             },
    //             cancel: {
    //                 show: true,
    //                 label: 'ยกเลิก',
    //             },
    //         },
    //         dismissible: true,
    //     });
    //     confirmation.afterClosed().subscribe((result) => {
    //         if (result === 'confirmed') {
    //             this._service.delete(itemid).subscribe((resp) => {
    //                 this.rerender();
    //             });
    //         }
    //         // this.rerender();
    //         error: (err: any) => {};
    //     });
    // }
}
