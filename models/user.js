const mongoose = require("mongoose");
const passportLocalMongoosePkg = require("passport-local-mongoose");

const passportLocalMongoose =
  passportLocalMongoosePkg.default || passportLocalMongoosePkg;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);