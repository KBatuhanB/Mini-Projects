
class Movie {
    constructor(db) {
        this.collection = db.collection('movies');
    }

    //Film Ekleme (CREATE)
    async addMovie(movieData) {
        // Eksik alanları kontrol et
        if (!movieData.title || !movieData.director || !movieData.releaseYear) {
            return { success: false, message: "Eksik alanlar var." }; // Hata mesajı
        }
        const result = await this.collection.insertOne(movieData);
        if (result.acknowledged && result.insertedId) {
            return { success: true, message: "Film eklendi.", data: { _id: result.insertedId, ...movieData } };
        } else {
            return { success: false, message: "Film eklenemedi." };
        }
    }

    //Tüm Filmleri Getirme (READ - ALL)**
    async getAllMovies() {
        const movies = await this.collection.find().toArray();
        if (movies.length > 0) {
            return movies;
        } else {
            return { message: "Film bulunamadı." };
        }
    }

    //Belirli Bir Filmi Getirme (READ - ONE)**
    async getMovieById(movieName) {
        const movie = await this.collection.findOne({ title: movieName });
        if (movie) {
            return movie;
        } else {
            return { message: "Film yok." };
        }
    }

    //Filmi Güncelleme (UPDATE)**
    async updateMovie(movieName, updatedData) {
        const result = await this.collection.updateOne({ title: movieName }, { $set: updatedData });
        if (result.modifiedCount > 0) {
            return { success: true, message: "Film güncellendi." };
        } else {
            return { success: false, message: "Film bulunamadı veya değişiklik yok." };
        }
    }

    //Filmi Silme (DELETE)**
    async deleteMovie(movieName) {
        const result = await this.collection.deleteOne({title:movieName });
        if (result.deletedCount > 0) {
            return { success: true, message: "Film silindi." };
        } else {
            return { success: false, message: "Film yok veya zaten silinmiş." };
        }
    }
}

module.exports = {Movie}