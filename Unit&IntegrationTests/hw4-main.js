const { Database } = require('./hw4-db');       // Veritabanı bağlantısı için
const { Movie } = require('./hw4-movies');      // Film işlemleri için
const { Review } = require('./hw4-review');     // İnceleme işlemleri için

async function main() {
    // Veritabanı bağlantısını başlat
    const database = new Database();
    await database.connect();
    
    const movieCollection = new Movie(database.db);
    const reviewCollection = new Review(database.db);

    // Film ekleme örneği
    const movieData = {
        title: "Inception",
        director: "Christopher Nolan",
        releaseYear: 2010,
        genre: "Sci-Fi",
    };

    const movieAddResponse = await movieCollection.addMovie(movieData);
    console.log(movieAddResponse);

    // Film bilgilerini alma örneği
    const movieInfo = await movieCollection.getMovieById("Inception");
    console.log(movieInfo);

    //// Tüm filmleri alma örneği
    //const allMovies = await movieCollection.getAllMovies();
    //console.log(allMovies);

    // Film güncelleme örneği
    const updatedMovieData = { genre: "Sci-Fi, Thriller" };
    const updateMovieResponse = await movieCollection.updateMovie("Inception", updatedMovieData);
    console.log(updateMovieResponse);

    // Film bilgilerini alma örneği
    const newMovieInfo = await movieCollection.getMovieById("Inception");
    console.log(newMovieInfo);

    // Film silme örneği
    //const deleteMovieResponse = await movieCollection.deleteMovie("Inception");
    //console.log(deleteMovieResponse);

    // İnceleme ekleme örneği
    const reviewData = {
        MovieName: "Inception",
        reviewer: "John Doe",
        rating: 9,
        comment: "A mind-bending masterpiece!",
    };

    const reviewAddResponse = await reviewCollection.addReview(reviewData);
    console.log(reviewAddResponse);

    // Belirli bir filme ait incelemeleri alma örneği
    const movieReviews = await reviewCollection.getReviewsByMovie("Inception");
    console.log(movieReviews);

    //// Tüm incelemeleri alma örneği
    //const allReviews = await reviewCollection.getAllReviews();
    //console.log(allReviews);

    // İnceleme güncelleme örneği
    const updatedReviewData = { comment: "A thrilling experience!" };
    const updateReviewResponse = await reviewCollection.updateReview(1,updatedReviewData);  // ReviewID'yi buraya yazmalısınız.
    console.log(updateReviewResponse);

    // Belirli bir filme ait incelemeleri alma örneği
    const newMovieReviews = await reviewCollection.getReviewsByMovie("Inception");
    console.log(newMovieReviews);

    // İnceleme silme örneği
    //const deleteReviewResponse = await reviewCollection.deleteReview(1);  // ReviewID'yi buraya yazmalısınız.
    //console.log(deleteReviewResponse);

    // Bağlantıyı kapatma
    await database.close();
}

main();
