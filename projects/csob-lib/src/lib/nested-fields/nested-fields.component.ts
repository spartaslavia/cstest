import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../main-form/main-form.component';
import { UniqueEmailValidator } from '../unique-email.validator';

@Component({
  selector: 'lib-nested-fields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nested-fields.component.html',
  styleUrl: './nested-fields.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NestedFieldsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NestedFieldsComponent),
      multi: true,
    },
  ],
})
export class NestedFieldsComponent
  implements ControlValueAccessor, Validator, OnDestroy
{
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private uniqueEmailValidator = inject(UniqueEmailValidator);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private _amount!: number;

  @Input() categories: Category[] = [];
  @Input() set amount(val: number) {
    setTimeout(() => {
      this._amount = val;
      if (val !== null && val >= 0) {
        this.nestedForm.get('allocation')?.enable();
        this.nestedForm
          .get('allocation')
          ?.setValidators([Validators.min(0), Validators.max(val)]);
      } else {
        this.nestedForm.get('allocation')?.disable();
      }
      this.nestedForm.get('allocation')?.updateValueAndValidity();
    });
  }

  get amount() {
    return this._amount;
  }

  nestedForm = this.fb.group({
    allocation: [{ value: 0, disabled: true }, [Validators.min(0)]],
    category: ['', Validators.required],
    witnesses: this.fb.array([this.createWitness()]),
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createWitness(): FormGroup {
    return this.fb.group({
      name: [null, { validators: Validators.required, updateOn: 'blur' }],
      email: [
        null,
        {
          validators: [Validators.email],
          asyncValidators: [
            this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
          ],
          updateOn: 'blur',
        },
      ],
    });
  }

  get witnesses(): FormArray {
    return this.nestedForm.get('witnesses') as FormArray;
  }

  addWitness(): void {
    if (this.witnesses.length < 5) {
      this.witnesses.push(this.createWitness());
    }
  }

  removeWitness(index: number): void {
    if (this.witnesses.length > 1) {
      this.witnesses.removeAt(index);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.nestedForm.setValue(value, { emitEvent: false });
    } else {
      this.nestedForm.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.nestedForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value);
      });

    this.nestedForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onChange(this.nestedForm.value);
      });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.nestedForm.disable() : this.nestedForm.enable();
  }

  validate(): ValidationErrors | null {
    if (this.nestedForm.pending) {
      return {
        invalidForm: { valid: false, message: 'Validation in progress' },
      };
    }
    return this.nestedForm.valid
      ? null
      : { invalidForm: { valid: false, message: 'nestedFields are invalid' } };
  }
}
