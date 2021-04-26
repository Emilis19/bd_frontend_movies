import { Rating } from "./Rating";

export interface SavedMovie {
    id: string;
    userId: string;
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    poster: string;
    ratings: Rating[];
    imdbRating: string;
    imdbID: string;
    type: string;
    response: string;
    movieStatus: string;
}