import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NestedFieldsComponent } from '../nested-fields/nested-fields.component';
import { Subject, takeUntil } from 'rxjs';

export enum DamagedPart {
  Roof = 'roof',
  Front = 'front',
  Side = 'side',
  Rear = 'rear',
}

export interface MainFormModel {
  amount: number;
  damagedParts: DamagedPart[];
  nestedFields: NestedFieldsModel;
}

export interface NestedFieldsModel {
  allocation: number;
  category: string;
  witnesses: WitnessModel[];
}

export interface WitnessModel {
  name: string;
  email: string;
}

export interface Category {
  name: string;
  slug: string;
  url: string;
}

@Component({
  selector: 'lib-main-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NestedFieldsComponent],
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.scss',
})
export class MainFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  mainForm!: FormGroup;
  categories!: Category[];

  ngOnInit(): void {
    this.mainForm = this.fb.group({
      amount: [null, [Validators.min(0), Validators.max(300)]],
      damagedParts: this.fb.array(Object.values(DamagedPart).map(() => false)),
      nestedFields: [null],
    });

    this.http
      .get('https://dummyjson.com/products/categories')
      .subscribe((data) => {
        this.categories = data as Category[];
      });

    this.mainForm
      .get('amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const nestedFieldsControl = this.mainForm.get('nestedFields');
        if (value) {
          nestedFieldsControl?.enable();
        } else {
          nestedFieldsControl?.disable();
        }
        nestedFieldsControl?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.mainForm.valid) {
      const formValue: MainFormModel = this.getFormModel();
      console.log(formValue);
    }
  }

  private getFormModel(): MainFormModel {
    const damagedParts: DamagedPart[] = (
      this.mainForm.get('damagedParts')?.value as boolean[]
    )
      .map((checked, index) =>
        checked ? Object.values(DamagedPart)[index] : null
      )
      .filter((part): part is DamagedPart => part !== null);

    return {
      amount: this.mainForm.get('amount')?.value,
      damagedParts: damagedParts as DamagedPart[],
      nestedFields: this.mainForm.get('nestedFields')
        ?.value as NestedFieldsModel,
    };
  }
}
