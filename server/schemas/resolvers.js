// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { newBook }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: newBook },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: bookId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
