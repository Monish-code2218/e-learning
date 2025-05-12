import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    methods: {
      type: [String],
      required: true,
    },
    local: {
      email: {
        type: String,
        required: function() {
          return this.methods.includes('local');
        },
        unique: true,
        sparse: true,
        lowercase: true,
        index: true,
        validate: {
          validator: function(v) {
            if (this.methods.includes('local')) {
              if (!v || v.length === 0) {
                return false;
              }
              const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              return emailRegex.test(v);
            }
            return true;
          },
          message: props => {
            if (!props.value || props.value.length === 0) {
              return 'Email address is required';
            }
            return `${props.value} is not a valid email address. Please enter a valid email (e.g. user@example.com)`;
          }
        }
      },
      password: {
        type: String,
        // required: true,
      },
    },
    google: {
      id: {
        type: String,
      },
      displayName: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
    },
    userDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserDetail",
      },
    ],
    resetPasswordOtp: { type: Number },
    resetPasswordExpires: { type: Date },
  },
);

userSchema.pre("save", async function (next) {
  try {
    console.log("entered");
    if (!this.methods.includes("local")) {
      next();
    }
    //the user schema is instantiated
    const user = this;
    console.log(user.isModified("local.password"));
    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified("local.password")) {
      next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    console.log(passwordHash);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    console.log(this.local.password);
    console.log("exited");
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

export const User = mongoose.model("User", userSchema);
