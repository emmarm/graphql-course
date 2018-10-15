import jwt from "jsonwebtoken";

const generateToken = userId => {
  return jwt.sign({ userId }, "superstrongsecret", { expiresIn: "7 days" });
};

export default generateToken;
