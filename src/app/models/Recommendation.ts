export interface Recommendation {
    id?: string;
    movieId: string;
    title: string;
    poster: string;
    date?: Date;
    recommendationText: string;
    imdbId: string;
    userId: string;
    name: string;
    passedImdbId: string;
}