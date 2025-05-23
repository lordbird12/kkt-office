import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, Location, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { PageService } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormDialogComponent } from '../../product/form-dialog/form-dialog.component';
import { FormUnitDialogComponent } from '../../unit/form-dialog/form-dialog.component';
import { UnitProductComponent } from '../../unit/unit-product/form-dialog.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UpdateDialogComponent } from '../update-status/update-dialog.component';
@Component({
    selector: 'view-order',
    templateUrl: './view.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule,
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
        TranslocoModule,
        MatDialogModule
    ],
})
export class ViewOrderComponent {
    status: string = 'NEW'
    statusOrder: any[] = [
        { value: 'Ordered', name: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'Approve', name: 'อนุมัติ', color: 'bg-green-100 text-green-800' },
        { value: 'WaitConfirmPay', name: 'รอตรวจสอบชำระเงิน', color: 'bg-blue-100 text-blue-800' },
        { value: 'ConfirmPay', name: 'ชำระเงินแล้ว', color: 'bg-green-100 text-green-800' },
        { value: 'Recived', name: 'รอจัดส่ง', color: 'bg-blue-100 text-blue-800' },
        { value: 'Finish', name: 'จัดส่ง', color: 'bg-indigo-100 text-indigo-800' },
        { value: 'ToClient', name: 'ได้รับสินค้า', color: 'bg-teal-100 text-teal-800' },
        { value: 'Cancel', name: 'ยกเลิก', color: 'bg-red-100 text-red-800' },
    ];
    addForm: FormGroup;
    ProductControl = new FormControl('');
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    filteredOptionsProduct: Observable<string[]>;
    selectedProduct: string = '';
    productData: any[] = [];
    unitdata: any[] = [];
    filteredOptions: Observable<{ id: string; name: string }[]>[] = [];
    id: any
    promotion: any
    itemData: any = {};
    promotionStatus : boolean = false
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
        private dialog: MatDialog,
        public location: Location,
        private translocoService: TranslocoService

    ) {
        this.unitdata = this._activatedRoute.snapshot.data.units.data
        this.id = this._activatedRoute.snapshot.params.id;
        if (this.id) {
            this._service.getById(this.id).subscribe((resp: any) => {
                this.status = 'EDIT'
                this.itemData = resp.data;
                const orderLists = this.itemData?.order_lists || [];

                const itemWithPromotion = orderLists.find(item => item.promotion_id != null);
              
                if (itemWithPromotion) {
                  const promotionId = itemWithPromotion.promotion_id;
                  this._service.getPromotion(promotionId).subscribe((resp:any) => {
                    this.promotionStatus = true
                    this.promotion = resp.data
                    this._changeDetectorRef.markForCheck()
                  })
                  
                }
                this.addForm.patchValue({
                    date: this.itemData?.date,
                    total_price: this.itemData?.total_price,
                    client_name: this.itemData?.client?.name,
                    client_phone: this.itemData?.client?.phone,
                    client_email: this.itemData?.client?.email,
                })

                if (this.itemData?.order_lists.length > 0) {
                    for (let index = 0; index < this.itemData.order_lists.length; index++) {
                        const element = this.itemData.order_lists[index];
                        const a = this._formBuilder.group({
                            product_id: element?.product_id,
                            qty: element?.qty,
                            cost: element?.cost,
                            price: element?.price,
                            product_name: element?.product?.name,
                            unit_id: '',
                        });
                        this.products.push(a);
                    }
                }
                this._changeDetectorRef.markForCheck()
            })
        }


        this.addForm = this._formBuilder.group({
            date: '',
            total_price: '',
            client_name: '',
            client_phone: '',
            client_email: '',
            products: this._formBuilder.array([]),
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit(): void {

        if (this.status === 'EDIT') {
            this.addForm.patchValue({
                date: this.itemData?.date,
                total_price: this.itemData?.total_price,
                client_name: this.itemData?.clent?.name,
                client_phone: this.itemData?.phone,
                client_email: this.itemData?.email,
            })

            if (this.itemData.order_lists.length > 0) {
                for (let index = 0; index < this.itemData.order_lists.length; index++) {
                    const element = this.itemData.order_lists[index];
                    const a = this._formBuilder.group({
                        product_id: '', //ชื่อ unit
                        qty: element?.qty,
                        cost: element?.cost,
                        price: element?.price,
                        product_name: element?.product?.name,
                        unit_id: '',
                    });
                    this.products.push(a);
                }
            }
        }

        this.GetProduct();
        this.filteredOptions[0] = this.ProductControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterProduct(value || ''))
        );
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

    displayProduct(subject) {
        if (!subject) return '';
        let index = this.productData.findIndex(
            (state) => state.id === parseInt(subject)
        );
        return this.productData[index].name;
    }

    GetProduct(): void {
        this._service.getProduct().subscribe((resp) => {
            this.productData = resp.data;
        });
    }

    private _filterProduct(value: string): { id: string; name: string }[] {
        const filterValue = value.toLowerCase();
        return this.productData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    get products() {
        return this.addForm.get('products') as FormArray;
    }

    addRaw() {
        const productControl = new FormControl('');
        const a = this._formBuilder.group({
            product_id: '', //ชื่อ unit
            qty: '', //จำนวน
            cost: '', //ราคาต้นทุน
            price: '', //ราคาขาย
            product_name: productControl,
            unit_id: '',
        });
        this.products.push(a);
        this.setupFilteredOptions(
            this.products.controls.length - 1,
            productControl
        );
    }

    setupFilteredOptions(index: number, productControl: FormControl) {
        this.filteredOptions[index] = productControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterProduct(value))
        );
    }

    removeArray(i: number): void {
        this.products.removeAt(i);
    }

    backTo() {
        this._router.navigate(['admin/sales/list']);
    }

    onpush(event: any, i, data: any) {

        if (event.option.value === 0) {
            this.ProductAdd(i, data)
        }

        const foundItem = this.productData.find(
            (item) => item.name === event.option.value
        );

        if (foundItem) {
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
    }

    onSubmit(): void {
        if (this.langues == 'tr') {
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
                    let formValue = this.addForm.value;
                    formValue.date = moment(formValue.date).format('YYYY-MM-DD');
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/sales/list')
                                .then(() => { });
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
        else if (this.langues == 'en') {
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
                    let formValue = this.addForm.value;
                    formValue.date = moment(formValue.date).format('YYYY-MM-DD');
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/sales/list')
                                .then(() => { });
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

    calculateTotal(formArray: FormArray): number {
        let total = 0;

        formArray.controls.forEach((control: AbstractControl) => {
            // ตรวจสอบว่า control เป็น instance ของ FormControl
            if (control instanceof FormControl) {
                // เพิ่มค่า control ลงในผลรวม
                total += control.value || 0;
            }
        });

        return total;
    }

    testfunction(value: any) {
        console.log('check value', value.value);
    }

    sumpriceqty(value: any) {
        console.log('check value1', +value.value.qty);
        let total = 0;
        total = +value.value.qty * value.value.cost;
        value.value.price = total;
    }

    ProductAdd(i, data): void {
        this.dialog
            .open(FormDialogComponent, {
                width: '80%',
                height: '90%',
                autoFocus: false,

            })
            .afterClosed()
            .subscribe((foundItem) => {
                if (foundItem) {
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

    UnitAdd(i, data): void {
        this.dialog
            .open(UnitProductComponent, {
                width: '40%',
                height: 'auto',
                autoFocus: false,
                data: data.value

            })
            .afterClosed()
            .subscribe((foundItem) => {
                if (foundItem) {


                }
            });
    }

    updateStatus(data): void {

        this.dialog
            .open(UpdateDialogComponent, {
                width: '40%',
                height: 'auto',
                autoFocus: false,
                data: data

            })
            .afterClosed()
            .subscribe((foundItem) => {
                if (foundItem) {
                    this._service.getById(this.id).subscribe((resp: any) => {
                        this.status = 'EDIT'
                        this.itemData = resp.data;
                        console.log(this.itemData);

                        this.addForm.patchValue({
                            date: this.itemData?.date,
                            total_price: this.itemData?.total_price,
                            client_name: this.itemData?.client?.name,
                            client_phone: this.itemData?.client?.phone,
                            client_email: this.itemData?.client?.email,
                        })

                        if (this.itemData?.order_lists.length > 0) {
                            for (let index = 0; index < this.itemData.order_lists.length; index++) {
                                const element = this.itemData.order_lists[index];
                                const a = this._formBuilder.group({
                                    product_id: element?.product_id,
                                    qty: element?.qty,
                                    cost: element?.cost,
                                    price: element?.price,
                                    product_name: element?.product?.name,
                                    unit_id: '',
                                });
                                this.products.push(a);
                            }
                        }
                        this._changeDetectorRef.markForCheck()
                    })

                }
            });
    }

    shouldHighlightRow(item: any): boolean {
        return item.status === 'Ordered' && item.discount > 0;
    }

    getStatusName(value: string): string {
        const foundStatus = this.statusOrder.find(s => s.value === value);
        return foundStatus ? foundStatus.name : '-';
    }

    getStatusColor(value: string): string {
        const foundStatus = this.statusOrder.find(s => s.value === value);
        return foundStatus ? foundStatus.color : 'bg-gray-200 text-gray-800';
    }

    getUnitName(value: string): string {
        const foundStatus = this.unitdata.find(s => s.id === +value);
        return foundStatus ? foundStatus.name : '-';
    }

    editElement(element: any) {
        this._router.navigateByUrl('admin/sales/edit/' + element)
    }


}
