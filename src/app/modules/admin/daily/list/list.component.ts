import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'employee-list',
    templateUrl: './list.component.html',
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
        TranslocoModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    languageUrl: any;

    ngOnInit() {
        this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json'; // Default to English
        if (localStorage.getItem('lang') === 'en') {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json'; // Thai language URL
        }
        this.loadTable();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    editElement(element: any) {
        this._router.navigateByUrl('admin/sales/edit/' + element)
    }

    hiddenEdit() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.edit === 0;
    }
    hiddenDelete() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.delete === 0;
    }
    hiddenSave() {
        const getpermission = JSON.parse(localStorage.getItem('permission'));
        const menu = getpermission.find((e) => e.menu_id === 7);
        return menu.save === 0;
    }
    addElement() {
        this._router.navigate(['admin/sales/form']);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url:  this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.type = 'Good';
                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'code' },
                { data: 'date' },
                { data: 'client' },
                { data: 'total_price' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    showPicture(imgObject: any): void {
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
}
