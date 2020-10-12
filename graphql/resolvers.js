const { validateUser, validateLogin } = require("../utils/validators");
const { UserInputError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { User } = require("../models");
const { CHAT_SECRET_KEY } = require("../config/env.json");

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        let user;
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, CHAT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Invalid/expired token");
            }
            user = decodedToken;
            console.log(user);
          });
        }
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      //validation
      let { errors, valid } = validateLogin(username, password);
      try {
        //check validation
        if (!valid) throw new UserInputError("Errors", { errors });
        //Find User
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = "user not found!";
          throw new UserInputError("user not found", { errors });
        }
        //check password
        const correctPassword = await bcrypt.compare(password, user.password);
        console.log(correctPassword);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new AuthenticationError("password is incorrect", { errors });
        }
        //generate token
        const token = jwt.sign(
          {
            username: user.username,
            email: user.email,
          },
          CHAT_SECRET_KEY,
          { expiresIn: 60 * 60 }
        );
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let { errors, valid } = validateUser(
        username,
        email,
        password,
        confirmPassword
      );

      try {
        if (!valid) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) =>
              (errors[e.path.split(".")[1]] = `${
                e.path.split(".")[1]
              } is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
