const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* DATABASE */
const db = new sqlite3.Database("bookings.db");

db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    sport TEXT,
    venue TEXT,
    date TEXT,
    time TEXT,
    price INTEGER
  )
`);

/* CREATE USERS TABLE */
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    fullName TEXT,
    password TEXT
  )
`);

/* USER SIGNUP */
app.post("/api/signup", (req, res) => {
  const { email, fullName, password } = req.body;
  
  if (!email || !fullName || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  
  db.run(
    `INSERT INTO users (email, fullName, password) VALUES (?, ?, ?)`,
    [email, fullName, password],
    err => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(400).json({ message: "Signup failed" });
      }
      res.json({ message: "Account created successfully", email, fullName });
    }
  );
});

/* USER LOGIN */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  
  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({ message: "Login successful", email: user.email, fullName: user.fullName });
    }
  );
});

/* CREATE BOOKING */
app.post("/api/book", (req, res) => {
  const { name, phone, sport, venue, date, time, price } = req.body;

  if (!name || !phone || !sport || !venue || !date || !time) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    `INSERT INTO bookings (name, phone, sport, venue, date, time, price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, sport, venue, date, time, price || 0],
    err => {
      if (err) return res.json({ message: "Database error" });
      res.json({ message: "Booking confirmed!" });
    }
  );
});

/* GET ALL BOOKINGS */
app.get("/api/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

/* DELETE ONE BOOKING */
app.delete("/api/bookings/:id", (req, res) => {
  db.run(
    "DELETE FROM bookings WHERE id = ?",
    [req.params.id],
    err => {
      if (err) return res.json({ message: "Delete failed" });
      res.json({ message: "Booking deleted" });
    }
  );
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});