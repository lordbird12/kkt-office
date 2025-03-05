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
import { Observable, map, startWith } from 'rxjs';
import { PageService } from '../page.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'edit-factory',
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
        MatAutocompleteModule,
        CommonModule,
        TranslocoModule
    ],
})
export class EditComponent {
    addForm: FormGroup;
    editForm: FormGroup;
    ProductControl = new FormControl('');
    Category = new FormControl('');
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
    filteredOptionsProduct: Observable<string[]>;
    selectedProduct: string = '';
    productData: any[] = [];
    itemData: any;
    Raws:  any[] = [];
    categoryData:  any[] = [];
    unitData:  any[] = [];
    filteredOptions: Observable<{ id: string; name: string; }[]>[] = [];
    Id: any;
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

        this.editForm = this._formBuilder.group({
            date: '',
            // product_id: '',
            // qty: '',
            detail: '',
            products: this._formBuilder.array([]),
            raws: this._formBuilder.array([])
        })
        this._service.getUnit().subscribe((resp: any) => {
            this.unitData = resp.data;
        });
 
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
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            // this.Raws = this.itemData?.raws ?? []
            // console.log(this.Raws)
            this.ProductControl.setValue(this.itemData.product?.name)
            this.Category.setValue(this.itemData.product?.category_product_id)
     
            this.editForm.patchValue({
                ...this.itemData,
            });
            // this.Raws.forEach((data:any)=>{
            //     const a = this._formBuilder.group({
            //         product_id: data.raw_id,
            //         remark_qty: data.qty,
            //         product_name: data.product.name,
            //         stock_status: data.product.stock_status
            //     });
            //     this.raws.push(a);
            // })
            this._changeDetectorRef.detectChanges();
        });
    }

    get products() {
        return this.editForm.get('products') as FormArray;
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
    }
}
    // changeCategory(id : any) {
    //     this.GetProduct();
    //     this.productData = this.productData.filter(item => item.category_product_id === id)
    //     console.log('id', this.productData);

    // }

    get raws() {

        return this.editForm.get('raws') as FormArray;

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



    // GetProduct(): void {
    //     this._service.getProduct().subscribe((resp) => {
    //         this.productData = resp.data;
    //     });
    // }


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
                    let formValue = this.editForm.value;
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('admin/factories/list').then(() => {});
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
                    let formValue = this.editForm.value;
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('admin/factories/list').then(() => {});
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


}
