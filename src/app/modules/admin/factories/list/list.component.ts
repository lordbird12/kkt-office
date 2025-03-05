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
import { MatTabsModule } from '@angular/material/tabs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from 'app/core/user/user.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
const user = localStorage.getItem('user')
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
        MatTabsModule,
        MatTooltipModule,
        TranslocoModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    public dtOptions: DataTables.Settings = {};
    public dtOptions1: DataTables.Settings = {};
    public dtOptions2: DataTables.Settings = {};
    public dtOptions3: DataTables.Settings = {};
    public dtOptions4: DataTables.Settings = {};
    public dtOptions5: DataTables.Settings = {};
    public dtOptions6: DataTables.Settings = {};
    
    positions: any[];
    // public dataRow: any[];
    userData= null
    dataRow: any[] = [];
    categoryData: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public _user_service: UserService,
        private translocoService: TranslocoService


    ) {
    //   this.userData=JSON.parse(user)
      this._user_service.user$.subscribe((resp: any)=>{
      this.userData = resp
        
      })
      this.lang = translocoService.getActiveLang();
      this.langues = localStorage.getItem('lang');
  }
  langues: any;
  lang: String;

    changeProduct(id: any) {
        
    }
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
        console.log(element)
        // const dialogRef = this.dialog.open(EditDialogComponent, {
        //     width: '500px', // กำหนดความกว้างของ Dialog
        //     data: {
        //         data: element,
        //     }, // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        // });

        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result) {
        //         // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
        //     }
        // });
        this._router.navigate(['admin/factories/edit/' + element]);

    }
    addElement() {
        this._router.navigate(['admin/factories/form']);
    }
    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 8);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 8);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 8);
        return menu.save === 0;
    }
    loadElement(id: any) {
        window.open(
            'https://laongherbalgroup.com/api/public/api/export_fac/' + id
        );
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
                dataTablesParameters.status = '';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };

        this.dtOptions1 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'Ordered';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };

        this.dtOptions2 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'Process';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };

        this.dtOptions3 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'Complete';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };

        this.dtOptions4 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'InStock';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };

        this.dtOptions5 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'Cancel';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
        this.dtOptions6 = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'ToClient';
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
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'code' },
                { data: 'order' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement(id) {

        // Open the confirmation dialog
        if(this.langues=='tr'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'ลบรายการที่เลือก',
                message: 'คุณต้องการลบรายการที่เลือกใช่หรือไม่ ',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this._service.delete(id).subscribe({
                        next: (resp: any) => {
                            this.rerender()
                            // this._router
                            //     .navigateByUrl('client/list')
                            //     .then(() => {});
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
                            console.log(err.error.message);
                        },
                    });
                }
            });
        }
        else if(this.langues=='en'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete',
                message: 'Do you want to delete the selected item ?',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this._service.delete(id).subscribe({
                        next: (resp: any) => {
                            this.rerender()
                            // this._router
                            //     .navigateByUrl('client/list')
                            //     .then(() => {});
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'Please specify information',
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
                            console.log(err.error.message);
                        },
                    });
                }
            });
        }

        // const confirmation = this._fuseConfirmationService.open({
        //     title: 'ลบรายการที่เลือก',
        //     message: 'คุณต้องการลบรายการที่เลือกใช่หรือไม่ ',
        //     icon: {
        //         show: false,
        //         name: 'heroicons_outline:exclamation',
        //         color: 'warning',
        //     },
        //     actions: {
        //         confirm: {
        //             show: true,
        //             label: 'ยืนยัน',
        //             color: 'primary',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'ยกเลิก',
        //         },
        //     },
        //     dismissible: true,
        // });

        // // Subscribe to the confirmation dialog closed action
        // confirmation.afterClosed().subscribe((result) => {
        //     // If the confirm button pressed...
        //     if (result === 'confirmed') {
        //         this._service.delete(id).subscribe({
        //             next: (resp: any) => {
        //                 this.rerender()
        //                 // this._router
        //                 //     .navigateByUrl('client/list')
        //                 //     .then(() => {});
        //             },
        //             error: (err: any) => {
        //                 this._fuseConfirmationService.open({
        //                     title: 'กรุณาระบุข้อมูล',
        //                     message: err.error.message,
        //                     icon: {
        //                         show: true,
        //                         name: 'heroicons_outline:exclamation',
        //                         color: 'warning',
        //                     },
        //                     actions: {
        //                         confirm: {
        //                             show: false,
        //                             label: 'ยืนยัน',
        //                             color: 'primary',
        //                         },
        //                         cancel: {
        //                             show: false,
        //                             label: 'ยกเลิก',
        //                         },
        //                     },
        //                     dismissible: true,
        //                 });
        //                 console.log(err.error.message);
        //             },
        //         });
        //     }
        // });
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

    changeStatus(data: any, id: any ): void {
        if(this.langues=='tr'){
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
        if(this.langues=='en'){
            const dialogRef = this._fuseConfirmationService.open({
                title: 'Save data',
                message: 'Do you want to change your status?',
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
                                title: 'Please specify information',
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

        // const dialogRef = this._fuseConfirmationService.open({
        //     title: 'บันทึกข้อมูล',
        //     message: 'คุณต้องการเปลี่ยนสถานะใช่หรือไม่ ?',
        //     icon: {
        //         show: true,
        //         name: 'heroicons_outline:exclamation-triangle',
        //         color: 'accent',
        //     },
        //     actions: {
        //         confirm: {
        //             show: true,
        //             label: 'ตกลง',
        //             color: 'primary',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'ยกเลิก',
        //         },
        //     },
        //     dismissible: true,
        // });

        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result === 'confirmed') {
        //         this._service.updateStatus(data, id).subscribe({
        //             next: (resp: any) => {
        //                 this.rerender();
        //             },
        //             error: (err: any) => {
        //                 this._fuseConfirmationService.open({
        //                     title: 'กรุณาระบุข้อมูล',
        //                     message: err.error.message,
        //                     icon: {
        //                         show: true,
        //                         name: 'heroicons_outline:exclamation',
        //                         color: 'warning',
        //                     },
        //                     actions: {
        //                         confirm: {
        //                             show: false,
        //                             label: 'ยืนยัน',
        //                             color: 'primary',
        //                         },
        //                         cancel: {
        //                             show: false,
        //                             label: 'ยกเลิก',
        //                         },
        //                     },
        //                     dismissible: true,
        //                 });
        //                 // console.log(err.error.message)
        //             },
        //         });
        //     }
        // });
    }
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    approveElement(element: any) {
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
        // this._router.navigate(['admin/factories/edit/' + element]);

    }

}
