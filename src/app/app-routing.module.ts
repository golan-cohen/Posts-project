import { NgModule } from "@angular/core";
import { RouterModule , Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { PostCreateComponent } from "./post/post-create/post-create.component";
import { postListComponent } from "./post/post-list/post-list.component";

const routes: Routes = [
  { path: '', component: postListComponent},
  { path: 'create', component: PostCreateComponent, canActivate:[AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent , canActivate:[AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [AuthGuard]
})
export class AppRoutingModule {}
