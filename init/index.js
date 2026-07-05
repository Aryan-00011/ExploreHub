const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/ExploreHub";



async function main() {

  await mongoose.connect(MONGO_URL);

}





const initDB = async () => {


  await Listing.deleteMany({});



  const ownerId = new mongoose.Types.ObjectId();



  const data = initData.data.map((obj) => ({
  ...obj,

  category: obj.category || "Historical",

  owner: ownerId,
}));



  await Listing.insertMany(data);



  console.log("Data was initialized");



};






main()

.then(async () => {


  console.log("Connected to DB");


  await initDB();


  mongoose.connection.close();


})


.catch((err)=>{


  console.log(err);


});