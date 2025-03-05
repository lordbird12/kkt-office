

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CustmoerService } from '../customer.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
        MatCheckboxModule
    ],

})
export class FormComponent implements OnInit {
        addForm: FormGroup;
    MenuList: any = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _Service: CustmoerService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
        this.addForm = this._formBuilder.group({
            code: '',
            name: '',
            tax: '',
            contact: '',
            tel1: '',
            tel2: '',
            address : '',
            remark: '',
            status: '',
        })
    }

    ngOnInit(): void {

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
        this._router.navigate(['admin/customer/list'])
    }

    onSubmit() : void {

        const dialogRef = this._fuseConfirmationService.open({
            "title": "บันทึกข้อมูล",
            "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "accent"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "ตกลง",
                "color": "primary"
              },
              "cancel": {
                "show": true,
                "label": "ยกเลิก"
              }
            },
            "dismissible": true
          })

          dialogRef.afterClosed().subscribe((result => {
            if(result === 'confirmed') {
                console.log('complete')
            } else {
                console.log('cancel');
            }
          }))
    }
}

