import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieComment } from '../models/MovieComment';
import { SavedMovie } from '../models/SavedMovie';
import { UserMovieRating } from '../models/UserMovieRating';
import { MovieService } from '../services/movie.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-user-movie-details',
  templateUrl: './user-movie-details.component.html',
  styleUrls: ['./user-movie-details.component.scss'],
})
export class UserMovieDetailsComponent implements OnInit {
  movie: SavedMovie | undefined;
  currentUser: any;
  selectedStatus: any;
  commentText!: any;
  userComments: MovieComment[] | undefined;
  closeResult: string | undefined;
  modalContent!: MovieComment;
  isAdmin = false;
  rating = 0;
  ratingForSave = 0;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute,
    private token: TokenStorageService,
    private router: Router,
    private notifications: NotificationService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.currentUser = this.token.getUser();
    if (this.currentUser && this.currentUser.roles) {
      this.currentUser.roles.forEach((element: string) => {
        if (element === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
      });
    }
    this.movieService.getMovieById(id).subscribe(
      (data) => {
        this.movie = data;
        if (this.movie?.imdbID) {
          this.movieService.getComments(this.movie.imdbID).subscribe(
            (data) => {
              this.userComments = data;
            },
            (err) => {}
          );
          this.movieService.getMovieRating(this.movie.imdbID).subscribe(
            (data) => {
              this.rating = data;
              this.ratingForSave = this.rating;
            },
            (err) => {
              this.rating = 0;
            }
          );
        }
      },
      (err) => {
        this.notifications.showError('Filmas nerastas.');
      }
    );
  }

  saveStatus(): void {
    if (this.selectedStatus && this.movie) {
      this.movieService
        .saveMovieStatus(this.movie.id, this.selectedStatus)
        .subscribe(
          (data) => {
            this.notifications.showSuccess(
              'Filmo statusas sėkmingai atnaujintas.'
            );
          },
          (err) => {
            this.notifications.showError('Filmo statusas neatnaujintas.');
          }
        );
      setTimeout(() => {}, 1000);
    }
  }

  saveComment(): void {
    if (this.commentText && this.movie) {
      const comment: MovieComment = {
        imdbId: this.movie.imdbID,
        name: this.currentUser.username,
        comment: this.commentText,
      };
      this.movieService.saveComment(comment).subscribe(
        (data) => {
          this.notifications.showSuccess('Komentaras sėkmingai pridėtas.');
          if (this.movie?.imdbID) {
            this.movieService.getComments(this.movie.imdbID).subscribe(
              (data) => {
                this.userComments = data;
              },
              (err) => {}
            );
          }
          this.commentText = '';
        },
        (err) => {
          this.notifications.showError('Komentaras nebuvo pridėtas.');
        }
      );
      setTimeout(() => {}, 1000);
    }
  }

  deleteMovie(): void {
    if (this.movie) {
      this.movieService.deleteMovieFromList(this.movie.id).subscribe(
        (data) => {
          this.notifications.showSuccess('Filmas buvo ištrintas.');
          this.router.navigate(['/home']);
        },
        (err) => {
          this.notifications.showError('Filmas nebuvo ištrintas.');
        }
      );
    }
  }

  deleteComment(id?: string): void {
    if (id) {
      this.movieService.deleteComment(id).subscribe(
        (data) => {
          this.notifications.showSuccess('Komentaras sėkmingai ištrintas.');
          if (this.movie?.imdbID) {
            this.movieService.getComments(this.movie.imdbID).subscribe(
              (data) => {
                this.userComments = data;
              },
              (err) => {
                this.userComments = [];
              }
            );
          }
          this.modalService.dismissAll();
        },
        (err) => {
          this.notifications.showError('Komentaras nebuvo ištrintas.');
        }
      );
    }
  }

  open(content: any, comment: any): void {
    this.modalContent = comment;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveRating(rate: number): void {
    const prevRating = this.rating;
    if (this.movie?.movieStatus !== 'NO_STATUS') {
      if (this.movie?.imdbID) {
        const userRating: UserMovieRating = {
          imdbId: this.movie?.imdbID,
          userId: this.currentUser.id,
          rating: rate,
        };
        this.movieService.saveMovieRating(userRating).subscribe(
          (data) => {
            this.notifications.showSuccess('Įvertinimas išsaugotas');
            if (this.movie?.imdbID) {
              this.movieService.getMovieRating(this.movie.imdbID).subscribe(
                (data) => {
                  this.rating = data;
                  this.ratingForSave = this.rating;
                },
                (err) => {
                  this.rating = 0;
                  this.ratingForSave = 0;
                }
              );
            }
          },
          (err) => {
            this.notifications.showWarning('Nepavyko išsaugoti įvertinimo');
            this.ratingForSave = prevRating;
          }
        );
      }
    } else {
      this.notifications.showError('Išsaugoti įvertinimą galima tik esant statusui');
      this.ratingForSave = prevRating;
    }

  }
}
