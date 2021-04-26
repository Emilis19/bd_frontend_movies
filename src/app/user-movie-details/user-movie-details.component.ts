import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieComment } from '../models/MovieComment';
import { SavedMovie } from '../models/SavedMovie';
import { MovieService } from '../services/movie.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-user-movie-details',
  templateUrl: './user-movie-details.component.html',
  styleUrls: ['./user-movie-details.component.scss']
})
export class UserMovieDetailsComponent implements OnInit {

  error = false;
  success = false;
  errorComment = false;
  successComment = false;
  show = true;
  errorDelete = false;
  movie: SavedMovie | undefined;
  currentUser: any;
  selectedStatus: any;
  commentText: any;
  userComments: MovieComment[] | undefined;

  constructor(private movieService: MovieService, private activatedRoute: ActivatedRoute, 
              private token: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.currentUser = this.token.getUser();
    this.movieService.getMovieById(id).subscribe(data => {
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

  saveStatus(): void {
    if (this.selectedStatus && this.movie) {
      this.show = false;
      this.movieService.saveMovieStatus(this.movie.id, this.selectedStatus).subscribe(data => {
        this.error = false;
        this.success = true;
      }, err => {
        this.error = true;
      });
      setTimeout(()=>{
        this.show = true;
   }, 1000);
    }
  }

  saveComment(): void {
    if (this.commentText && this.movie) {
      this.show = false;
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
        this.show = true;
   }, 1000);
    }
  }

  deleteMovie(): void {
    if (this.movie) {
      this.movieService.deleteMovieFromList(this.movie.id).subscribe(data => {
        this.router.navigate(['/home']);
      },
      err => {
        this.errorDelete = true;
      })
    }
  }

}
