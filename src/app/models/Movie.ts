import { Rating } from "./Rating";

export interface Movie {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Poster: string;
    Ratings: Rating[];
    imdbRating: string;
    imdbID: string;
    Type: string;
    Response: string;
    userRating: number;
}