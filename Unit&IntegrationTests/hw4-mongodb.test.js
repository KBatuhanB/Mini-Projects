const { Database } = require('./hw4-db');       // Veritabanı bağlantısı için
const { Movie } = require('./hw4-movies');      // Film işlemleri için
const { Review } = require('./hw4-review');     // İnceleme işlemleri için

let db;
let movieCollection;
let reviewCollection;

beforeAll(async () => {
    // Veritabanı bağlantısını başlat
    db = new Database();
    await db.connect();

    movieCollection = new Movie(db.db);
    reviewCollection = new Review(db.db);
});

afterAll(async () => {
    // Veritabanı bağlantısını kapat
    await db.close();
});

beforeEach(async () => {
    // Veritabanını sıfırla (movies ve reviews koleksiyonlarını temizle)
    await db.db.collection('movies').deleteMany({});
    await db.db.collection('reviews').deleteMany({});
});

describe('Movie Collection Tests', () => {
    test('Should add a movie to the database', async () => {
        // Given: A movie data is provided
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };

        // When: We call the addMovie method
        const response = await movieCollection.addMovie(movieData);

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The movie should be in the database
        const movie = await db.db.collection('movies').findOne({ title: "Inception" });
        expect(movie).toBeTruthy();  // Should exist in the database
        expect(movie.title).toBe("Inception");  // The movie title should match
    });

    test('Should fail to add a movie with missing required fields', async () => {
        // Given: Missing required movie data (no title)
        const movieData = {
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
    
        // When: We try to add the movie
        const response = await movieCollection.addMovie(movieData);
    
        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("Eksik alanlar var.");  // Ensure correct error message
    
        // Then: The movie should not be in the database
        const movie = await db.db.collection('movies').findOne({ director: "Christopher Nolan" });
        expect(movie).toBeNull();  // Movie should not be added
    });

    test('Should fail to retrieve a movie that does not exist', async () => {
        // Given: No movie with the title "NonExistentMovie"
        // When: We try to retrieve a non-existent movie
        const movie = await movieCollection.getMovieById("NonExistentMovie");

        // Then: The response should indicate the movie does not exist
        expect(movie.message).toBe("Film yok.");  // Should return "Film yok." message
    });

    test('Should update a movie in the database', async () => {
        // Given: A movie is added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        // When: We update the movie's genre
        const updatedData = { genre: "Sci-Fi, Thriller" };
        const response = await movieCollection.updateMovie("Inception", updatedData);

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The movie's genre should be updated
        const movie = await db.db.collection('movies').findOne({ title: "Inception" });
        expect(movie.genre).toBe("Sci-Fi, Thriller");  // The genre should be updated
    });

    test('Should fail to update a movie that does not exist', async () => {
        // Given: No movie with the title "NonExistentMovie"
        
        // When: We try to update a non-existent movie
        const updatedData = { genre: "Drama" };
        const response = await movieCollection.updateMovie("NonExistentMovie", updatedData);

        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("Film bulunamadı veya değişiklik yok.");  // Message should indicate no movie found
    });

    test('Should delete a movie from the database', async () => {
        // Given: A movie is added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        // Given: A movie is added to the database
        const addedMovie = await db.db.collection('movies').findOne({ title: "Inception" });
        expect(addedMovie).toBeTruthy();  // Should exist in the database

        // When: The movie should be in the database
        const response = await movieCollection.deleteMovie("Inception");

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The movie should be deleted from the database
        const movie = await db.db.collection('movies').findOne({ title: "Inception" });
        expect(movie).toBeNull();  // The movie should be deleted
    });

    test('Should fail to delete a movie that does not exist', async () => {
        // Given: No movie with the title "NonExistentMovie"
        
        // When: We try to delete a non-existent movie
        const response = await movieCollection.deleteMovie("NonExistentMovie");

        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("Film yok veya zaten silinmiş.");  // Message should indicate no movie found
    });
});

describe('Review Collection Tests', () => {
    test('Should add a review for a movie', async () => {
        // Given: A movie is added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        // Given: A review for the movie is provided
        const reviewData = {
            MovieName: "Inception",
            reviewer: "John Doe",
            rating: 9,
            comment: "A mind-bending masterpiece!",
        };

        // When: We call the addReview method
        const response = await reviewCollection.addReview(reviewData);

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The review should be added to the database
        const review = await db.db.collection('reviews').findOne({ MovieName: "Inception" });
        expect(review).toBeTruthy();  // Should exist in the database
        expect(review.comment).toBe("A mind-bending masterpiece!");  // The comment should match
    });

    test('Should fail to add a review for a non-existent movie', async () => {
        // Given: A review for a non-existent movie is provided
        const reviewData = {
            MovieName: "NonExistentMovie",
            reviewer: "John Doe",
            rating: 9,
            comment: "A mind-bending masterpiece!",
        };

        // When: We try to add the review
        const response = await reviewCollection.addReview(reviewData);

        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("Film bulunamadı.");  // Should indicate movie not found
    });

    test('Should retrieve reviews for a specific movie', async () => {
        // Given: A movie and a review are added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        const reviewData = {
            MovieName: "Inception",
            reviewer: "John Doe",
            rating: 9,
            comment: "A mind-bending masterpiece!",
        };
        await reviewCollection.addReview(reviewData);

        // When: We call the getReviewsByMovie method
        const reviews = await reviewCollection.getReviewsByMovie("Inception");

        // Then: The response should return reviews for the specified movie
        expect(reviews.length).toBeGreaterThan(0);  // Should return at least one review
        expect(reviews[0].comment).toBe("A mind-bending masterpiece!");  // The comment should match
    });

    test('Should fail to retrieve reviews for a non-existent movie', async () => {
        // Given: No reviews for the movie "NonExistentMovie"
        
        // When: We try to retrieve reviews for a non-existent movie
        const reviews = await reviewCollection.getReviewsByMovie("NonExistentMovie");

        // Then: The response should indicate no reviews
        expect(reviews.message).toBe("Bu film için inceleme yok.");  // Should indicate no reviews for this movie
    });

    test('Should update a review in the database', async () => {
        // Given: A movie and a review are added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        const reviewData = {
            MovieName: "Inception",
            reviewer: "John Doe",
            rating: 9,
            comment: "A mind-bending masterpiece!",
        };
        const reviewResponse = await reviewCollection.addReview(reviewData);
        const reviewId = reviewResponse.data.ReviewID;

        // Given: An updated review is provided
        const updatedReviewData = { comment: "A thrilling experience!" };

        // When: We call the updateReview method
        const response = await reviewCollection.updateReview(reviewId, updatedReviewData);

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The review should be updated in the database
        const review = await db.db.collection('reviews').findOne({ ReviewID: reviewId });
        expect(review.comment).toBe("A thrilling experience!");  // The comment should be updated
    });

    test('Should fail to update a review that does not exist', async () => {
        // Given: No review with the ReviewID "NonExistentReviewID"
        
        // When: We try to update a non-existent review
        const updatedReviewData = { comment: "A thrilling experience!" };
        const response = await reviewCollection.updateReview("NonExistentReviewID", updatedReviewData);

        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("İnceleme bulunamadı veya değişiklik yapılmadı.");  // Should indicate review not found
    });

    test('Should delete a review from the database', async () => {
        // Given: A movie and a review are added to the database
        const movieData = {
            title: "Inception",
            director: "Christopher Nolan",
            releaseYear: 2010,
            genre: "Sci-Fi",
        };
        await movieCollection.addMovie(movieData);

        const reviewData = {
            MovieName: "Inception",
            reviewer: "John Doe",
            rating: 9,
            comment: "A mind-bending masterpiece!",
        };
        const reviewResponse = await reviewCollection.addReview(reviewData);
        const reviewId = reviewResponse.data.ReviewID;

        // When: We delete the review
        const response = await reviewCollection.deleteReview(reviewId);

        // Then: The response should indicate success
        expect(response.success).toBe(true);  // Should return success true

        // Then: The review should be deleted from the database
        const review = await db.db.collection('reviews').findOne({ ReviewID: reviewId });
        expect(review).toBeNull();  // The review should be deleted
    });

    test('Should fail to delete a review that does not exist', async () => {
        // Given: No review with the ReviewID "NonExistentReviewID"
        
        // When: We try to delete a non-existent review
        const response = await reviewCollection.deleteReview("NonExistentReviewID");

        // Then: The response should indicate failure
        expect(response.success).toBe(false);  // Should return failure
        expect(response.message).toBe("İnceleme bulunamadı.");  // Should indicate review not found
    });
});

