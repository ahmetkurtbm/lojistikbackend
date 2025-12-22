const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

// REGISTER
exports.register = async (req, res) => {
  const { phone, password } = req.body;

  const exists = await User.findOne({ phone });
  if (exists)
    return res.status(400).json({ message: "Telefon kayıtlı" });

  const user = await User.create({
    phone,
    password: await hashPassword(password),
  });

  res.json({ success: true });
};

// LOGIN
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user)
    return res.status(401).json({ message: "Hatalı bilgi" });

  const ok = await comparePassword(password, user.password);
  if (!ok)
    return res.status(401).json({ message: "Hatalı bilgi" });

  const token = signToken({
    userId: user._id,
    phone: user.phone,
  });

  res.json({ token });
};

// RESET PASSWORD (SMS GÖNDER)
exports.resetPassword = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.json({ success: true });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = code;
  user.resetCodeExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  console.log("RESET CODE (SMS):", code);

  res.json({ success: true });
};

// VERIFY RESET
exports.verifyReset = async (req, res) => {
  const { phone, code, newPassword } = req.body;

  const user = await User.findOne({
    phone,
    resetCode: code,
    resetCodeExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Kod geçersiz" });

  user.password = await hashPassword(newPassword);
  user.resetCode = undefined;
  user.resetCodeExpire = undefined;
  await user.save();

  res.json({ success: true });
};
