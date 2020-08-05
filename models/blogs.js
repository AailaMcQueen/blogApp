var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "https://soliloquywp.com/wp-content/uploads/2016/08/How-to-Set-a-Default-Featured-Image-in-WordPress.png"
  },
  body: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String,
    username: String
  },
  created: {
    type: Date, 
    default: Date.now
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
module.exports = mongoose.model("Blog", blogSchema);
