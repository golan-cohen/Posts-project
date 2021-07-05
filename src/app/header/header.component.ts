import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{
  private authListenerSubs: Subscription | undefined;
  userIsAuthicated = false;

constructor(private authService: AuthService) {}

ngOnInit()  {
  this.userIsAuthicated = this.authService.getIsAuth();
  this.authListenerSubs = this.authService
  .getAuthStatusListener()
  .subscribe(isAuthenticated => {
    this.userIsAuthicated = isAuthenticated;
  });
}

onLogout()  {
  this.authService.logout();
}

ngOnDestroy() {
  this.authListenerSubs?.unsubscribe();
}

}
