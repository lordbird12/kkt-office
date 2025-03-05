

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../page.service';
import { NewChanelComponent } from '../new-chanel/new-chanel.component';

@Component({
    selector: 'warehouse-edit',
    templateUrl: './edit.component.html',
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
        DataTablesModule
    ],
})

export class EditComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    public dataRow: any[];
    itemData: any;
    form: FormGroup;
    Id: any;
    url_path: string;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router : Router,
        private _service : PageService,
        private _matDialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
    ) {

        this.form = this._formBuilder.group({
            area_id: '',
            id: '',
            name: '',
            detail: '',
            image: ''
        })
     }

    ngOnInit() {
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            this.dataRow = resp.data.floors;
            this.form.patchValue({
                ...this.itemData
            })
            this._changeDetectorRef.detectChanges();
        })
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    editElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '400px', // กำหนดความกว้างของ Dialog
            data: {
                    data: element,
                    position: this.positions
            } // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // เมื่อ Dialog ถูกปิด ดำเนินการตามผลลัพธ์ที่คุณได้รับจาก Dialog
            }
        });
    }
    addElement() {
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };


    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    // handlePageEvent(event) {
    //     this.loadData(event.pageIndex + 1, event.pageSize);
    // }




    expandFunction(): void {
        console.log(this.dataRow[0].channels)
        for (let i = 0; i < this.dataRow.length; i++) {
          if (this.dataRow[i].channels.isExpanded != true) {
            this.dataRow[i].channels.isExpanded = true;
          } else {
            this.dataRow[i].channels.isExpanded = false;
          }
        }
      }

      newFloor(data: any): void {
        // this._matDialog
        //     .open(NewFloorsComponent, {
        //         autoFocus: false,
        //         data: {
        //             data
        //         },
        //     })
        //     .afterClosed()
        //     .subscribe(() => {
        //         this._Service.getById(this.Id).subscribe((resp: any) => {
        //             this.itemData = resp.data;
        //             this.dataRow = resp.data.floors;
        //             console.log('resp', this.dataRow);
        //             this.formData.patchValue({
        //                 id: this.itemData.id,
        //                 name: this.itemData.name,
        //                 detail: this.itemData.detail,
        //                 image: this.itemData.image,
        //             });
        //             this.url_path =  this.itemData.image
        //             this._changeDetectorRef.detectChanges();
        //         });
        //     });
    }
    newChanel(data: any): void {
        this._matDialog
            .open(NewChanelComponent, {
                autoFocus: false,
                data: {
                    data
                },
            })
            .afterClosed()
            .subscribe(() => {
                this._service.getById(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.dataRow = resp.data.floors;
                    console.log('resp', this.dataRow);
                    this.form.patchValue({
                        id: this.itemData.id,
                        name: this.itemData.name,
                        detail: this.itemData.detail,
                        image: this.itemData.image,
                    });
                    this.url_path =  this.itemData.image
                    this._changeDetectorRef.detectChanges();
                });
            });
    }
}


