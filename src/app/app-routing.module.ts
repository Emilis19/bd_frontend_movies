import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieSerachComponent } from './movie-serach/movie-serach.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { UserMovieDetailsComponent } from './user-movie-details/user-movie-details.component';
import { UserMoviesComponent } from './user-movies/user-movies.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: MovieSerachComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'mymovies', component: UserMoviesComponent },
  { path: 'mymovies/:id', component: UserMovieDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
