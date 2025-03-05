import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'form-employee',
    templateUrl: './form.component.html',
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
        MatCheckboxModule,
        TranslocoModule
    ],
})
export class FormComponent implements OnInit {
    addForm: FormGroup;
    MenuList: any = [];
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

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _Service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private translocoService: TranslocoService

    ) {
        this.addForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit(): void { }

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
        this._router.navigate(['admin/customer/list']);
    }

    onSaveClick(): void {
        // Open the confirmation dialog
        if (this.langues == 'tr') {
            const confirmation = this._fuseConfirmationService.open({
                title: 'เพิ่มข้อมูล',
                message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ',
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
                    let formValue = this.addForm.value;

                    this._Service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['/admin/customer/list']);
                        },
                        error: (err: any) => {
                            this.addForm.enable();
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
                title: 'Add information',
                message: 'Do you want to add information? ',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'submit',
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
                    let formValue = this.addForm.value;

                    this._Service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['/admin/customer/list']);
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                title: 'Please specify information',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'submit',
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
    
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'เพิ่มข้อมูล',
    //         message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ',
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
    //             let formValue = this.addForm.value;
    //             // const formData = new FormData();
    //             // Object.entries(this.addForm.value).forEach(([key, value]: any[]) => {
    //             //   formData.append(key, value);
    //             // });
    //             this._Service.create(formValue).subscribe({
    //                 next: (resp: any) => {
    //                     this._router.navigate(['/admin/customer/list']);
    //                 },
    //                 error: (err: any) => {
    //                     this.addForm.enable();
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

    //     // แสดง Snackbar ข้อความ "complete"
    // }
    }
}
