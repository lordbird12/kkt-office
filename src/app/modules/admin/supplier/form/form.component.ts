import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SupplierService } from '../service/supplier.service';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-form-news',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    
})
export class FormComponent implements OnInit {
    isLoading: boolean = false;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    permissiondata: any[];
    constructor(
        private _router: Router,
        private formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: SupplierService,
        private translocoService: TranslocoService

    ) {
        this.addForm = this.formBuilder.group({
            name: '',
            tax: '',
            email: '',
            phone: '',
            address: '',
            detail: '',
        });
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;

    ngOnInit(): void {
        // สร้าง Reactive Form
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

    Submit(): void {
        console.log(this.addForm.value);
        // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
        // console.log(end)
        // this.addForm.patchValue({
        //   register_date:end
        // })

        if(this.langues=='tr'){
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
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(
                        ([key, value]: any[]) => {
                            if (
                                value !== '' &&
                                value !== 'null' &&
                                value !== null
                            ) {
                                formData.append(key, value);
                            }
                        }
                    );
                    this._service.Savedata(formData).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/supplier/list')
                                .then(() => {});
                        },
    
                        error: (err: any) => {
                            console.log(err);
                            this.addForm.enable();
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
            console.log(this.addForm.value);
        }
        else if(this.langues=='en'){
            const confirmation = this._fuseConfirmationService.open({
                title: 'Add information',
                message: 'Do you want to add information?',
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
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();
                    Object.entries(this.addForm.value).forEach(
                        ([key, value]: any[]) => {
                            if (
                                value !== '' &&
                                value !== 'null' &&
                                value !== null
                            ) {
                                formData.append(key, value);
                            }
                        }
                    );
                    this._service.Savedata(formData).subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('admin/supplier/list')
                                .then(() => {});
                        },
    
                        error: (err: any) => {
                            console.log(err);
                            this.addForm.enable();
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
            console.log(this.addForm.value);
        }

        // const confirmation = this._fuseConfirmationService.open({
        //     title: 'เพิ่มข้อมูล',
        //     message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
        //     icon: {
        //         show: false,
        //         name: 'heroicons_outline:exclamation',
        //         color: 'warning',
        //     },
        //     actions: {
        //         confirm: {
        //             show: true,
        //             label: 'ตกลง',
        //             color: 'primary',
        //         },
        //         cancel: {
        //             show: true,
        //             label: 'ยกเลิก',
        //         },
        //     },
        //     dismissible: true,
        // });

        // // Subscribe to the confirmation dialog closed action
        // confirmation.afterClosed().subscribe((result) => {
        //     // If the confirm button pressed...
        //     if (result === 'confirmed') {
        //         const formData = new FormData();
        //         Object.entries(this.addForm.value).forEach(
        //             ([key, value]: any[]) => {
        //                 if (
        //                     value !== '' &&
        //                     value !== 'null' &&
        //                     value !== null
        //                 ) {
        //                     formData.append(key, value);
        //                 }
        //             }
        //         );
        //         this._service.Savedata(formData).subscribe({
        //             next: (resp: any) => {
        //                 this._router
        //                     .navigateByUrl('admin/supplier/list')
        //                     .then(() => {});
        //             },

        //             error: (err: any) => {
        //                 console.log(err);
        //                 this.addForm.enable();
        //                 this._fuseConfirmationService.open({
        //                     title: 'เกิดข้อผิดพลาด',
        //                     message: err.error.message,
        //                     icon: {
        //                         show: true,
        //                         name: 'heroicons_outline:exclamation',
        //                         color: 'warning',
        //                     },
        //                     actions: {
        //                         confirm: {
        //                             show: false,
        //                             label: 'ตกลง',
        //                             color: 'primary',
        //                         },
        //                         cancel: {
        //                             show: false,
        //                             label: 'ยกเลิก',
        //                         },
        //                     },
        //                     dismissible: true,
        //                 });
        //                 console.log(err.error.message);
        //             },
        //         });
        //     }
        // });
        // console.log(this.addForm.value);
    }

    Cancel(): void {
        this._router.navigateByUrl('news/list').then(() => {});
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files = [];

        // เพิ่มรูปใหม่
        const newFiles = event.addedFiles;
        this.files.push(...newFiles);
        this.files.push(...event.addedFiles);
        const file = this.files[0];
        this.addForm.patchValue({
            image: file,
        });
    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }

    backTo() {
        this._router.navigate(['admin/supplier/list']);
    }
}
