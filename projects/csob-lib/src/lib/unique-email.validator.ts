import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  private http = inject(HttpClient);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return this.http
      .get(`https://dummyjson.com/users/search?q=${control.value}`)
      .pipe(
        map((response: any) => {
          const total = response.total;
          return total > 0 ? { emailExists: true } : null;
        }),
        catchError(() => of(null))
      );
  }
}
