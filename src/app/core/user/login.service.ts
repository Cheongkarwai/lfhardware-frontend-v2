import {inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup, signOut,
  getAdditionalUserInfo,
  User as FirebaseUser
} from '@angular/fire/auth';
import {browserSessionPersistence, setPersistence} from "firebase/auth";
import {Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {UserService} from "./user.service";
@Injectable({
  providedIn:'root'
})
export class LoginService{


  private auth  = inject(Auth);

  private isLoggedIn$  = new BehaviorSubject<boolean>(this.auth.currentUser != null);
  private user$ = new BehaviorSubject<FirebaseUser | null>(this.auth.currentUser);
  private username:string = '';
  private password:string = '';

  constructor(private userService: UserService) {
  }
  async login(emailAddress:string,password:string){
   const result = await signInWithEmailAndPassword(this.auth,emailAddress,password);
   if(result.user != null){
     this.user$.next(result.user);
     this.isLoggedIn$.next(true);
     return true;
   }
   return false;
  }



  setTest(){
    this.isLoggedIn$.next(false);
    this.user$.next(null);
    signOut(this.auth);
  }
  async loginWithServiceProvider(provider:string){
      switch(provider){
        case "GOOGLE":
          const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
          const additionalUserInfo = getAdditionalUserInfo(result);

          if(additionalUserInfo?.isNewUser){
            console.log(additionalUserInfo.username);
            console.log(additionalUserInfo.providerId);
            console.log(additionalUserInfo.isNewUser);
            console.log(additionalUserInfo.profile);
            this.userService.createNewAccount({
              username: additionalUserInfo.profile?.['email'] as string || '',
              password: '',
              email_verified: additionalUserInfo.profile?.['verified_email'] as boolean || false,
              disabled: false,
              profile: {
                phone_number: null,
                email_address: additionalUserInfo.profile?.['email'] as string || '',
                address: {
                  address_line_1: '',
                  address_line_2: '',
                  state: '',
                  city: '',
                  zipcode: '',
                  country: ''
                }
              },
              roles: [{name:'CUSTOMER',id : null}],
            }, true).subscribe(res=>{
              console.log('Successfully link account');

            }, error=> console.log(error));
          }
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if(credential != null){
            this.user$.next(result.user);
            this.isLoggedIn$.next(true);
            return true;
          }
          break;
      }
      return false;
  }

  async logout(){
   await signOut(this.auth);
    this.isLoggedIn$.next(false);
    this.user$.next(null);
  }

  // setUserLoginState(state:boolean){
  //   this.isLoggedIn$.next(state);
  // }
  //
  // setUser(user:FirebaseUser | null){
  //   this.user$.next(user);
  // }

  get isLoggedIn(){
    return this.isLoggedIn$.asObservable();
  }

  get isLoggedInSubject(){
    return this.isLoggedIn$;
  }

  get user(){
    return this.user$.asObservable();
  }

  getToken(){
    return this.auth.currentUser?.getIdToken();
  }
}
