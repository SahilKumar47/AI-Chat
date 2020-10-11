const { validateUser } = require("../utils/validators");
const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      try {
        const { valid, errors } = validateUser(
          username,
          email,
          password,
          confirmPassword
        );
        const userByUsername = await User.findOne({ where: { username } });
        const userByEmail = await User.findOne({ where: { email } });
        if (userByUsername) errors.username = "username is already taken";
        if (userByEmail) errors.email = "email is already taken";
        if (!valid) {
          console.log(errors);
          throw errors;
        }
        password = await bcrypt.hash(password, 12);
        const user = await User.create({
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        });
        return user;
      } catch (err) {
        console.log(err);
        throw new UserInputError("bad input", { errors: err });
      }
    },
  },
};
