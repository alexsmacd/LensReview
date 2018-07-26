// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

/**
 * Get a list of all lenses in the DB
 */
router.get('/lens', function(req, res, next) {
  const lensModel = mongoose.model('Lens');

  lensModel.find({deleted: {$ne: true}}, function(err, lens) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(lens);
  });
});

/**
 * Get a single lens by passing its id as a URL param
 */
router.get('/lens/:lensId', function(req, res, next) {
  const {lensId} = req.params;

  const lens = LENS.find(entry => entry.id === lensId);
  if (!lens) {
    return res.status(404).end(`Could not find lens '${lensId}'`);
  }

  res.json(lens);
});

/**
 * Create a new lens
 */
router.post('/lens', function(req, res, next) {
  const Lens = mongoose.model('Lens');
  const lensData = {
    description: req.body.description,
    rating: req.body.rating,
  };

  Lens.create(lensData, function(err, newLens) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newLens);
  });
});

/**
 * Update an existing lens
 */
router.put('/lens/:lensId', function(req, res, next) {
  const Lens = mongoose.model('Lens');
  const lensId = req.params.lensId;

  Lens.findById(lensId, function(err, lens) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!lens) {
      return res.status(404).json({message: "Lens not found"});
    }

    lens.description = req.body.description;
    lens.rating = req.body.rating;

    lens.save(function(err, savedLens) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedLens);
    })

  })

});

/**
 * Delete a lens
 */
router.delete('/lens/:lensId', function(req, res, next) {
  const Lens = mongoose.model('Lens');
  const lensId = req.params.lensId;

  Lens.findById(lensId, function(err, lens) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!lens) {
      return res.status(404).json({message: "Lens not found"});
    }

    lens.deleted = true;

    lens.save(function(err, doomedLens) {
      res.json(doomedLens);
    })

  })
});


module.exports = router;
