import { Component, OnInit } from '@angular/core';
import { SavedMovie } from '../models/SavedMovie';
import { MovieService } from '../services/movie.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.scss']
})
export class UserMoviesComponent implements OnInit {

  show = false;
  currentUser: any;
  userMovies: SavedMovie[] | undefined;

  constructor(private token: TokenStorageService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.movieService.getSavedMovies(this.currentUser.id).subscribe(data => {
      this.userMovies = data;
      this.show = true;
    }, err => {
      this.show = false;
    })
  }

}
