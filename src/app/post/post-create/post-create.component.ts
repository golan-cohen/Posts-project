import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
@Injectable({ providedIn: "root" })
export class PostCreateComponent implements OnInit , OnDestroy {
  enteredContent = "";
  enteredTitle = "";
  imageError = false;
  imageValid = false;
  isLoading = false;
  form!: FormGroup;
  imagePreview: string | undefined;
  private mode = 'create';
  private postId : any;
  post!: Post;
  private authStatusSub!: Subscription;

  constructor(
    public PostsService: PostsService,
    public route: ActivatedRoute ,
    private _snackBar: MatSnackBar,
    private authService: AuthService) {}

ngOnInit()  {
  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    authStatus => {
      this.isLoading = false;
    }
  );
  this.form = new FormGroup({
    title: new FormControl( null, {
      validators: [Validators.required , Validators.minLength(3)]
    }),
    content: new FormControl( null, {
      validators: [Validators.required]}),
    image: new FormControl(null , {
      validators: [Validators.required]})
  });
  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if(paramMap.has('postId'))  {
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.PostsService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {
          id: postData._id,
          title: postData.title,
          content: postData.content,
          imagePath: postData.imagePath,
          creator: postData.creator };
        console.log(this.post.title);
        console.log(this.post.content);
        this.form.setValue({
        title: this.post.title,
        content: this.post.content,
        image: this.post.imagePath
        });
      });
    } else {
      this.mode = 'create';
      this.postId = null;
    }
  });
}
onImagePicked(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  this.form.patchValue({image: file});
  this.form.get('image')?.updateValueAndValidity();
  const mimeTypeTest = file.type.toString();
  console.log(file);
  console.log(this.form);

  const reader = new FileReader();
  reader.onload = () => {
    if(mimeTypeTest.includes('image'))
    this.imageValid = true;
  else
    this.imageValid = false;
    this.imagePreview = reader.result as string;
  }
  reader.readAsDataURL(file);

}

onSavePost( ) {
  if(!this.imageValid)
  {
    this.imageError = true;
    return;
  }
  else if (this.form?.invalid) return;

  this.isLoading = true;
  if( this.mode === 'create') {
    this.PostsService.addPost(this.form?.value.title , this.form?.value.content, this.form?.value.image);
  } else  {
    this.PostsService.updatePost(this.postId , this.form?.value.title , this.form?.value.content , this.form?.value.image);
  }

  this._snackBar.open('Post saved successfully', 'Undo', {
    duration: 2000
  });
  this.form?.reset();
}

ngOnDestroy() {
  this.authStatusSub.unsubscribe();
}

}
