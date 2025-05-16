import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    NgZone,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { Service } from '../page.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { lastValueFrom, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment.development';
@Component({
    selector: 'form-product-product',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        CommonModule,
        NgxDropzoneModule,
        TranslocoModule,
    ],
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    flashMessage: 'success' | 'error' | null = null;
    item1Data: any = [];
    item2Data: any = [];
    itemSupplier: any = [];
    selectedShelfId: any;
    itemArea: any = [];
    maxProductsLength: number;
    uploadPic: FormGroup;
    url_sig: any = [];
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
    Unit: any = [];
    formData: FormGroup;
    CategoryData: any = [];
    SubCategoryData: any = [];
    warehouseData: any;
    ShelfSubscription: Subscription;
    status: string = 'NEW'
    id: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        public location: Location,
        private ngZone: NgZone,
        private translocoService: TranslocoService
    ) {
        this.id = this._activatedRoute.snapshot.params.id
        // console.log(this.id , 'id');

        this.formData = this._formBuilder.group({
            category_product_id: [''],
            sub_category_product_id: ['', Validators.required],
            name: [''],
            detail: [''],
            // qty: [0],
            sale_price: [0],
            cost: [0],
            type: [''],
            images: [],
            video_url: '',
            pdf_file: '',
            pdf_file_name: '',
            panorama_images: [],
            area_id: [''], //โรงเก็บ
            shelve_id: [''], //ตู้เก็บของ
            floor_id: [''],  //ช่องเก็บของ
            channel_id: [''], //ชั้นเก็บของ
            more_address: [''],
            min: [0],
            max: [0],
            supplier_id: [''],
            stock_status: [0],
            products: this._formBuilder.array([]),
        });
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/asset/',
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;


    get products() {
        return this.formData.get('products') as FormArray;
    }

    addRow(data: any) {
        const value = this._formBuilder.group({
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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    ngOnInit() {
        this._Service.getCategories().subscribe((resp) => {
            this.CategoryData = resp.data;
        });
        this._Service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
        this._Service.getArea().subscribe((resp) => {
            this.itemArea = resp.data;
        });
        this._Service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
        this._Service.getUnit().subscribe((resp) => {
            this.Unit = resp.data;
            console.log(this.Unit.length);
            this.maxProductsLength = this.Unit.length;
        });



        // this._Service.getShelf().subscribe((resp) => {
        //     this.itemShelve = resp.data;
        // });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    // somethingChanged(event: any): void {
    //     console.log('event', event.value);
    //     this.item2Data = event.value;
    // }
    somethingChanged(event: any): void {
        const selectedCategoryId = event.value;

        // Assuming you have a service method to fetch sub-categories based on the selected category
        this._Service.getSubCategories(selectedCategoryId).subscribe((resp) => {
            this.SubCategoryData = resp.data;
        });
    }

    itemData: any;
    onchange(event: any, i) {
        this.itemData = this.itemArea.find((item) => item.id === event.value);
        this.itemShelve[i] = this.itemData.shelfs;
        console.log(this.itemData);
    }
    onShelfSelected(event: any, i): void {
        this.selectedShelfId = event.value;
        console.log('selectshelf', this.selectedShelfId);
        this._Service.getFloor(this.selectedShelfId).subscribe((resp) => {
            this.itemFloor[i] = resp.data;
            console.log('itemfloor', this.itemFloor);
        });
    }

    onfloorSelected(event: any, i): void {
        const selectedfloorId = event.value;

        this._Service
            .getChannel(this.selectedShelfId, selectedfloorId)
            .subscribe((resp) => {
                this.itemChannel[i] = resp.data;
                console.log('itemchannel', this.itemChannel);
            });
    }

    onRemoveimg(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            images: '',
        });
    }

    selectedFile: File = null;
    onFileChange(event) {
        this.selectedFile = (event.target as HTMLInputElement).files[0];

        // if (this.selectedFile) {
        //     // ปรับให้เก็บข้อมูลที่คุณต้องการ ในที่นี้เป็นชื่อไฟล์
        //     this.addForm.patchValue({ image: this.selectedFile.name });
        //   }
        // this.addForm.get('image').updateValueAndValidity();
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
        this._Service.uploadImg(formData).subscribe((resp) => {
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
    Cancel(): void {
        this._router.navigateByUrl('admin/product/list').then(() => { });
    }

    // Submit(): void {
    //     console.log(this.formData.value);
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'เพิ่มข้อมูล',
    //         message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
    //         icon: {
    //             show: false,
    //             name: 'heroicons_outline:exclamation',
    //             color: 'warning',
    //         },
    //         actions: {
    //             confirm: {
    //                 show: true,
    //                 label: 'ตกลง',
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
    //         // If the confirm button pressed...
    //         if (result === 'confirmed') {
    //             // const formData = new FormData();
    //             // Object.entries(this.formData.value).forEach(
    //             //     ([key, value]: any[]) => {
    //             //         formData.append(key, value);
    //             //     }
    //             // );

    //             // for (var i = 0; i < this.files.length; i++) {
    //             //     formData.append('images[]', this.files[i]);
    //             // }
    //             this._Service.Savedata(this.formData.value).subscribe({
    //                 next: (resp: any) => {
    //                     this._router
    //                         .navigateByUrl('admin/product/list')
    //                         .then(() => {});
    //                 },

    //                 error: (err: any) => {
    //                     console.log(err);
    //                     this.formData.enable();
    //                     this._fuseConfirmationService.open({
    //                         title: 'เกิดข้อผิดพลาด',
    //                         message: err.error.message,
    //                         icon: {
    //                             show: true,
    //                             name: 'heroicons_outline:exclamation',
    //                             color: 'warning',
    //                         },
    //                         actions: {
    //                             confirm: {
    //                                 show: false,
    //                                 label: 'ตกลง',
    //                                 color: 'primary',
    //                             },
    //                             cancel: {
    //                                 show: false,
    //                                 label: 'ยกเลิก',
    //                             },
    //                         },
    //                         dismissible: true,
    //                     });
    //                     console.log(err.error.message);
    //                 },
    //             });
    //         }
    //     });
    //     console.log(this.formData.value);
    // }


    Submit(): void {
        if (this.langues == 'tr') {
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
                    let formValue = this.formData.value
                    // formValue.panorama_images = this.images
                    formValue.pdf_file = this.pdf_files
                    formValue.images = this.images
                    this._Service.Savedata(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/product/list')
                                .then(() => { });
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
        }
        else if (this.langues == 'en') {

            const confirmation = this._fuseConfirmationService.open({
                title: 'Add data',
                message: 'Do you want to add data ?',
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
                    let formValue = this.formData.value
                    formValue.panorama_images = this.images
                    formValue.images = this.images
                    this._Service.Savedata(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/product/list')
                                .then(() => { });
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
        }

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

    filesPC: { [key: number]: File } = {}; // แยกไฟล์แต่ละแถว


    pdf_files: string[] = [];
    images: string[] = [];

    onSelect1(event: any) {
        for (let file of event.addedFiles) {
            this.uploadFile(file);
        }
    }

    url_env: string = environment.baseURL + '/';

    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const formData1 = new FormData();
            formData1.append('image', file);
            formData1.append('path', 'images/assets/');

            this._Service.uploadImg(formData1).subscribe((resp) => {
                // ตรวจสอบ MIME type
                if (file.type === 'application/pdf') {
                    this.pdf_files.push(resp);
                    console.log(this.pdf_files);
                    
                } else if (file.type.startsWith('image/')) {
                    this.images.push(resp);
                } else {
                    console.warn('ไม่รองรับไฟล์ประเภทนี้:', file.type);
                }

                console.log('Images:', this.images);
                console.log('PDFs:', this.pdf_files);
                this._changeDetectorRef.markForCheck();
            });

        } catch (error) {
            console.error('Upload failed:', error);
        }
    }


    filesPDF: File[] = [];

    onSelectPDF(event: any) {
        for (let file of event.addedFiles) {
            this.filesPDF.push(...event.addedFiles);
            this.uploadFilePdf(file);
        }
    }



    async uploadFilePdf(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const formData1 = new FormData();
            formData1.append('file', file);
            formData1.append('path', 'file/assets/');

            this._Service.uploadFile(formData1).subscribe((resp) => {
                // ตรวจสอบ MIME type
                if (file.type === 'application/pdf') {
                    this.pdf_files.push(resp);
                    console.log(this.pdf_files);
                    
                } else if (file.type.startsWith('image/')) {
                    this.images.push(resp);
                } else {
                    console.warn('ไม่รองรับไฟล์ประเภทนี้:', file.type);
                }

                console.log('Images:', this.images);
                console.log('PDFs:', this.pdf_files);
                this._changeDetectorRef.markForCheck();
            });

        } catch (error) {
            console.error('Upload failed:', error);
        }
    }


    onRemoveImagePC(index: number) {
        if (index > -1) {
            this.images.splice(index, 1); // ลบรูปออกจาก images[]
            this.files.splice(index, 1);  // ลบไฟล์ออกจาก files[]
        }
    }
    onRemovePDF(index: number) {
        if (index > -1) {
            this.filesPDF.splice(index, 1);  // ลบไฟล์ออกจาก files[]
        }
    }

    selectedFileName: string | null = null;

    async onFileSelected(fileList: FileList | null): Promise<void> {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            this.selectedFileName = file.name;
            this.formData.get('pdf_file_name')?.setValue(file.name); // อัปเดตชื่อไฟล์ลง form control
            const formData1 = new FormData();
            formData1.append('file', file);
            formData1.append('path', 'file/');
            this._Service.uploadFile(formData1).subscribe((resp: any) => {
                const filePath = resp.path; // หรือ resp.data.path ถ้าอยู่ใน data
                console.log('Uploaded file path:', filePath);
                this.formData.patchValue({
                    pdf_file: filePath
                })
            });
        }
    }




}
