const { supabase } = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, name } = req.body;

      // Hash password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
        options: {
          data: {
            name: name,
          },
        },
      });

      // Handle potential errors
      if (error) {
        return res.status(400).json({
          message: "Signup failed",
          error: error.message,
        });
      }

      // Return user information
      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle potential errors
      if (error) {
        return res.status(401).json({
          message: "Login failed",
          error: error.message,
        });
      }

      // Return user information
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      // Sign out using Supabase
      const { error } = await supabase.auth.signOut();

      // Handle potential errors
      if (error) {
        return res.status(400).json({
          message: "Logout failed",
          error: error.message,
        });
      }

      // Successful logout
      return res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      // Assuming authMiddleware has already verified the user
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "No user authenticated",
        });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
