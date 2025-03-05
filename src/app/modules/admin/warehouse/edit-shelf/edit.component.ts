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
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
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
import { FormDialogComponent } from '../../shelf/form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { NewFloorsComponent } from '../new-floors/new-floors.component';
import { NewChanelComponent } from '../new-chanel/new-chanel.component';
import { EditFloorsComponent } from '../edit-floors/edit-floors.component';
import { EditChanelComponent } from '../edit-chanel/edit-chanel.component';
import { NgxDropzoneComponent, NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from 'environments/environment.development';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'shelf-edit',
    templateUrl: './edit.component.html',
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
        MatRadioModule,
        MatIconModule,
        NgxDropzoneModule,
        TranslocoModule
    ],
})
export class EditShelfComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    public dataRow: any[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    status: any[] = [
        {
            id: 1,
            name: 'เปิดใช้งาน',
        },
        {
            id: 0,
            name: 'ไม่เปิดใช้งาน',
        },
    ];
    Id: any;
    itemData: any;
    form: FormGroup;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private translocoService: TranslocoService

    ) {
        this.form = this._fb.group({
            id: '',
            area_id: '',
            name: '',
            detail: '',
            image: '',
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit() {
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._service.getShelf(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            this.dataRow = resp.data.floors;
            if (this.itemData.image) {
                this.image_url = environment.baseURL + this.itemData?.image;
            }
            this.form.patchValue({
                ...resp.data,
                image: '',
            });

            console.log();
            this._changeDetectorRef.detectChanges();
            for (let i = 0; i < this.dataRow.length; i++) {
                for (let j = 0; j < this.dataRow[i].channels.length; j++) {
                    this.dataRow[i].channels.isExpanded = false;
                    console.log();
                }
            }
        });
        // this.loadTable();
    }
    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigate(['admin/warehouse/edit/chanel/' + element.id]);
    }
    addElement() {
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }
    addShelf() {
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
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
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = null;
                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data.data;
                        this.pages.current_page = resp.data.current_page;
                        this.pages.last_page = resp.data.last_page;
                        this.pages.per_page = resp.data.per_page;
                        if (resp.data.currentPage > 1) {
                            this.pages.begin =
                                parseInt(resp.data.itemsPerPage) *
                                (parseInt(resp.data.currentPage) - 1);
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.data.total,
                            recordsFiltered: resp.data.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'picture' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteFloor(id: any) {
        if(this.langues=='tr'){
            console.log('lang',this.langues);
            
                    // Open the confirmation dialog
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
                this._service.deleteFloor(id).subscribe({
                    next: (resp: any) => {
                        this._service.getShelf(this.Id).subscribe((resp: any) => {
                            this.itemData = resp.data;
                            this.dataRow = resp.data.floors;
                            console.log('resp', this.dataRow);
                            this.form.patchValue({
                                id: this.itemData.id,
                                name: this.itemData.name,
                                detail: this.itemData.detail,
                                image: this.itemData.image,
                            });
                            // this.url_path =  this.itemData.image
                            this._changeDetectorRef.detectChanges();
                        });
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
                    // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete selected items',
            message: 'Do you want to delete the selected items ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Confirm',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                this._service.deleteFloor(id).subscribe({
                    next: (resp: any) => {
                        this._service.getShelf(this.Id).subscribe((resp: any) => {
                            this.itemData = resp.data;
                            this.dataRow = resp.data.floors;
                            console.log('resp', this.dataRow);
                            this.form.patchValue({
                                id: this.itemData.id,
                                name: this.itemData.name,
                                detail: this.itemData.detail,
                                image: this.itemData.image,
                            });
                            // this.url_path =  this.itemData.image
                            this._changeDetectorRef.detectChanges();
                        });
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'Please enter data',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'Confirm',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'Cancel',
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
                    // Open the confirmation dialog


    }

    deleteChannel(id: any) {
        if (this.langues == 'tr') {
            console.log('lang', this.langues);
            
            // Open the confirmation dialog
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
                    this._service.deleteChannel(id).subscribe({
                        next: (resp: any) => {
                            this._service.getShelf(this.Id).subscribe((resp: any) => {
                                this.itemData = resp.data;
                                this.dataRow = resp.data.floors;
                                console.log('resp', this.dataRow);
                                this.form.patchValue({
                                    id: this.itemData.id,
                                    name: this.itemData.name,
                                    detail: this.itemData.detail,
                                    image: this.itemData.image,
                                });
                                // this.url_path =  this.itemData.image
                                this._changeDetectorRef.detectChanges();
                            });
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
        else if (this.langues == 'en') {
            console.log('lang', this.langues);

            // Open the confirmation dialog
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete selected items',
                message: 'Do you want to delete the selected items ?',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'Confirm',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'Cancel',
                    },
                },
                dismissible: true,
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this._service.deleteChannel(id).subscribe({
                        next: (resp: any) => {
                            this._service.getShelf(this.Id).subscribe((resp: any) => {
                                this.itemData = resp.data;
                                this.dataRow = resp.data.floors;
                                console.log('resp', this.dataRow);
                                this.form.patchValue({
                                    id: this.itemData.id,
                                    name: this.itemData.name,
                                    detail: this.itemData.detail,
                                    image: this.itemData.image,
                                });
                                // this.url_path =  this.itemData.image
                                this._changeDetectorRef.detectChanges();
                            });
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'Please enter data',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'Confirm',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'Cancel',
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

    }

    backTo(element: any): void {
        this._router.navigate(['/admin/warehouse/shelf/' + element.id]);
    }

    expandFunction(): void {
        console.log(this.dataRow[0].channels);
        for (let i = 0; i < this.dataRow.length; i++) {
            if (this.dataRow[i].channels.isExpanded != true) {
                this.dataRow[i].channels.isExpanded = true;
            } else {
                this.dataRow[i].channels.isExpanded = false;
            }
        }
    }

    newFloor(data: any): void {
        this.dialog
            .open(NewFloorsComponent, {
                width: '750px',
                autoFocus: false,
                data: {
                    data,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this._service.getShelf(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.dataRow = resp.data.floors;
                    console.log('resp', this.dataRow);
                    this.form.patchValue({
                        id: this.itemData.id,
                        name: this.itemData.name,
                        detail: this.itemData.detail,
                        image: this.itemData.image,
                    });
                    // this.url_path =  this.itemData.image
                    this._changeDetectorRef.detectChanges();
                });
            });
    }
    newChanel(data: any): void {
        console.log(data);

        this.dialog
            .open(NewChanelComponent, {
                autoFocus: false,
                data: {
                    data,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this._service.getShelf(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.dataRow = resp.data.floors;
                    console.log('resp', this.dataRow);
                    this.form.patchValue({
                        id: this.itemData.id,
                        name: this.itemData.name,
                        detail: this.itemData.detail,
                        image: this.itemData.image,
                    });
                    // this.url_path =  this.itemData.image
                    this._changeDetectorRef.detectChanges();
                });
            });
    }
    editFloor(data: any): void {
        this.dialog
            .open(EditFloorsComponent, {
                width: '750px',
                autoFocus: false,
                data: {
                    data,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this._service.getShelf(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.dataRow = resp.data.floors;
                    console.log('resp', this.dataRow);
                    this.form.patchValue({
                        id: this.itemData.id,
                        name: this.itemData.name,
                        detail: this.itemData.detail,
                        image: this.itemData.image,
                    });
                    // this.url_path =  this.itemData.image
                    this._changeDetectorRef.detectChanges();
                });
            });
    }
    editChannel(data: any): void {
        this.dialog
            .open(EditChanelComponent, {
                width: '750px',
                autoFocus: false,
                data: {
                    data,
                },
            })
            .afterClosed()
            .subscribe(() => {
                this._service.getShelf(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.dataRow = resp.data.floors;
                    console.log('resp', this.dataRow);
                    this.form.patchValue({
                        id: this.itemData.id,
                        name: this.itemData.name,
                        detail: this.itemData.detail,
                        image: this.itemData.image,
                    });
                    // this.url_path =  this.itemData.image
                    this._changeDetectorRef.detectChanges();
                });
            });
    }
    files: File[] = [];
    image_url: any;
    onSelect(event) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.image_url = null;
        this.form.patchValue({
            image: this.files[0],
        });
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.form.patchValue({
            image: '',
        });
    }
    // viewProduct(data: any): void {
    //     this._matDialog
    //         .open(ViewProductComponent, {
    //             autoFocus: false,
    //             data: {
    //                 data
    //             },
    //         })
    //         .afterClosed()
    //         .subscribe(() => {
    //             this._Service.getById(this.Id).subscribe((resp: any) => {
    //                 this.itemData = resp.data;
    //                 this.dataRow = resp.data.floors;
    //                 console.log('resp', this.dataRow);
    //                 this.formData.patchValue({
    //                     id: this.itemData.id,
    //                     name: this.itemData.name,
    //                     detail: this.itemData.detail,
    //                     image: this.itemData.image,
    //                 });
    //                 this.url_path = this.itemData.image
    //                 this._changeDetectorRef.detectChanges();
    //             });
    //         });
    // }

    update(): void {
        if (this.langues == 'tr') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'แก้ไขข้อมูล',
                message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
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
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    const formData = new FormData();
                    Object.entries(this.form.value).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    this._service.updateShelf(formData).subscribe({
                        next: (resp: any) => {
                            this._service
                                .getShelf(this.Id)
                                .subscribe((resp: any) => {
                                    this.itemData = resp.data;
                                    this.dataRow = resp.data.floors;
                                    if (this.itemData.image) {
                                        this.image_url =
                                            environment.baseURL +
                                            this.itemData?.image;
                                    }

                                    this.form.patchValue({
                                        ...resp.data,
                                        image: '',
                                    });
                                    this._changeDetectorRef.detectChanges();
                                    for (let i = 0; i < this.dataRow.length; i++) {
                                        for (
                                            let j = 0;
                                            j < this.dataRow[i].channels.length;
                                            j++
                                        ) {
                                            this.dataRow[i].channels.isExpanded =
                                                false;
                                            console.log();
                                        }
                                    }
                                });
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
                        },
                    });
                }
            });
        }
        else if (this.langues == 'en') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Edit Data',
                message: 'Do you want to edit the data?',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'Confirm',
                        color: 'primary',
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
                    const formData = new FormData();
                    Object.entries(this.form.value).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    this._service.updateShelf(formData).subscribe({
                        next: (resp: any) => {
                            this._service
                                .getShelf(this.Id)
                                .subscribe((resp: any) => {
                                    this.itemData = resp.data;
                                    this.dataRow = resp.data.floors;
                                    if (this.itemData.image) {
                                        this.image_url =
                                            environment.baseURL +
                                            this.itemData?.image;
                                    }

                                    this.form.patchValue({
                                        ...resp.data,
                                        image: '',
                                    });
                                    this._changeDetectorRef.detectChanges();
                                    for (let i = 0; i < this.dataRow.length; i++) {
                                        for (
                                            let j = 0;
                                            j < this.dataRow[i].channels.length;
                                            j++
                                        ) {
                                            this.dataRow[i].channels.isExpanded =
                                                false;
                                            console.log();
                                        }
                                    }
                                });
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'Please enter data',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'Confirm',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'Cancel',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                }
            });
        }
    }

    // update(): void {
    //     // Open the confirmation dialog
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'แก้ไขข้อมูล',
    //         message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
    //         icon: {
    //             show: false,
    //             name: 'heroicons_outline:exclamation',
    //             color: 'warning',
    //         },
    //         actions: {
    //             confirm: {
    //                 show: true,
    //                 label: 'ยืนยัน',
    //                 color: 'primary',
    //             },
    //             cancel: {
    //                 show: true,
    //                 label: 'ยกเลิก',
    //             },
    //         },
    //         dismissible: true,
    //     });

    //     // Subscribe to the confirmation dialog closed action
    //     confirmation.afterClosed().subscribe((result) => {
    //         if (result === 'confirmed') {
    //             const formData = new FormData();
    //             Object.entries(this.form.value).forEach(
    //                 ([key, value]: any[]) => {
    //                     formData.append(key, value);
    //                 }
    //             );
    //             this._service.updateShelf(formData).subscribe({
    //                 next: (resp: any) => {
    //                     this._service
    //                         .getShelf(this.Id)
    //                         .subscribe((resp: any) => {
    //                             this.itemData = resp.data;
    //                             this.dataRow = resp.data.floors;
    //                             if (this.itemData.image) {
    //                                 this.image_url =
    //                                     environment.baseURL +
    //                                     this.itemData?.image;
    //                             }

    //                             this.form.patchValue({
    //                                 ...resp.data,
    //                                 image: '',
    //                             });
    //                             this._changeDetectorRef.detectChanges();
    //                             for (let i = 0; i < this.dataRow.length; i++) {
    //                                 for (
    //                                     let j = 0;
    //                                     j < this.dataRow[i].channels.length;
    //                                     j++
    //                                 ) {
    //                                     this.dataRow[i].channels.isExpanded =
    //                                         false;
    //                                     console.log();
    //                                 }
    //                             }
    //                         });
    //                 },
    //                 error: (err: any) => {
    //                     this._fuseConfirmationService.open({
    //                         title: 'กรุณาระบุข้อมูล',
    //                         message: err.error.message,
    //                         icon: {
    //                             show: true,
    //                             name: 'heroicons_outline:exclamation',
    //                             color: 'warning',
    //                         },
    //                         actions: {
    //                             confirm: {
    //                                 show: false,
    //                                 label: 'ยืนยัน',
    //                                 color: 'primary',
    //                             },
    //                             cancel: {
    //                                 show: false,
    //                                 label: 'ยกเลิก',
    //                             },
    //                         },
    //                         dismissible: true,
    //                     });
    //                 },
    //             });
    //         }
    //     });
    // }

    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
}
