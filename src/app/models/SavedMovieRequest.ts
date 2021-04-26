import { Movie } from "./Movie";

export interface SavedMovieRequest {
    userId: string;
    movie: Movie;
}