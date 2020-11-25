const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://Rahul:0uBXEGVdu5kJUlw4@cluster0.b5obq.mongodb.net/shop?retryWrites=true&w=majority", { useUnifiedTopology: true })
        .then(client => {
            console.log("Connected!");
            _db = client.db();
            callback();
        })
        .catch(err => console.log(err));
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    else{
        throw "No DB found!";
    }
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;