import { Component, OnInit } from '@angular/core';
import { IndividualConfig, ToastrConfig } from 'ngx-toastr';
import { Movie } from '../models/Movie';
import { ToasterPosition } from '../models/toastrEnum';
import { MovieService } from '../services/movie.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-movie-serach',
  templateUrl: './movie-serach.component.html',
  styleUrls: ['./movie-serach.component.scss']
})
export class MovieSerachComponent implements OnInit {
  show = false;
  currentUser: any;
  searchMovies: Movie[] | undefined;
  searchText: any = '';

  constructor(private token: TokenStorageService, private movieService: MovieService,
              private notifications: NotificationService) { }

    ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  searchForMovies(): void {
    if (this.searchText) {
      this.movieService.getMovieSearchList(this.searchText).toPromise().then(res => {
        this.searchMovies = res;
        this.show = true;
      }).catch(err => {
        this.notifications.showError('Filmų nerasta');
      });
    }
  }

}
