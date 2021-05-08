import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../models/Movie';
import { MovieComment } from '../models/MovieComment';
import { SavedMovieRequest } from '../models/SavedMovieRequest';
import { MovieService } from '../services/movie.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | undefined;
  currentUser: any;
  commentText: any;
  userComments: MovieComment[] | undefined;
  closeResult: string | undefined;
  modalContent!: MovieComment;
  isAdmin = false;
  rating = 0;

  constructor(private movieService: MovieService, private activatedRoute: ActivatedRoute, private token: TokenStorageService,
              private notifications: NotificationService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    const { id } = this.activatedRoute.snapshot.params;
    if (this.currentUser && this.currentUser.roles) {
      this.currentUser.roles.forEach((element: string) => {
        if (element === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
      });
    }
    this.movieService.getMovieByImdb(id).subscribe(data => {
      this.movie = data;
      if (this.movie?.imdbID) {
        this.movieService.getComments(this.movie.imdbID).subscribe(data => {
          this.userComments = data;
        },  err =>  {
        });
        this.movieService.getMovieRating(this.movie.imdbID).subscribe(data => {
          this.rating = data;
        }, err => {
          this.rating = 0;
        });
      }
    },  err =>  {
      this.notifications.showError('Filmas nerastas.');
    });
  }

  saveMovie(): void {
    if (this.movie != null) {
      const savedMovie: SavedMovieRequest = {userId: this.currentUser.id, movie: this.movie};
      this.movieService.saveMovie(savedMovie).subscribe(data => {
        this.notifications.showSuccess('Filmas sėkmingai pridėtas į sąrašą');
      }, err => {
        this.notifications.showError('Filmas nebuvo pridėtas į sąrašą.')
      });
    }
  }
  

  saveComment(): void {
    if (this.commentText && this.movie) {
      const comment: MovieComment = {imdbId: this.movie.imdbID, name: this.currentUser.username, comment: this.commentText};
      this.movieService.saveComment(comment).subscribe(data => {
        this.notifications.showSuccess('Komentaras pridėtas.');
        if (this.movie?.imdbID) {
          this.movieService.getComments(this.movie.imdbID).subscribe(data => {
          this.userComments = data;
        },  err =>  {
        });
      }
        this.commentText = '';
      }, err => {
        this.notifications.showError('Komentaras nebuvo pridėtas.')
      });
      setTimeout(()=>{
   }, 1000);
    }
  }

  deleteComment(id?: string): void {
    if (id) {
      this.movieService.deleteComment(id).subscribe(data => {
        this.notifications.showSuccess('Komentaras sėkmingai ištrintas.');
        if (this.movie?.imdbID) {
          this.movieService.getComments(this.movie.imdbID).subscribe(data => {
          this.userComments = data;
        },  err =>  {
          this.userComments = [];
        });
      }
        this.modalService.dismissAll();
      }, err => {
        this.notifications.showError('Komentaras nebuvo ištrintas.');
      });
    }
  }

  open(content: any, comment: any): void {
    this.modalContent = comment;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

}
