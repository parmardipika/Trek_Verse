const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")


main()
.then(()=>{
    console.log("connected to DB")
}) 
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDB=async()=>{
    await Listing.deleteMany({});
     console.log("Deleting done");

     console.log("Number of listings to insert:", initData.data.length);
     console.log("First listing object:", initData.data[0]);
     
    await Listing.insertMany(initData.data);
    console.log("data was initialized!");
};

initDB();