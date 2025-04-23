import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
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
import { Subscription, forkJoin, lastValueFrom } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment.development';

@Component({
    selector: 'edit-product',
    templateUrl: './edit.component.html',
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
        CommonModule,
        NgxDropzoneModule,
        TranslocoModule
    ],
})
export class EditComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    item1Data: any = [];
    item2Data: any = [];
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
    itemArea: any = [];
    itemShelve: any = [];
    itemFloor: any = [];
    itemChannel: any = [];

    selectedShelfId: any;

    formData: FormGroup;
    formRaw: FormGroup;
    CategoryData: [];
    SubCategoryData: any = [];
    warehouseData: any;
    ShelfSubscription: Subscription;
    Id: any;
    item: any;
    productData: any = [];
    maxProductsLength: number;
    uploadPic: FormGroup;
    Unit: any = [];
    Lines: any[] = [];
    images: any[] = [];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: Service,
        private _router: Router,
        public activatedRoute: ActivatedRoute,
        translocoService: TranslocoService

    ) {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.Id = this.activatedRoute.snapshot.paramMap.get('id');
        this.formData = this._formBuilder.group({
            id: '',
            category_product_id: [''],
            sub_category_product_id: ['', Validators.required],
            name: [''],
            detail: [''],
            sale_price: [0],
            cost: [0],
            type: [''],
            channel_id: [''],
            area_id: [''],
            shelve_id: [''],
            more_address: [''],
            floor_id: [''],
            min: [0],
            max: [0],
            supplier_id: [''],
            stock_status: [0],
            products: this._formBuilder.array([]),
            images: this._formBuilder.array([]) // เริ่มว่าง
        });
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/asset/',
        });
        this.formRaw = this._formBuilder.group({
            product_id: id,
            raws: this._formBuilder.array([]),
        });
        this._Service.getProduct().subscribe((resp: any) => {
            this.productData = resp.data.filter((item) => item.type === 'Raw');
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    get products() {
        return this.formData.get('products') as FormArray;
    }

    addRow() {
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

    removeRow(index: number) {
        this.products.removeAt(index);
    }
    async ngOnInit(): Promise<void> {
        try {
            // Load initial data
            const initResp = await lastValueFrom(
                forkJoin({
                    category: this._Service.getCategories(),
                    itemsupplier: this._Service.getSuppliers(),
                    itemarea: this._Service.getArea(),
                    unit: this._Service.getUnit(),
                })
            );

            this.CategoryData = initResp.category.data;
            this.itemSupplier = initResp.itemsupplier.data;
            this.itemArea = initResp.itemarea.data;
            this.Unit = initResp.unit.data;
            this.maxProductsLength = this.Unit.length;

            // this.itemArea[0].shelfs หรือ field ในตัว array item ต้องชัดเจนว่าเอาอะไร
            //   if (this.itemArea?.length > 0) {
            //     this.itemArea[0].shelf = this.itemArea[0].shelfs; // ถ้าจะใช้งานแบบนี้
            //   }

            this.activatedRoute.params.subscribe(async (params) => {
                const id = params.id;
                if (!id) return;

                try {
                    // Load item by ID
                    this.item = await this._Service.getById(id).toPromise();

                    const selectedCategoryId = this.item.category_product_id;

                    const subResp = await lastValueFrom(
                        forkJoin({
                            subcategory: this._Service.getSubCategories(selectedCategoryId),
                        })
                    );
                    this.SubCategoryData = subResp.subcategory.data;
                    // this.images = this.item?.images
                    this.item?.images.forEach((img) => {
                        const imageUrl = img.image;
                        const parts = imageUrl.split('/images/');
                        if (parts.length > 1) {
                            this.images.push('images/' + parts[1]);
                        }
                    });
                    // Set main form
                    this.formData.patchValue({
                        ...this.item,
                        category_product_id: +this.item?.category_product_id,
                        sub_category_product_id: +this.item?.sub_category_product_id,
                        supplier_id: +this.item?.supplier_id,
                        // area_id: +this.item?.area?.id,
                        // shelve_id: +this.item?.shelve_id,
                        // floor_id: +this.item?.floor_id,
                        // channel_id: +this.item?.channel_id,
                        stock_status: +this.item?.stock_status,
                        more_address: this.item?.more_address,
                    });

                    // ดึง FormArray
                    // ดึง path เฉพาะหลัง /images/
                    const imagePaths: string[] = this.item?.images.map(img => '/images/' + img.image.split('/images/')[1]);
                    // แปลงเป็น FormControls
                    const imageFormControls = imagePaths.map(path => this._formBuilder.control(path));

                    // เอา FormArray ใหม่มาใส่
                    this.formData.setControl('images', this._formBuilder.array(imageFormControls));

                    // Process product_units using for...of
                    for (const [i, element] of this.item.product_units.entries()) {
                        const item = {
                            value: element?.area_id ?? null,  // เพิ่มเช็คค่า null หรือ undefined
                            index: i                         // หากต้องการเพิ่ม index ไว้ใช้งาน
                        };
                        console.log(item, 'item');

                        this.onchange(item, i);
                        this._Service.getFloor(+element?.shelve_id).subscribe((resp) => {
                            this.itemFloor[i] = resp.data;
                            console.log('itemfloor', this.itemFloor);
                            this._Service
                                .getChannel(+element?.shelve_id, +element?.floor_id)
                                .subscribe((resp) => {
                                    this.itemChannel[i] = resp.data;
                                    console.log('itemchannel', this.itemChannel);
                                });
                        });


                        const a = this._formBuilder.group({
                            qty: element.qty,
                            unit_id: +element.unit_id,
                            area_id: +element?.area_id,
                            shelve_id: +element?.shelve_id,
                            floor_id: +element?.floor_id,
                            channel_id: +element?.channel_id,
                            type: element?.type,
                            lot: element?.lot,
                        });
                        this.products.push(a);
                    }
                    this._changeDetectorRef.markForCheck();
                    // Patch raw data
                    this.formRaw.patchValue({ product_id: id });
                    for (const element of this.item.raws) {
                        const a = this._formBuilder.group({
                            product_id: +element.product.id,
                            qty: element.qty,
                            detail: element.detail,
                        });
                        this.raws.push(a);
                    }
                    this._changeDetectorRef.markForCheck();

                    console.log(this.formData.value, 'last Form');
                } catch (error) {
                    console.error('An error occurred while loading item:', error);
                }
            });
        } catch (error) {
            console.error('An error occurred while loading initial data:', error);
        }
    }

    get imagesFormArray(): FormArray {
        return this.formData.get('images') as FormArray;
    }
    get raws() {
        return this.formRaw.get('raws') as FormArray;
    }

    onRemoveImagePC(index: number) {
        if (index > -1) {
            this.images.splice(index, 1); // ลบจาก array ธรรมดา
            this.files.splice(index, 1);  // ลบจาก array ธรรมดา

            // ลบจาก FormArray ด้วย
            const imagesFormArray = this.formData.get('images') as FormArray;
            imagesFormArray.removeAt(index);
        }
    }

    addRaw() {
        const a = this._formBuilder.group({
            product_id: '', //ชื่อ unit
            qty: '', //จำนวน
            detail: '', //ราคา
        });
        this.raws.push(a);
    }

    removeArray(i: number): void {
        this.raws.removeAt(i);
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    onchange(event: any, i: number) {
        console.log(event.value);

        const data = this.itemArea.find((item) => item.id === +event.value);
        this.itemShelve[i] = data.shelfs;
        console.log(this.itemShelve);

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    somethingChanged(event: any): void {
        const selectedCategoryId = event.value;
        // Assuming you have a service method to fetch sub-categories based on the selected category
        this._Service.getSubCategories(selectedCategoryId).subscribe((resp) => {
            this.SubCategoryData = resp.data;
        });
    }
    onShelfSelected(event: any, i): void {
        this.selectedShelfId = event.value;
        console.log('selectshelf', this.selectedShelfId);
        this._Service.getFloor(this.selectedShelfId).subscribe((resp) => {
            this.itemFloor[i] = resp.data;
            console.log('itemfloor', this.itemFloor);
        });
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
    onfloorSelected(event: any, i): void {
        const selectedfloorId = event.value;

        this._Service
            .getChannel(this.selectedShelfId, selectedfloorId)
            .subscribe((resp) => {
                this.itemChannel[i] = resp.data;
                console.log('itemchannel', this.itemChannel);
            });
    }
    filesPC: { [key: number]: File } = {}; // แยกไฟล์แต่ละแถว


    onSelect1(event: any) {
        for (let file of event.addedFiles) {
            this.uploadFile(file);
        }
    }
    url_env: string = environment.baseURL + '/'
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            // ตัวอย่างการส่งไปยัง API (เปลี่ยน URL ตาม backend ของคุณ)
            const formData1 = new FormData();
            formData1.append('image', file);
            formData1.append('path', 'images/assets/');
            this._Service.uploadImg(formData1).subscribe((resp) => {

                this.images.push(resp); // อัปเดตรายการ images
                console.log(this.images);
                this._changeDetectorRef.markForCheck();

            })
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }



    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            images: '',
        });
        console.log(this.formData.value);
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
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);

        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);

        // this.formData.patchValue({
        //     images: file,
        // });
    }
    Cancel(): void {
        this._router.navigateByUrl('admin/product/list').then(() => { });
    }


    Submit(): void {
        if (this.langues == 'tr') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'แก้ไขข้อมูล',
                message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
                    formValue.images = this.images
                    this._Service.Updatedata(formValue, this.Id).subscribe({
                        next: () => {
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
                title: 'Edit Data',
                message: 'Do you want to edit the data ?',
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
                    this._Service.Updatedata(this.formData.value, this.Id).subscribe({
                        next: () => {
                            this._router
                                .navigateByUrl('admin/product/list')
                                .then(() => { });
                        },
                        error: (err: any) => {
                            console.log(err);
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'Error occurred',
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

    RawSubmit(): void {
        if (this.langues == 'tr') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'แก้ไขข้อมูล',
                message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
                    const formValue = this.formRaw.value;
                    this._Service.updateRaw(formValue).subscribe({
                        next: () => {
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
                title: 'Edit Data',
                message: 'Do you want to edit the data ?',
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
                    const formValue = this.formRaw.value;
                    this._Service.updateRaw(formValue).subscribe({
                        next: () => {
                            this._router
                                .navigateByUrl('admin/product/list')
                                .then(() => { });
                        },

                        error: (err: any) => {
                            console.log(err);
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'Error occurred',
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






    // Submit(): void {
    //     console.log(this.formData.value);
    //     // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
    //     // console.log(end)
    //     // this.addForm.patchValue({
    //     //   register_date:end
    //     // })
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'แก้ไขข้อมูล',
    //         message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
    //             this._Service.Updatedata(this.formData.value).subscribe({
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

    // RawSubmit(): void {
    //     // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
    //     // console.log(end)
    //     // this.addForm.patchValue({
    //     //   register_date:end
    //     // })
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'แก้ไขข้อมูล',
    //         message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
    //             const formValue = this.formRaw.value;
    //             this._Service.Updatedata(formValue).subscribe({
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
}
