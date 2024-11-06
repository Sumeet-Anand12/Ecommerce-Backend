const Usertable = require("../../Models/usertable");

const logout = async (req, res) => {
  try {
    // Remove the refresh token from the user's document in the database
    await Usertable.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // removes the refreshToken field
        },
      },
      { new: true }
    );

    // Set options for clearing cookies
    const options = {
      httpOnly: true,
      secure: true, // set to true in production (for HTTPS)
      sameSite: "None", // use as needed
    };

    // Clear the access and refresh tokens from cookies
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ status: 200, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Logout failed" });
  }
};

module.exports = logout;
