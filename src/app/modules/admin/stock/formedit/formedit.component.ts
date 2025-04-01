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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, forkJoin, lastValueFrom, map, startWith } from 'rxjs';
import { PageService } from '../page.service';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'formedit-product',
    templateUrl: './formedit.component.html',
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
        MatAutocompleteModule,
        CommonModule,
        TranslocoModule
    ],
})
export class FormeditComponent {
    addForm: FormGroup;
    ProductControl = new FormControl('');
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
    filteredOptions: Observable<{ id: string; name: string; }[]>[] = [];
    selectedProduct: string = '';
    productData: any[] = [];
    itemData: any;
    Id: any;
    productFilter: any[] = [];
    Lines: any[] = [];
    order: any[] = [];
    category: any[] = [];
    unitdata: any[] = [];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _activatedRoute: ActivatedRoute,
        private translocoService: TranslocoService

    ) {
        this.addForm = this._formBuilder.group({
            id: '',
            date: new Date(),
            order_id: '',
            remark: '',
            type: '',
            source: '',
            products: this._formBuilder.array([]),
        });
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    async ngOnInit(): Promise<void> {
        const initialData = await lastValueFrom(
            forkJoin(
                this._service.getOrder(),
                this._service.getCategories(),
                this._service.getProduct()
            )
        );
        this.order = initialData[0].data;
        this.category = initialData[1].data;
        this.productData = initialData[2].data;
        this.filteredOptions[0] = this.ProductControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterProduct(value || ''))
        );
        if (this.Id) {
            this._service.getById(this.Id).subscribe((resp: any) => {
                this.itemData = resp.data;
                this.Lines = this.itemData.stock_lines;
                // console.log('Line',this.Lines);
                let order = Number(this.itemData.order_id);
                this.ProductControl.setValue(this.itemData.product?.name);
                this.addForm.patchValue({
                    ...this.itemData,
                    order_id: order,
                });
                let i = 0;
                for (const data of this.Lines) {
                    const selectedProduct = this.productData.find(product => product.id === +data.product_id)
                    const productControl = new FormControl(selectedProduct.name); // ใช้ selectedProduct.name แทนที่จะเป็น new FormControl('')
                    const a = this._formBuilder.group({
                        type: data.product?.type,
                        product_id: +data.product_id,
                        product_name: productControl,
                        qty: data.qty,
                        unit_id: +data.unit_id,
                    });
                    this.products.push(a);


                    this.setupFilteredOptions(this.products.controls.length - 1, productControl);
                    this.unitdata[i] = selectedProduct.units
                    console.log(this.unitdata[i], 'unit')
                    i++;
                }
                this._changeDetectorRef.detectChanges();
            });
        }

    }
    get products() {
        return this.addForm.get('products') as FormArray;
    }
    addRow(data: any) {
        const productControl = new FormControl('');
        const value = this._formBuilder.group({
            type: '',
            product_id: '',
            product_name: productControl,
            qty: '',
            unit_id: '',
        });

        this.products.push(value);
        this.setupFilteredOptions(this.products.controls.length - 1, productControl);
    }

    setupFilteredOptions(index: number, productControl: FormControl) {
        console.log(index)
        this.filteredOptions[index] = productControl.valueChanges
          .pipe(
              startWith(''),
              map(value => this._filterProduct(value))
          );
    }

    removeRow(index: number) {
        this.products.removeAt(index);
    }


    GetProduct(): void {
        this._service.getProduct().subscribe((resp) => {
            this.productData = resp.data;
        });
    }

    private _filterProduct(value: string): { id: string; name: string }[] {
        const filterValue = value.toLowerCase();
        return this.productData.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    onSelectProduct(event: any, index: number) {
        const selectedName = event.option.value;
        const selectedProduct = this.productData.find(product => product.name === selectedName);
        if (selectedProduct) {
            // Update the product_name in the formArray at the specified index
            const productFormGroup = this.products.at(index) as FormGroup;
            productFormGroup.patchValue({
                product_name: selectedProduct.name,
                product_id: selectedProduct.id
            });
            this.unitdata[index] = selectedProduct.units
        }
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    displayProduct(subject) {
        if (!subject) return '';
        let index = this.productData.findIndex(
            (state) => state.id === parseInt(subject)
        );
        return this.productData[index].name;
    }

    // GetProduct(): void {
    //     this._service.getProduct().subscribe((resp) => {
    //         this.productData = resp.data;
    //     });
    // }


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.productData.filter(
            (product) =>
                product.product_id
                    .toString()
                    .toLowerCase()
                    .includes(filterValue) ||
                product.qty.toLowerCase().includes(filterValue)
        );
    }


    somethingChanged(event: any): void {
        const selectedCategoryId = event.value;
        this._service
            .getProductFiltter(selectedCategoryId)
            .subscribe((resp) => {
                console.log(resp);
                this.productData = resp.data;
                // this.SubCategoryData = resp.data;
            });
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    backTo() {
        this._router.navigate(['admin/in-out/list']);
    }

    onSubmit(): void {
        if(this.langues=='tr'){
            if (this.Id) {
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'แก้ไขข้อมูล',
                    message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.updateinout(this.Id, formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
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
            } else {
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'บันทึกข้อมูล',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
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
                    if (result === 'confirmed' && !this.Id) {
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.create(formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
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
                    } else {
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.update_stock(formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
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
        }
        else if(this.langues=='en'){
            if (this.Id) {
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Edit Data',
                    message: 'Do you want to edit the data ?',
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation-triangle',
                        color: 'accent',
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
    
                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.updateinout(this.Id, formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
                            },
                            error: (err: any) => {
                                this._fuseConfirmationService.open({
                                    title: 'Please specify',
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
                                // console.log(err.error.message)
                            },
                        });
                    }
                });
            } else {
                const dialogRef = this._fuseConfirmationService.open({
                    title: 'Save Data',
                    message: 'Do you want to save the data ?',
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation-triangle',
                        color: 'accent',
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
    
                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed' && !this.Id) {
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.create(formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
                            },
                            error: (err: any) => {
                                this._fuseConfirmationService.open({
                                    title: 'Please specify',
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
                    } else {
                        let formValue = this.addForm.value;
                        formValue.date = moment(formValue.date).format(
                            'YYYY-MM-DD'
                        );
                        this._service.update_stock(formValue).subscribe({
                            next: (resp: any) => {
                                this._router
                                    .navigateByUrl('admin/in-out/list')
                                    .then(() => {});
                            },
                            error: (err: any) => {
                                this._fuseConfirmationService.open({
                                    title: 'Please specify',
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
                                // console.log(err.error.message)
                            },
                        });
                    }
                });
            }
        }


    
    }

    changeData() {}
}
