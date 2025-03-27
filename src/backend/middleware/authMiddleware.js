const { supabase } = require("../config/supabaseClient");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    // Attach user to request
    if (!data.user.email) {
      res.status(401).json({ message: "User email is missing" });
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
