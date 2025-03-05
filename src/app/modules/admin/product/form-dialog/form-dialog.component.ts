import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { Service } from '../page.service';
import { Employee } from '../page.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        MatRadioModule,
        CommonModule,
        NgxDropzoneModule,
        TranslocoModule
    ],
})
export class FormDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    formData: FormGroup;
    uploadPic: FormGroup;
    // flashErrorMessage: string;
    positions: any[];
    CategoryData: any = [];
    SubCategoryData: any = [];
    warehouseData: any;
    Unit: any = [];
    selectedShelfId: any;
    flashMessage: 'success' | 'error' | null = null;
    taxType: any[] = [
        {
            id: 1,
            name: 'สินค้ามีภาษี',
        },
        {
            id: 2,
            name: 'สินค้าไม่มีภาษี',
        },
    ];
    uniType: any[] = [
        {
            id: 1,
            name: 'แท่ง',
        },
        {
            id: 2,
            name: 'ชิ้น',
        },
        {
            id: 3,
            name: 'กิโลกรัม',
        },
        {
            id: 4,
            name: 'กล่อง',
        },
    ];
    itemArea: any = [];
    maxProductsLength: number;
    itemSupplier: any = [];
    stockStatus: any = [
        {
            id: 0,
            name: 'เช็คสต็อค',
        },
        {
            id: 1,
            name: 'ไม่เช็คสต็อค',
        },
    ];
    itemShelve: any = [];
    itemFloor: any = [];
    itemChannel: any = [];
    constructor(private dialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private _service: Service,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private translocoService: TranslocoService
    ) { 
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit(): void {
        // สร้าง Reactive Form
        this.formData = this.formBuilder.group({
            category_product_id: [''],
            sub_category_product_id: ['', Validators.required],
            name: [''],
            detail: [''],
            // qty: [0],
            sale_price: [0],
            cost: [0],
            type: [''],
            images: [],
            channel_id: [''],
            area_id: [''],
            shelve_id: [''],
            floor_id: [''],
            more_address: [''],
            min: [0],
            max: [0],
            supplier_id: [''],
            stock_status: [0],
            products: this.formBuilder.array([]),
        });
        this.uploadPic = this.formBuilder.group({
            image: '',
            path: 'images/asset/',
        });
    
        this._service.getCategories().subscribe((resp) => {
            this.CategoryData = resp.data;
        });
        this._service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
        this._service.getArea().subscribe((resp) => {
            this.itemArea = resp.data;
        });
        this._service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
        this._service.getUnit().subscribe((resp) => {
            this.Unit = resp.data;
            this.maxProductsLength = this.Unit.length;
        });

    }
    itemData: any;
    onchange(event: any, i) {
        this.itemData = this.itemArea.find((item) => item.id === event.value);
        this.itemShelve[i] = this.itemData.shelfs;
        console.log(this.itemShelve);
    }
    onSaveClick(): void {
        this.flashMessage = null;
        // this.flashErrorMessage = null;
        // Return if the form is invalid
        if (this.addForm.invalid) {
            this.addForm.enable();
            this._fuseConfirmationService.open({
                "title": "กรุณาระบุข้อมูล",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation",
                    "color": "warning"
                },
                "actions": {
                    "confirm": {
                        "show": false,
                        "label": "ยืนยัน",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": false,
                        "label": "ยกเลิก",

                    }
                },
                "dismissible": true
            });

            return;
        }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "เพิ่มข้อมูล",
            "message": "คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const updatedData = this.addForm.value;
                this._service.create(updatedData).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this.dialogRef.close(resp);
                    },
                    error: (err: any) => {
                        this.addForm.enable();
                        this._fuseConfirmationService.open({
                            "title": "กรุณาระบุข้อมูล",
                            "message": err.error.message,
                            "icon": {
                                "show": true,
                                "name": "heroicons_outline:exclamation",
                                "color": "warning"
                            },
                            "actions": {
                                "confirm": {
                                    "show": false,
                                    "label": "ยืนยัน",
                                    "color": "primary"
                                },
                                "cancel": {
                                    "show": false,
                                    "label": "ยกเลิก",

                                }
                            },
                            "dismissible": true
                        });
                    }
                })
            }
        })


        // แสดง Snackbar ข้อความ "complete"

    }
    somethingChanged(event: any): void {
        const selectedCategoryId = event.value;

        // Assuming you have a service method to fetch sub-categories based on the selected category
        this._service.getSubCategories(selectedCategoryId).subscribe((resp) => {
            this.SubCategoryData = resp.data;
        });
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }) {
        this.files.push(...event.addedFiles);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }
    onSelects(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);

        this.uploadPic.patchValue({
            image: this.files[0],
        });
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(([key, value]: any[]) => {
            formData.append(key, value);
        });
        this._service.uploadImg(formData).subscribe((resp) => {
            console.log(resp, 'img');
            this.formData.patchValue({
                images: resp,
            });
            console.log(this.formData.value);
        });
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            images: '',
        });
        console.log(this.formData.value);
    }


    onCancelClick(): void {

        this.dialogRef.close();
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    onShelfSelected(event: any, i): void {
        this.selectedShelfId = event.value;
        console.log('selectshelf', this.selectedShelfId);
        this._service.getFloor(this.selectedShelfId).subscribe((resp) => {
            this.itemFloor[i] = resp.data;
            console.log('itemfloor', this.itemFloor);
        });
    }

    onfloorSelected(event: any, i): void {
        const selectedfloorId = event.value;
        console.log('selectfloor', selectedfloorId);

        this._service
            .getChannel(this.selectedShelfId, selectedfloorId)
            .subscribe((resp) => {
                this.itemChannel[i] = resp.data;
                console.log('itemchannel', this.itemChannel);
            });
    }

    get products() {
        return this.formData.get('products') as FormArray;
    }

    addRow(data: any) {
        const value = this.formBuilder.group({
            qty: '', //จำนวน
            unit_id: '', //หน่วยนับ
            area_id: [''], //โรงเก็บ
            shelve_id: [''], //ตู้เก็บของ
            floor_id: [''],  //ช่องเก็บของ
            channel_id: [''], //ชั้นเก็บของ
            type: [''], //รูปแบบสินค้า
            lot: [''], //เลขล็อต
        });

        this.products.push(value);
    }

    isUnitAlreadySelected(unitId: string, currentIndex: number): boolean {
        for (let i = 0; i < this.products.length; i++) {
            const isCurrentRow = i === currentIndex;
            const selectedUnitId =
                this.products.controls[i].get('unit_id').value;

            if (selectedUnitId === unitId && !isCurrentRow) {
                return true;
            }
        }

        return false;
    }

    removeRow(index: number) {
        this.products.removeAt(index);
    }

    Submit(): void {
        if(this.langues=='tr'){
            console.log(this.formData.value);
            const confirmation = this._fuseConfirmationService.open({
                title: 'เพิ่มข้อมูล',
                message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.Savedata(this.formData.value).subscribe({
                        next: (resp: any) => {
                            this.dialogRef.close(resp)
                        },
    
                        error: (err: any) => {
                            console.log(err);
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ตกลง',
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
            console.log(this.formData.value);
        }
        else if(this.langues=='en'){
            console.log(this.formData.value);
            const confirmation = this._fuseConfirmationService.open({
                title: 'Add data',
                message: 'Do you want to add data or not ?',
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
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._service.Savedata(this.formData.value).subscribe({
                        next: (resp: any) => {
                            this.dialogRef.close(resp)
                        },
    
                        error: (err: any) => {
                            console.log(err);
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'Error',
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
            console.log(this.formData.value);
        }
 

        
    }

    
  

    onRemoveimg(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            images: '',
        });
    }

 
}
