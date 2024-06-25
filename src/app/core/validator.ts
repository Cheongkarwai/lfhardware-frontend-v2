import {AbstractControl, AsyncValidatorFn, FormControl, ValidatorFn} from "@angular/forms";
import {UserService} from "./user/user.service";
import {catchError, map, Observable, of} from "rxjs";
import {ProductService} from "./product/product.service";

export class Validator{

  public static noWhitespaceValidator():ValidatorFn {
    return (control:AbstractControl)=>{
      return control.value.trim().length > 0 ?  null : { 'whitespace': true };
    }
  }

  public static emailValidator():ValidatorFn{
    return (control:AbstractControl) =>{
      const value = control.getRawValue() as string;
      return value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) ? null : { 'email':true};
    }
  }

  public static matchingPasswordValidator(passwordControl: FormControl, confirmPasswordControl: FormControl):ValidatorFn{
    return (control: AbstractControl) =>{
      return passwordControl.getRawValue() === confirmPasswordControl.getRawValue() ? null : {notMatch : true};
    }
  }


  public static createUsernameValidator(userService:UserService): AsyncValidatorFn{
    return (control:AbstractControl) :Observable<any>=>{
      return userService.findByUsername(control.value)
        .pipe(map(request=> request.status === 200 ? {usernameExists: true} : null),catchError(err=>of(null)))
    }
  }

  public static createPhoneNumberValidator(userService: UserService): AsyncValidatorFn{
    return (control:AbstractControl) : Observable<any>=>{
      return userService.findByPhoneNumber(control.value)
        .pipe(map(request=> request.status === 200 ? {phoneNumberExists: true} : null),catchError(err=>of(null)))
    }
  }

  public static createPhoneNumberWithPrefixValidator(prefix:string,userService: UserService): AsyncValidatorFn{
    return (control:AbstractControl) : Observable<any>=>{
      return userService.findByPhoneNumber(prefix+ control.value)
        .pipe(map(request=> request.status === 200 ? {phoneNumberExists: true} : null),catchError(err=>of(null)))
    }
  }

  public static createProductNameValidator(productService: ProductService) : AsyncValidatorFn{
    return (control: AbstractControl) : Observable<any>=>{
      return productService.findByName(control.value)
        .pipe(map(request=> request.status === 200 ? {productNameExists:true} : null),catchError(err=>of(null)));
    }
  }

  public static createMustTrueValidator(): ValidatorFn{
    return (control:AbstractControl) =>{
      const value = control.getRawValue() as boolean;
      return value ? null : { 'mustBeTrue':true};
    }
  }
}
