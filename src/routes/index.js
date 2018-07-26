// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

/**
 * Get a list of all files in the DB
 */
router.get('/file', function(req, res, next) {
  const lensModel = mongoose.model('Lens');

  lensModel.find({deleted: {$ne: true}}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(files);
  });
});

/**
 * Get a single file by passing its id as a URL param
 */
router.get('/file/:lensId', function(req, res, next) {
  const {lensId} = req.params;

  const lens = FILES.find(entry => entry.id === lensId);
  if (!lens) {
    return res.status(404).end(`Could not find file '${lensId}'`);
  }

  res.json(lens);
});

/**
 * Create a new file
 */
router.post('/file', function(req, res, next) {
  const Lens = mongoose.model('Lens');
  const lensData = {
    description: req.body.description,
    rating: req.body.rating,
  };

  Lens.create(lensData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});

/**
 * Update an existing file
 */
router.put('/file/:lensId', function(req, res, next) {
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

    lens.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })

});

/**
 * Delete a file
 */
router.delete('/file/:lensId', function(req, res, next) {
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

    lens.save(function(err, doomedFile) {
      res.json(doomedFile);
    })

  })
});


module.exports = router;