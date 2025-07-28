const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js"); 

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
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Incoming body:", req.body);
  } else {
    console.log("📦 No body content in request.");
  }
  next();
});


app.get('/favicon.ico', (req, res) => res.status(204).end());


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

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