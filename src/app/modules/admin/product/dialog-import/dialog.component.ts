import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Service } from '../page.service';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-dialog-patho',
  standalone: true,
  templateUrl: './dialog.component.html',
  // styleUrl: './dialog-instruction.component.scss',
  imports: [
    CommonModule,
    DataTablesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class DialogImportForm implements OnInit {
  icdData: any[] = [];
  patientId: number;
  uploadPic: FormGroup;
  @ViewChild('filenameInput') filenameInput!: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<DialogImportForm>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _Service: Service,
    private _router: Router,
    private _fb: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {
    this.uploadPic = this._fb.group({
      files: ''
    })
  }

  ngOnInit(): void {

  }

  selectIcd(data: any) {
    this.dialogRef.close(data)
  }

  fileError: string | null = null;
  files: File[] = [];
  Formfiles: File
  fileUploaded: boolean = false;
  onSelects(fileList: FileList | null): void {
    if (!fileList || fileList.length === 0) {
      this.fileError = 'กรุณาเลือกไฟล์';
      return;
    }

    this.Formfiles = fileList[0];

    this.fileError = null; // reset error
    if (this.filenameInput) {
      this.filenameInput.nativeElement.value = this.Formfiles.name;
    }


  }

  Submit(): void {

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
        const formData = new FormData();
        console.log(this.Formfiles);

        formData.append('files', this.Formfiles);
        // เรียก API อัปโหลด
        if (this.data.type === 'Product') {
          const path = 'upload_product'
          this._Service.uploadImport(formData, path).subscribe({
            next: (resp: any) => {
              console.log('อัปโหลดสำเร็จ', resp);
              // this.icdData = resp?.response?.data || [];
              this.fileUploaded = true;
              // เก็บข้อมูลกลับมาใช้ เช่น URL หรือชื่อไฟล์
              // this.form.patchValue({ uploadedFile: resp.url });
            },
            error: (err) => {
              console.error('อัปโหลดล้มเหลว', err);
              this.fileError = 'เกิดข้อผิดพลาดขณะอัปโหลด';
            }
          });
        } else if (this.data.type === 'Client') {
          const path = 'upload_client'
          this._Service.uploadImport(formData, path).subscribe({
            next: (resp: any) => {
              console.log('อัปโหลดสำเร็จ', resp);
              // this.icdData = resp?.response?.data || [];
              this.fileUploaded = true;
              // เก็บข้อมูลกลับมาใช้ เช่น URL หรือชื่อไฟล์
              // this.form.patchValue({ uploadedFile: resp.url });
            },
            error: (err) => {
              console.error('อัปโหลดล้มเหลว', err);
              this.fileError = 'เกิดข้อผิดพลาดขณะอัปโหลด';
            }
          });
        }

      }
    });

  }

  onClose(): void {
    this.dialogRef.close();
  }
}
