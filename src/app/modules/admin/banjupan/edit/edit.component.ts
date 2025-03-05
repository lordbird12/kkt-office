import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
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
import { Subscription, forkJoin, lastValueFrom } from 'rxjs';
import { categories } from 'app/mock-api/apps/ecommerce/inventory/data';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

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
        public activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private translocoService: TranslocoService

    ) {
        this.formData = this._formBuilder.group({
            id: '',
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
            more_address: [''],
            floor_id: [''],
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
        this.formRaw = this._formBuilder.group({
            product_id: '',
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

    addRow(data: any) {
        const value = this._formBuilder.group({
            qty: '',
            unit_id: '',
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
        const resp = await lastValueFrom(
            forkJoin({
                category: this._Service.getCategories(),
                itemsupplier: this._Service.getSuppliers(),
                itemarea: this._Service.getArea(),
                unit: this._Service.getUnit(),
            })
        );
        this.CategoryData = resp.category.data;
        this.itemSupplier = resp.itemsupplier.data;
        this.itemArea = resp.itemarea.data;
        this.Unit = resp.unit.data;
        this.maxProductsLength = this.Unit.length;
        console.log(this.itemArea);
        this.itemArea.shelf = this.itemArea[0].shelfs;
        // this._Service.getShelf().subscribe((resp) => {
        //     this.itemShelve = resp.data;
        // });
        this.activatedRoute.params.subscribe(async (params) => {
            console.log(params);
            const id = params.id;

            try {
                const itemResponse = await this._Service
                    .getById(id)
                    .toPromise();
                this.item = itemResponse;

                console.log(this.item);
                const selectedCategoryId = this.item.category_product_id;
                const selectedShelf = this.item.shelve_id;
                const selectedFloor = this.item.floor_id;
                // Assuming you have a service method to fetch sub-categories based on the selected category
                const resp = await lastValueFrom(
                    forkJoin({
                        subcategory:
                            this._Service.getSubCategories(selectedCategoryId),
                        shelf: this._Service.getChannel(
                            selectedShelf,
                            selectedFloor
                        ),
                        floor: this._Service.getFloor(selectedShelf),
                    })
                );
                this.SubCategoryData = resp.subcategory.data;
                this.itemFloor = resp.floor.data;
                this.itemChannel = resp.shelf.data;

                this.formData.patchValue({
                    ...this.item,
                    category_product_id: +this.item.category_product_id,
                    sub_category_product_id: +this.item.sub_category_product_id,
                    supplier_id: +this.item.supplier_id,
                    area_id: +this.item.area_id,
                    shelve_id: +this.item.shelve_id,
                    floor_id: +this.item.floor_id,
                    channel_id: +this.item.channel_id,
                    stock_status: +this.item.stock_status,
                    more_address: this.item.more_address,
                    image: '',
                });
                this.item.product_units.forEach((element) => {
                    console.log(element, 'element');
                    let unitIdNumber = Number(element.unit_id);
                    const a = this._formBuilder.group({
                        qty: element.qty,
                        unit_id: unitIdNumber,
                        area_id: element?.area_id,
                        shelve_id: element?.shelve_id,
                        floor_id: element?.floor_id,
                        channel_id: element?.channel_id,
                        type: element?.type,
                        lot: element?.lot,
                    });
                    this.products.push(a);
                });
                this._changeDetectorRef.detectChanges();
                this.formRaw.patchValue({
                    product_id: id,
                });
                if (this.item.raws) {
                    this.item.raws.forEach((element) => {
                        const a = this._formBuilder.group({
                            product_id: +element.product.id,
                            qty: element.qty,
                            detail: element.detail,
                        });
                        this.raws.push(a);
                    });
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        });

        // this.activatedRoute.params.subscribe((params) => {
        //     // console.log(params);
        //     const id = params.id;
        //     this._Service.getById(id).subscribe((resp: any) => {
        //         this.item = resp;
        //         this.formData.patchValue({
        //             ...this.item,
        //         });
        //     });
        // });
    }

    get raws() {
        return this.formRaw.get('raws') as FormArray;
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
    ngAfterViewInit(): void {}

    onchange(event: any) {
        this.itemShelve = this.itemArea.filter((item) => item.id === event);
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
    onShelfSelected(event: any): void {
        this.selectedShelfId = event.value;
        console.log('selectshelf', this.selectedShelfId);
        this._Service.getFloor(this.selectedShelfId).subscribe((resp) => {
            this.itemFloor = resp.data;
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
    onfloorSelected(event: any): void {
        const selectedfloorId = event.value;
        console.log('selectfloor', selectedfloorId);

        this._Service
            .getChannel(this.selectedShelfId, selectedfloorId)
            .subscribe((resp) => {
                this.itemChannel = resp.data;
                console.log('itemchannel', this.itemChannel);
            });
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
        const file = this.files[0];

        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);

        // this.formData.patchValue({
        //     images: file,
        // });
    }
    Cancel(): void {
        this._router.navigateByUrl('admin/banjupan/list').then(() => {});
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
    //                         .navigateByUrl('admin/banjupan/list')
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
    //                         .navigateByUrl('admin/banjupan/list')
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
        if(this.langues=='tr'){
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
                    this._Service.Updatedata(this.formData.value).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/banjupan/list')
                                .then(() => {});
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
        else if(this.langues=='en'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'Edit data',
                message: 'Do you want to edit the data ?',
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
                    this._Service.Updatedata(this.formData.value).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/banjupan/list')
                                .then(() => {});
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


    RawSubmit(): void {
        if(this.langues=='tr'){
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
                    this._Service.Updatedata(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/banjupan/list')
                                .then(() => {});
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
                        },
                    });
                }
            });
        }
        else if(this.langues=='en'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'Edit data',
                message: 'Do you want to edit the data ?',
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
                    const formValue = this.formRaw.value;
                    this._Service.Updatedata(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/banjupan/list')
                                .then(() => {});
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
                        },
                    });
                }
            });
        }
       

    }

}
