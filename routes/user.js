const express = require("express");
const User = require("../models/User");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

// Route 1: Updating existing user POST: /update
router.put("/update", fetchuser, async (req, res) => {
  let success = false;
  const { mobile } = req.body;
  if (!/^[6-9]\d{9}$/gi.test(mobile)) {
    return res.status(400).json({ error: "please enter correct number" });
  }
  try {
    const { mobile } = req.body;
    const user = await User.findById(req.user.id).select("-password");
    if (mobile == user.mobile) {
      return res
        .status(400)
        .json({ success, error: "cannot modify the same number" });
    }
    const udpateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          mobile: mobile,
        },
      },
      { new: true }
    ).select("-password");
    success = true;
    return res.json({ success, udpateUser });
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
});

module.exports = router;
