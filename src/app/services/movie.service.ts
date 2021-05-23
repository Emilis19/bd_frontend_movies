import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieComment } from '../models/MovieComment';
import { Recommendation } from '../models/Recommendation';
import { SavedMovieRequest } from '../models/SavedMovieRequest';
import { UserMovieRating } from '../models/UserMovieRating';

const MOVIE_API = 'http://localhost:8080/api/movies/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getMovieSearchList(title: string): Observable<any> {
    return this.http.get(MOVIE_API + 'get/' + title, httpOptions);
  }

  getMovieByImdb(id: string): Observable<any> {
    return this.http.get(MOVIE_API + 'imdb/' + id, httpOptions);
  }

  getMovieById(id: string): Observable<any> {
    return this.http.get(MOVIE_API + 'id/' + id, httpOptions);
  }

  getSavedMovies(userId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'user/' + userId, httpOptions);
  }

  saveMovie(savedMovie: SavedMovieRequest): Observable<any> {
    return this.http.post(MOVIE_API + 'save', savedMovie, httpOptions);
  }

  getComments(imdbId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'comments/' + imdbId, httpOptions);
  }

  saveComment(movieComment: MovieComment): Observable<any> {
    return this.http.post(MOVIE_API + 'comments/save', movieComment, httpOptions);
  }

  saveMovieStatus(id: string, status: string): Observable<any> {
    return this.http.put(MOVIE_API + 'save/' + id, status, httpOptions);
  }

  getFinishedMovies(userId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'finished/' + userId, httpOptions);
  }

  getInProgressMovies(userId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'progress/' + userId, httpOptions);
  }

  deleteMovieFromList(id: string): Observable<any> {
    return this.http.delete(MOVIE_API + 'delete/' + id, httpOptions);
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(MOVIE_API + 'comments/delete/' + id, httpOptions);
  }

  getMovieRating(imdbId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'ratings/' + imdbId, httpOptions);
  }

  saveMovieRating(rating: UserMovieRating): Observable<any> {
    return this.http.post(MOVIE_API + 'ratings/save', rating, httpOptions);
  }

  getValidMovies(userId: string, imdbId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'validmovies/' + userId + '/' + imdbId, httpOptions);
  }

  getRecommendationsForMovie(imdbId: string): Observable<any> {
    return this.http.get(MOVIE_API + 'recommendations/' + imdbId, httpOptions);
  }

  saveRecommendation(recommendation: Recommendation): Observable<any> {
    return this.http.post(MOVIE_API + 'recommendations/save', recommendation, httpOptions);
  }

  deleteMovieRecommendations(movieId: string, userId: string): Observable<any> {
    return this.http.delete(MOVIE_API + 'recommendations/delete/' + movieId + '/' + userId, httpOptions)
  }

  deleteRecommendationById(recommendationId: string): Observable<any> {
    return this.http.delete(MOVIE_API + 'recommendations/delete/' + recommendationId, httpOptions)
  }
}
