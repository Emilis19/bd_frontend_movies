import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../models/Movie';
import { MovieComment } from '../models/MovieComment';
import { SavedMovieRequest } from '../models/SavedMovieRequest';
import { MovieService } from '../services/movie.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  error = false;
  success = false;
  movie: Movie | undefined;
  currentUser: any;
  commentText: any;
  userComments: MovieComment[] | undefined;
  errorComment = false;
  successComment = false;

  constructor(private movieService: MovieService, private activatedRoute: ActivatedRoute, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    const { id } = this.activatedRoute.snapshot.params;
    this.movieService.getMovieByImdb(id).subscribe(data => {
      this.movie = data;
      if (this.movie?.imdbID) {
        this.movieService.getComments(this.movie.imdbID).subscribe(data => {
          this.userComments = data;
        },  err =>  {
        });
      }
    },  err =>  {
    });
  }

  saveMovie(): void {
    if (this.movie != null) {
      const savedMovie: SavedMovieRequest = {userId: this.currentUser.id, movie: this.movie};
      this.movieService.saveMovie(savedMovie).subscribe(data => {
        this.success = true;
        this.error = false;
      }, err => {
        // this.success = false;
        this.error = true;
      });
    }
  }
  

  saveComment(): void {
    if (this.commentText && this.movie) {
      const comment: MovieComment = {imdbId: this.movie.imdbID, name: this.currentUser.username, comment: this.commentText};
      this.movieService.saveComment(comment).subscribe(data => {
        this.errorComment = false;
        this.successComment = true;
        if (this.movie?.imdbID) {
          this.movieService.getComments(this.movie.imdbID).subscribe(data => {
          this.userComments = data;
        },  err =>  {
        });
      }
      }, err => {
        this.errorComment = true;
      });
      setTimeout(()=>{
   }, 1000);
    }
  }

}
