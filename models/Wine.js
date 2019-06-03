var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//UserSchema object
var WineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },

  //  ref links the ObjectId to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Wine = mongoose.model("Wine", WineSchema);


module.exports = Wine;
