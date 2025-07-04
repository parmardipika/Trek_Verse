const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
      type:String,
      required:true,
    },
    description:String,
     image: {
    filename: {
      type: String,
      default: "default_filename.jpg",
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/green-tree-on-grassland-during-daytime-EPy0gBJzzZU",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/green-tree-on-grassland-during-daytime-EPy0gBJzzZU"
          : v,
    },
  },

    price:Number,
    location:String,
    country:String
})
const Listing=mongoose.model("Listing",listingSchema);//model created named Listing.
module.exports=Listing;