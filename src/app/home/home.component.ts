import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/Movie';
import { SavedMovie } from '../models/SavedMovie';
import { MovieService } from '../services/movie.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  finishedMovies: SavedMovie[] | undefined;
  progressMovies: SavedMovie[] | undefined;
  showProgress = false;
  showFinished = false;

  constructor(private token: TokenStorageService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.movieService.getFinishedMovies(this.currentUser.id).subscribe(
      data => {
        this.finishedMovies = data;
        this.showFinished = this.finishedMovies != null && this.finishedMovies.length > 0;
      },
      err => {
      }
    );

    this.movieService.getInProgressMovies(this.currentUser.id).subscribe(
      data => {
        this.progressMovies = data;
        this.showProgress = this.progressMovies != null && this.progressMovies.length > 0;
      },
      err => {
      }
    );

  }
}
