import { compileInjector } from '@angular/compiler';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../models/Movie';
import { MovieService } from '../services/movie.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-movie-serach',
  templateUrl: './movie-serach.component.html',
  styleUrls: ['./movie-serach.component.scss']
})
export class MovieSerachComponent implements OnInit {
  show = false;
  currentUser: any;
  showError = false;
  searchMovies: Movie[] | undefined;
  searchText: any = '';

  constructor(private token: TokenStorageService, private movieService: MovieService, private router: Router) { }

    ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  searchForMovies(): void {
    if (this.searchText) {
      this.movieService.getMovieSearchList(this.searchText).toPromise().then(res => {
        this.searchMovies = res;
        this.show = true;
        this.showError = false;
      }).catch(err => {
        this.showError = true;
      });
    }
  }

}
