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
        "https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2095&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2095&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v,
    },
  },

    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ]
});
const Listing=mongoose.model("Listing",listingSchema);//model created named Listing.
module.exports=Listing;