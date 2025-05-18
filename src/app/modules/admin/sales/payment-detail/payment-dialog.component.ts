import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss'],
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
export class PaymentDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    isLoading: boolean = false;
    positions: any[];
    permissions: any[];
    flashMessage: 'success' | 'error' | null = null;
    selectedFile: File = null;
    constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private translocoService: TranslocoService
    ) {
        this._service.getPermission().subscribe((resp: any) => {
            this.permissions = resp.data
        })
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    statusOrder: any[] = [
        {
            value: 'Ordered',
            name: 'รอดำเนินการ'
        },
        {
            value: 'Approve',
            name: 'อนุมัติ'
        },
        {
            value: 'WaitConfirmPay',
            name: 'รอตรวจสอบชำระเงิน'
        },
        {
            value: 'ConfirmPay',
            name: 'ชำระเงินแล้ว'   
        },
        {
            value: 'Recived',
            name: 'รอจัดส่ง'
        },
        {
            value: 'Finish',
            name: 'จัดส่ง'
        },
        {
            value: 'ToClient',
            name: 'ได้รับสินค้า'
        },
        {
            value: 'Cancel',
            name: 'ยกเลิก'
        },
    ]

    ngOnInit(): void {
        this.addForm = this.formBuilder.group({
            id: this.data?.id,
            status: this.data?.status,
            remark: '',
            adjust_discount: +this.data?.discount,
        });
    }

    onSaveClick(): void {
        if(this.langues=='tr'){
            this.flashMessage = null;
            // Open the confirmation dialog
            const confirmation = this._fuseConfirmationService.open({
                "title": "อัพเดทสถานะ",
                "message": "คุณต้องการอัพเดทสถานะใช่หรือไม่ ",
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
    
    
                    this._service.updateStatus(this.addForm.value).subscribe({
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
    
        }
        else if(this.langues=='en'){
            this.flashMessage = null;
            // Open the confirmation dialog
            const confirmation = this._fuseConfirmationService.open({
                "title": "Add data",
                "message": "Do you want to add data ?",
                "icon": {
                    "show": false,
                    "name": "heroicons_outline:exclamation",
                    "color": "warning"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "confirm",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": true,
                        "label": "cancel"
                    }
                },
                "dismissible": true
            });
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
    
    
                    this._service.updateStatus(this.addForm.value).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close(resp);
                        },
                        error: (err: any) => {
                            this.addForm.enable();
                            this._fuseConfirmationService.open({
                                "title": "Please enter data",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "confirm",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "cancel",
    
                                    }
                                },
                                "dismissible": true
                            });
                        }
                    })
                }
            })
    
        }

        // แสดง Snackbar ข้อความ "complete"
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

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);

        // this.addForm.patchValue({
        //     image: this.files[0]
        // })

        var reader = new FileReader();
        reader.readAsDataURL( this.files[0]);
        reader.onload=(e: any)=>
        this.url_logo=e.target.result;
        const file =  this.files[0];
        this.addForm.patchValue({
            image: file
        });
    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }
}
