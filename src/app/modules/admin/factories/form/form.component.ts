import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass } from '@angular/common';
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
import { Observable, map, startWith } from 'rxjs';
import { PageService } from '../page.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { FormDialogComponent } from '../../product/form-dialog/form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormUnitDialogComponent } from '../../unit/form-dialog/form-dialog.component';
import { UnitProductComponent } from '../../unit/unit-product/form-dialog.component';

@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
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
        MatSelectModule,
        TranslocoModule
    ],
})
export class FormComponent {
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
    categoryData: any[] = [];
    unitData: any[] = [];
    productFilter: any[] = [];
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
        private dialog: MatDialog,
        private translocoService: TranslocoService

    ) {
        this.addForm = this._formBuilder.group({
            date: '',
            qty: '',
            detail: '',
            raws: this._formBuilder.array([]),
            products: this._formBuilder.array([]),
        });

        this._service.getCategories().subscribe((resp: any) => {
            this.categoryData = resp.data;
        });
        // this._service.getUnit().subscribe((resp: any) => {
        //     this.unitData = resp.data;
        // });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit(): void {
        this.GetProduct();
        this.filteredOptions[0] = this.ProductControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterProduct(value || ''))
        );
    }
    // clearProductSelection(index:any) {
    //     console.log(this.selectedProduct, 'selectedproduct');
    //     this.ProductControl.setValue(null); // Clear the FormControl
    //     this.selectedProduct = ''; // Clear the selected product
    //     console.log(this.selectedProduct, 'selectedproduct');
    //     // Clear the filtered options in the mat-autocomplete
    //     this.filteredOptions[index] = this.ProductControl.valueChanges.pipe(
    //         startWith(''),
    //         map((value) => this._filterProduct(value || ''))
    //     );
    // }
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
        this.filteredOptions[index] = productControl.valueChanges
          .pipe(
              startWith(''),
              map(value => this._filterProduct(value))
          );
    }


    removeRow(index: number) {
        this.products.removeAt(index);
    }
    changeCategory(id: any,index:any) {
        this.GetProduct();
        this.productFilter = this.productData.filter(
            (item) => item.category_product_id === id
        );

        console.log(this.productData,'productfilter')
        this.filteredOptions[index] = this.ProductControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterProduct(value || ''))
        );
    }

    get raws() {
        return this.addForm.get('raws') as FormArray;
    }

    addRaw() {}

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
            (state) => state.name === parseInt(subject)
        );
        return index !== -1 ? this.productData[index].name : '';
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

onSelectProduct(event: any, index: number, data:any) {

    if(event.option.value === 0) {
        this.ProductAdd(index, data)
    }


    const selectedName = event.option.value;
    const selectedProduct = this.productData.find(product => product.name === selectedName);
    console.log(selectedProduct);
    
    if (selectedProduct) {
        // Update the product_name in the formArray at the specified index
        const productFormGroup = this.products.at(index) as FormGroup;
        productFormGroup.patchValue({
            product_name: selectedProduct.name,
            product_id: selectedProduct.id
        });
        console.log(this.addForm.value);
        this.unitdata[index] = selectedProduct.units
    }
}



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    backTo() {
        this._router.navigate(['admin/factories/list']);
    }

    onSubmit(): void {
        if(this.langues=='tr'){
            console.log('data', this.addForm.value);
            // return;
            const datePipe = new DatePipe("en-US");
    
            const date = datePipe.transform(
              this.addForm.value.date,
              "YYYY-MM-dd"
            );
    
            this.addForm.patchValue({
              date: date,
            });
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
                if (result === 'confirmed') {
    
                    // formValue.product_id = this.ProductControl.value;
    
    
    
                    this._service.create(this.addForm.value).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/factories/list')
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
        else if(this.langues=='en'){
            console.log('data', this.addForm.value);
            // return;
            const datePipe = new DatePipe("en-US");
    
            const date = datePipe.transform(
              this.addForm.value.date,
              "YYYY-MM-dd"
            );
    
            this.addForm.patchValue({
              date: date,
            });
            const dialogRef = this._fuseConfirmationService.open({
                title: 'Save data',
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
                if (result === 'confirmed') {
    
                    // formValue.product_id = this.ProductControl.value;
    
    
    
                    this._service.create(this.addForm.value).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/factories/list')
                                .then(() => {});
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
                            // console.log(err.error.message)
                        },
                    });
                }
            });
        }



    }

    changeData() {}
    ProductAdd(i,data): void {
        this.dialog
            .open(FormDialogComponent, {
                width: '80%',
                height: '90%',
                autoFocus: false,
             
            })
            .afterClosed()
            .subscribe((foundItem) => {
                if(foundItem) {
                    console.log('data', foundItem);
            data.patchValue({
                cost: 100,
                price: 0,
                qty: 0,
                unit_id: '',
            });

            const productFormGroup = this.products.at(i) as FormGroup;
            productFormGroup.patchValue({
                product_name: foundItem.name,
                product_id: foundItem.id,
            });
            this.unitdata[i] = foundItem.units;
            console.log(this.unitdata[i]);
                }
            });
    }

    UnitAdd(i,data): void {
        this.dialog
            .open(UnitProductComponent, {
                width: '40%',
                height: 'auto',
                autoFocus: false,
                data: data.value
             
            })
            .afterClosed()
            .subscribe((foundItem) => {
                if(foundItem) {

                    
                }
            });
    }
}
