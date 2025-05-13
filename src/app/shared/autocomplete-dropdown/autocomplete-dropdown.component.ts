import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { debounceTime, distinctUntilChanged, ReplaySubject, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrls: ['./autocomplete-dropdown.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class AutocompleteDropdownComponent implements OnInit, OnDestroy {
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  @Input() placeholder: string = '';
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'id';
  @Input() searchFields: string[] = ['code', 'name'];
  @Input() datasource: any[] = [];
  @Input() control: FormControl = new FormControl('');
  @Output() selectionChange = new EventEmitter<any>();
  filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  constructor() {
    this.filteredData.next(this.datasource.slice());
  }

  ngOnInit() {
    if (this.control) {
      this.control.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this._onDestroy)
        )
        .subscribe(() => this._filter());
    } else {
      console.error('Control not found!');
    }
  }
  

  private _filter() {
    if (!this.datasource) return;

    let search = this.control.value;

    if (!search) {
      this.filteredData.next(this.datasource.slice());
      return;
    }

    search = search.toString().toLowerCase();

    this.filteredData.next(
      this.datasource.filter(item =>
        this.searchFields.some(field =>
          item[field]?.toLowerCase().includes(search)
        )
      )
    );
  }

  displayFn = (item: any): string => {
    return item ? item[this.displayField] : '';
  };

  onSelect(event: any) {
    this.selectionChange.emit(event.option.value);
    this.control.setValue(event.option.value); // หรือเก็บเฉพาะ selected.id ถ้าต้องการ
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
