import { Component , OnDestroy, OnInit} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Post } from '../post.model';
import { PostsService } from "../post.service";
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from "src/app/auth/auth.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class postListComponent implements OnInit , OnDestroy{
 isLoading = false;
 totalPosts= 0;
 postPerPage = 2;
 pageSizeOptions = [1 ,2 ,5 ,10];
 currentPage = 1;
 posts : Post[] = Array();
 userIsAuthicated = false;
 userId: string | undefined;
 private postsSub: Subscription | undefined;
 private authStatusSub: Subscription | undefined;

 constructor(public PostsService: PostsService , private _snackBar: MatSnackBar, private authService: AuthService) {}

 ngOnInit() {
  this.isLoading = true;
   this.PostsService.getPosts(this.postPerPage , this.currentPage);
   this.userId = this.authService.getUserId();
   this.postsSub = this.PostsService.getPostUpdateListener()
   .subscribe((postData: {posts: Post[] ,postCount: number }) =>
   {this.isLoading = false;
    this.totalPosts = postData.postCount;
     this.posts = postData.posts});
     this.userIsAuthicated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthicated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
 }

 onChangedPage(pageData : PageEvent)  {
  this.isLoading = true;
   this.currentPage = pageData.pageIndex + 1;
   this.postPerPage = pageData.pageSize;
  this.PostsService.getPosts(this.postPerPage , this.currentPage);
 }
 onDelete( postId: string) {
  this.isLoading = true;
  this.PostsService.deletePost(postId).subscribe(() => {
    this.PostsService.getPosts(this.postPerPage , this.currentPage)
  });
  this._snackBar.open('Post deleted successfully', 'Close', {
    duration: 2000
  });
 }
  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }
}
