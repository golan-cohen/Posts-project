import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Post } from './post/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor( private authService: AuthService)  {}
  storedPosts : Post[] = Array();

  OnPostAdded(post : any){
    this.storedPosts.push(post);
  }

  ngOnInit()  {
    this.authService.autoAuthUser();

  }
}
