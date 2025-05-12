import JWT from "jsonwebtoken";
import { User } from "../models/User.js";


const signToken = (user) => {
  return JWT.sign(
    {
      iat: new Date().getTime(),
    },
    process.env.Jwt_Sec,
    {
      subject: user.id,
      issuer: "my-server",
      expiresIn: "1h",
    }
  );
};
export default {
  signUp: async (req, res, next) => {
    const { email, password } = req.body;

    let foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).json({ error: "Email is already in use" });
    }

    foundUser = await User.findOne({
      $or: [{ "google.email": email }],
    });
    if (foundUser) {
      // Let's merge them?
      foundUser.methods.push("local");
      foundUser.local = {
        email: req.body.email,
        password: req.body.password,
      };
      await foundUser.save();
      // Generate the token
      const token = signToken(foundUser);
      // Respond with token
      return res.status(200).json({ token, foundUser });
    }
    const newUser = new User({
      methods: ["local"],
      local: {
        email: email,
        password: password,
      },
    });
    await newUser.save();

    const token = signToken(newUser);

    res.status(200).json({ token, newUser });
  },

  signIn: async (req, res, next) => {
    console.log(req.user);
    const token = signToken(req.user);
    const newUser = req.user;
    res.status(200).json({ token, newUser });
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const generateOTP = () => {
        const characters = "0123456789";
        return Array.from(
          { length: 6 },
          () => characters[Math.floor(Math.random() * characters.length)]
        ).join("");
      };

      const OTP = generateOTP();
      user.resetPasswordOtp = OTP;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();


      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_MAILER,
          pass: process.env.PASS_MAILER,
        },
      });

      const mailOptions = {
        from: "m7821843@gmail.com",
        to: user.email,
        subject: "Password Reset",
        html: `
           <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>We received a request to reset your password. Here is your One-Time Password (OTP): <strong>${OTP}</strong></p>
        <p>Please click the following link to reset your password:</p>
       <a href="http://localhost:5173/reset-password"> click this link to change password http://localhost:5173/reset-password</a>
        <p>If you did not make this request, please ignore this email.</p>
        <p>Thank you,</p>
        <p>From Validation</p>
      `,
      };


      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },


  resetPassword: async (req, res) => {
    try {
      const { link, password } = req.body;

      const user = await userModel.findOne({
        resetPasswordlink: link,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        const message = user ? "link has expired" : "Invalid link";
        return res.status(404).json({ message });
      }

      const hashedPassword = await auth.hashPassword(password);
      user.password = hashedPassword;
      user.resetPasswordOtp = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getUserIsLogin: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user = {
        email: req.user.email,
        _id: req.user._id,
        role: req.user.role
      }
      res.status(200).json({ user });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }

  }
}





