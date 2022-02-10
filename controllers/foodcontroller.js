const router = require('express').Router();
const validateJWT = require('../middleware/validate-jwt');
const { FoodModel } = require('../models');

/* 
========================
    Create a Food Log
========================
*/
router.post('/', validateJWT, async (req, res) => {
  const { date, food, location, mood, calories, photo } = req.body;
  const { id } = req.user;
  const foodEntry = {
    date,
    food,
    location,
    mood,
    calories,
    photo,
    owner_id: id,
  };
  try {
    const newEntry = await FoodModel.create(foodEntry);
    res.status(200).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/* 
========================
    Get all Logs
========================
*/
router.get('/all', validateJWT, async (req, res) => {
  try {
    const foodLogs = await FoodModel.findAll();
    res.status(200).json(foodLogs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

/* 
========================
    Get logs by User
========================
*/
router.get('/mine', validateJWT, async (req, res) => {
  let { id } = req.user;
  try {
    const foodLogs = await FoodModel.findAll({
      where: {
        owner_id: id,
      },
    });
    res.status(200).json(foodLogs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

/* 
========================
      Update Logs
========================
*/
router.put('/:id', validateJWT, async (req, res) => {
  const { date, food, location, mood, calories, photo } = req.body;

  try {
    await FoodModel.update(
      { date, food, location, mood, calories, photo },
      { where: { id: req.params.id }, returning: true }
    ).then((result) => {
      res.status(200).json({
        message: 'Food log successfully updated!',
        updatedFood: result,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Failed to update food ${err}`,
    });
  }
});

/* 
========================
      Delete Logs
========================
*/
router.delete('/:id', validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const foodEntryId = req.params.id;

  try {
    const query = {
      where: {
        id: foodEntryId,
        owner_id: ownerId,
      },
    };

    const deletedFood = await FoodModel.destroy(query);

    if (deletedFood) {
      req.user.id = deletedFood;
      res.status(200).json({
        message: 'Food Log Entry Removed',
      });
    } else {
      res.status(403).json({
        message: 'Forbidden',
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
