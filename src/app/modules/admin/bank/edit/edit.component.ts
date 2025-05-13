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
import { PageService } from '../page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { PictureComponent } from '../picture/picture.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment.development';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'warehouse-edit',
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
        MatTabsModule,
        NgxDropzoneModule,
        TranslocoModule
    ],
})
export class EditComponent implements OnInit, AfterViewInit {
    files: File[] = [];
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    Id: any;
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
    dataGrid: any[];
    itemData: any;
    form: FormGroup;
    image_url: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private translocoService: TranslocoService

    ) {
        this.form = this._formBuilder.group({
            id: '',
            prefix: '',
            name: '',
            category_id: '',
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit() {
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._service.getCategory(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;

            this.form.patchValue({
                name: this.itemData.name,
                prefix: this.itemData.prefix,
                category_id: this.Id,
            });
            this._changeDetectorRef.detectChanges();
        });
        this.loadTable();
    }
    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        console.log('element', element);

        this._router.navigate(['admin/warehouse/edit/shelf/' + element]);
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
                dataTablesParameters.category_id = this.Id;
                that._service
                    .getPageSubCategory(dataTablesParameters)
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
                { data: 'no' },
                { data: 'prefix' },
                { data: 'name' },
                { data: 'created_at' },
                { data: 'action' },
            ],
        };
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

    update(): void {
      if(this.langues=='tr'){
          // Open the confirmation dialog
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

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.update(this.form.value, this.Id).subscribe({
                    next: (resp: any) => {
                        this._service
                            .getCategory(this.Id)
                            .subscribe((resp: any) => {
                                this.itemData = resp.data;

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
                    },
                });
            }
        });
      }
      else if(this.langues=='en'){
          // Open the confirmation dialog
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
                    label: 'confirm',
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
            if (result === 'confirmed') {
                this._service.update(this.form.value, this.Id).subscribe({
                    next: (resp: any) => {
                        this._service
                            .getCategory(this.Id)
                            .subscribe((resp: any) => {
                                this.itemData = resp.data;

                                this._changeDetectorRef.detectChanges();
                            });
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'Please specify the data',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'confirm',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'cancel',
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

    backTo() {
        this._router.navigate(['/admin/category/list']);
    }
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    deleteSub(element: any) {
        if(this.langues=='tr'){
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
                this._service.delete_sub(element).subscribe({
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
            message: 'Do you want to delete the selected items?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'confirm',
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
                this._service.delete_sub(element).subscribe({
                    next: (resp: any) => {
                       this.rerender();
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'Please specify the data',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'confirm',
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
                   

 
    }
}
