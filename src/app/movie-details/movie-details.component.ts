import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../models/Movie';
import { MovieComment } from '../models/MovieComment';
import { Recommendation } from '../models/Recommendation';
import { SavedMovie } from '../models/SavedMovie';
import { SavedMovieRequest } from '../models/SavedMovieRequest';
import { MovieService } from '../services/movie.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from '../services/token-storage.service';
import { RouterModule } from '@angular/router';

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
  recommendationContent!: Recommendation;
  moiveList: SavedMovie[] | undefined;
  showRecommendation = false;
  showRecommendationList = false;
  recommendationMovie: SavedMovie | undefined;
  checkboxValue!: boolean;
  checkboxes: boolean[] = [];
  recommendationList: Recommendation[] | undefined;
  recommendationDeleteContent!: Recommendation;
  
  constructor(private movieService: MovieService, private activatedRoute: ActivatedRoute, private token: TokenStorageService,
              private notifications: NotificationService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {

    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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

        this.movieService.getRecommendationsForMovie(this.movie.imdbID).subscribe(data => {
          this.recommendationList = data;
          this.showRecommendationList = true;
        }, error => {
        });

        this.movieService.getValidMovies(this.currentUser.id, this.movie?.imdbID).subscribe(data => {
          this.moiveList = data;
          this.showRecommendation = true;
        }, err => {
          // this.notifications.showError('Klaida randant filmus rekomendacijai');
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

  saveRecommendation(recommendationText: any) {
    if (!this.recommendationMovie || !recommendationText || !this.movie || !this.currentUser) {
      this.notifications.showError('Užpildykite laukus');
      return;
    }
    let recommendation: Recommendation = {
      movieId : this.recommendationMovie.id,
      title : this.recommendationMovie?.title,
      poster : this.recommendationMovie.poster,
      recommendationText : recommendationText,
      imdbId : this.movie.imdbID,
      userId : this.currentUser.id,
      name : this.currentUser.username,
      passedImdbId : this.recommendationMovie.imdbID
    }
    this.movieService.saveRecommendation(recommendation).subscribe(data => {
      this.notifications.showSuccess("Rekomendacija sukurta");
      if (this.movie?.imdbID) {
        this.movieService.getRecommendationsForMovie(this.movie.imdbID).subscribe(data => {
          this.recommendationList = data;
          this.showRecommendationList = true;
        })
      }
      this.modalService.dismissAll();
    }, error => {
      this.notifications.showError("Rekomendacija nesukurta");
    })
    this.modalService.dismissAll();
  }

  open(content: any, comment: any): void {
    this.modalContent = comment;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  openRecommendation(recommendation: any, movie: any) {
    if (!this.moiveList) {
      this.notifications.showError("Neturite filmų sąraše");
      return;
    }
    this.recommendationMovie = undefined;
    this.checkboxes = [];
    this.recommendationContent = recommendation;
    this.modalService.open(recommendation, {ariaLabelledBy: 'recommendationTitle'});
  }

  onCheckboxChange(event: any, movie: any) {
    this.checkboxes = [];
    this.recommendationMovie = movie;
  }

  navigate(imdbId: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true})
  .then(()=>this.router.navigate(['movies',imdbId]));
  }

  openRecommendationDelete(recommendationContent: any, recommendation: any) {
    if (!recommendation) {
      this.notifications.showError("Įvyko klaida");
      return;
    }
    this.recommendationDeleteContent = recommendation;
    this.modalService.open(recommendationContent, {ariaLabelledBy: 'recommendationDeleteTitle'});
  }

  deleteRecommendation(id?: string) {
    if (id) {
      this.movieService.deleteRecommendationById(id).subscribe(data => {
        if (this.movie?.imdbID) {
          this.movieService.getRecommendationsForMovie(this.movie.imdbID).subscribe(data => {
            this.recommendationList = data;
          }, err => {
            this.recommendationList = [];
          })
        }
        this.modalService.dismissAll();
        this.notifications.showSuccess('Rekomendacija ištrinta');
      }, err => {
        this.notifications.showError('Nepavyko ištrinti rekomendacijos');
      })
    }
  }
}
