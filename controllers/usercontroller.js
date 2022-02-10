const router = require('express').Router();
const { UserModel } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/* 
========================
    Create a User
========================
*/
router.post('/register', async (req, res) => {
  const { name, birthday, email, password } = req.body;
  try {
    const User = await UserModel.create({
      name,
      birthday,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(201).json({
      message: 'User successfully created',
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: 'Email already in use',
      });
    } else {
      res.status(500).json({
        message: `Unable to create user: ${err}`,
      });
    }
  }
});

/* 
========================
    Login a User
========================
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    if (loginUser) {
      let passwordCompare = await bcrypt.compare(password, loginUser.password);

      if (passwordCompare) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        res.status(200).json({
          message: 'User successfully logged in!',
          user: loginUser,
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: 'Incorrect username or password',
        });
      }
    } else {
      res.status(401).json({
        message: 'Incorrect username or password',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Failed to log user in. Error: ${err}`,
    });
  }
});

/* 
========================
    Get all Users
========================
*/
router.get('/all', async (req, res) => {
  try {
    const users = await UserModel.findAll({});
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
