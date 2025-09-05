const { MongoClient} = require('mongodb');

// MongoDB bağlantı URI’si ve veritabanı adı belirleniyor.


class Database {
    constructor() {
        const url = 'mongodb://localhost:27017/movieDB';
        const dbName = 'movieDB';
        this.client = new MongoClient(url);
        this.dbName = dbName;
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("MongoDB'ye başarıyla bağlandınız.");
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error("MongoDB bağlantı hatası:", error);
        }
    }

    async close() {
        await this.client.close();
        console.log("MongoDB bağlantısı kapatıldı.");
    }
}

module.exports = {Database}