const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

const validateJWT = async (req, res, next) => {
  try {
    if (req.method == 'OPTIONS') {
      next();
    } else if (req.headers.authorization) {
      const { authorization } = req.headers;
      const payload = authorization
        ? jwt.verify(authorization, process.env.JWT_SECRET)
        : undefined;

      if (payload) {
        let foundUser = await UserModel.findOne({
          where: { id: payload.id },
        });

        if (foundUser) {
          req.user = foundUser;
          next();
        } else {
          res.status(400).send()({
            message: 'User not found.',
          });
        }
      } else {
        res.status(401).json()({
          message: 'Invalid token',
        });
      }
    } else {
      res.status(403).json()({
        message: 'Forbidden',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

module.exports = validateJWT;
