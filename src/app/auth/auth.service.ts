import { HttpClient } from "@angular/common/http";
import { Token } from "@angular/compiler/src/ml_parser/lexer";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data-model";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({ providedIn: "root" })
export class AuthService  {
  private isAuthicated = false;
  private tokenTimer:any;
  private userId: string | undefined;
  private token: string | undefined;
  private authStatusListener = new Subject<boolean>();
constructor(private http: HttpClient , private router: Router) {}

  getToken()  {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthicated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener()  {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string , password: string)  {
    const authData: AuthData = {email: email , password: password};
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(() => {
      this.router.navigate(['/']);
    }, erorr => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string , password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string,expiresIn: number , userId: string}>(BACKEND_URL + "/login", authData)
    .subscribe( response => {
      const token = response.token;
      this.token = token;
      if(token) {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthicated = true;
      this.userId = response.userId;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      console.log(expirationDate);
      this.saveAuthData(token , expirationDate , this.userId);
      this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser()  {
    const authInformation = this.getAuthData();
    if( !authInformation) return;
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    if( expiresIn > 0) {
      this.token = authInformation?.token;
      this.isAuthicated = true;
      this.userId = authInformation.userId?.toString();
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout()  {
    this.token = undefined;
    this.isAuthicated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = undefined;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number)  {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date , userId: string)  {
    localStorage.setItem('token' , token);
    localStorage.setItem('expiration' , expirationDate.toISOString());
    localStorage.setItem('userId' , userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if( !token || !expirationDate)
      return;
    return  {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}
