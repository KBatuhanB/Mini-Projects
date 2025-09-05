class Review {
    constructor(db) {
        this.collection = db.collection('reviews');
        this.movieCollection = db.collection('movies'); // Film kontrolü için
        this.id = 0;
    }

    //İnceleme Ekleme (CREATE)**
    async addReview(reviewData) {
        const movie = await this.movieCollection.findOne({ title:reviewData.MovieName });

        if (!movie) {
            return { success: false, message: "Film bulunamadı." };
        } 
        this.id++;
        const result = await this.collection.insertOne({ReviewID: this.id, ...reviewData});
        if (result.acknowledged && result.insertedId) {
            return { success: true, message: "İnceleme eklendi.", data: {ReviewID: this.id,...reviewData } };
        } else {
            return { success: false, message: "İnceleme eklenemedi." };
        }
    }

    //Belirli Filme Ait İncelemeleri Getirme (READ - BY MOVIE)**
    async getReviewsByMovie(movieName) {
        const reviews = await this.collection.find({ MovieName: movieName }).toArray();
        if (reviews.length > 0) {
            return reviews;
        } else {
            return { message: "Bu film için inceleme yok." };
        }
    }

    //Tüm İncelemeleri Getirme (READ - ALL)**
    async getAllReviews() {
        const reviews = await this.collection.find().toArray();
        if (reviews.length > 0) {
            return reviews;
        } else {
            return { message: "Henüz hiç inceleme eklenmemiş." };
        }
    }

    //İncelemeyi Güncelleme (UPDATE)**
    async updateReview(reviewId, updatedData) {
        const result = await this.collection.updateOne({ ReviewID: reviewId }, { $set: updatedData });
        if (result.modifiedCount > 0) {
            return { success: true, message: "İnceleme güncellendi." };
        } else {
            return { success: false, message: "İnceleme bulunamadı veya değişiklik yapılmadı." };
        }
    }

    //İncelemeyi Silme (DELETE)**
    async deleteReview(reviewId) {
        const result = await this.collection.deleteOne({ ReviewID:reviewId });
        if (result.deletedCount > 0) {
            return { success: true, message: "İnceleme silindi." };
        } else {
            return { success: false, message: "İnceleme bulunamadı." };
        }
    }
}

module.exports = {Review}