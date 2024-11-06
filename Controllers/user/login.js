const jwt = require("jsonwebtoken");
const Usertable = require("../../Models/usertable.js");
// const secretKey = "12345678910";
const bcrypt = require("bcryptjs");



const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await Usertable.findById(userId)
      if (!user) {
        throw new Error("User not found");
    }
      const accessToken = user.generateAccessToken()
      // console.log("Access Token:", accessToken);
      const refreshToken = user.generateRefreshToken()
      // console.log("Refresh Token:", refreshToken);

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
    throw new Error("Something went wrong while generating refresh and access tokens");
  }
}


// const login = async (req, res) => {

//   try {
//     const { email, password } = req.body;

//     const user = await usertable.findOne({ email });

//     if (!user) {
//       return res.status(401).send({ message: "Invalid credentials" });
//     } else {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).send({ message: "Password not Match" });
//       } else {
//         const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "100h" });
//         res
//           .status(200)
//           .send({
//             status: "successfull",
//             message: "Login successful",
//             token: token,
//           });
//       }
//     }
//   } catch (errors) {
//     res.status(500).send({ status: "failed", errors: errors.errors });
//   }
// };


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ status: "failed", message: "Username or email is required" });
    }

    // Find user by email
    const user = await Usertable.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User does not exist" });
    }

    // Check if password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: "failed", message: "Invalid user credentials" });
    }
    
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Get user data without password and refresh token
    const loggedInUser = await Usertable.findById(user._id).select("-password -refreshToken");

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true, // use true in production for HTTPS
      sameSite: "None", // adjust this based on your needs
    };

    // Send cookies and response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: "success",
        message: "User logged in successfully",
        data: { user: loggedInUser, accessToken, refreshToken },
      });
  } catch (error) {
    // Improved error logging for better debugging
    console.error("Login error:", error);
    return res.status(500).json({ status: "failed", message: "Login failed", error: error.message });
  }
};






module.exports = login;
