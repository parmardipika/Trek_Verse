const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");
const Review= require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use((req, res, next) => {
  console.log("📦 Request body:", req.body);
  next();
});

app.use((req, res, next) => {
  console.log("🟡 Incoming body:", req.body);
  next();
});



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});



const validateListing=(req,res,next)=>{
let {error} = listingSchema.validate(req.body);
  
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(".");
throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  // console.log("Listings from DB:", allListings); 
  res.render("listings/index", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
   if (!listing) {
    return next(new ExpressError(404, "Listing not found!"));
  }

  // console.log("Listing Data:", listing); 
  res.render("listings/show.ejs", { listing });
}));


//Create Route
app.post("/listings",
  validateListing ,
  wrapAsync(async (req, res,next) => {


 
 const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  })
  ); 


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));


//Update Route
app.put("/listings/:id",
  validateListing,
   wrapAsync(async (req, res) => { 
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
//reviews
//post route

app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {

  console.log("🔥 Review form submitted!", req.body);
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  // Basic validation check
  const { rating, comment } = req.body.review || {};

  if (!rating || !comment) {
    throw new ExpressError(400, "Review must have both rating and comment.");
  }

  const newReview = new Review({ rating, comment });
  await newReview.save();

  // 💡 Push only ObjectId into reviews array
  listing.reviews.push(newReview._id);
  await listing.save();

  console.log("✅ New review saved:", newReview);
  res.redirect(`/listings/${listing._id}`);
}));





app.use((req,res,next )=>{
    console.log("❌ Page not found:", req.originalUrl); // Add this
  next(new ExpressError(404,"Page Not Found!"));
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("err.ejs",{message});
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});