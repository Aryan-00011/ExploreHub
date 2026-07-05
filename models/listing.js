const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    filename: {
      type: String,
    },
  },


  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  state: {
  type: String,
  required: true,
},

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Listing", listingSchema);