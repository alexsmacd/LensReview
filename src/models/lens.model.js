// Load mongoose package
const mongoose = require('mongoose');

const LensSchema = new mongoose.Schema({
  description: String,
  rating: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

const Lens = mongoose.model('Lens', LensSchema);

Lens.count({}, function(err, count) {
  if (err) {
    throw err;
  }
  
  if (count > 0) return ;

  const lens = require('./lens.seed.json');
  Lens.create(lens, function(err, newLenses) {
    if (err) {
      throw err;
    }
    console.log("DB seeded")
  });

});

module.exports = Lens;