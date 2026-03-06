const express = require("express");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const redis = require("redis");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});



const client = redis.createClient({
    url: process.env.REDIS_URL || "redis://redis:6379",
});

// SMTP (MailHog)
const SMTP_HOST = process.env.SMTP_HOST || "mailhog";
const SMTP_PORT = Number(process.env.SMTP_PORT || 1025);
const CONTACT_TO = process.env.CONTACT_TO || "test@local.dev";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to DevOps Foundations API",
    version: process.env.APP_VERSION || "0.0.0",
  });
});

app.get("/db", (req, res) => {
    pool.query("SELECT NOW()", (err, result) => {
        if (err) {
            res.status(503).json({
                status: "error",
                error: "db_connection_failed",
                message: err.message,
            });
        } else {
            res.json({
                status: "connected",
                time: result.rows[0].now,
            });
        }
    });
});


app.get("/cache", async (req, res) => {
  try {
    if (!client.isOpen) await client.connect();
    const visits = await client.incr("visits");
    res.json({ status: "connected", visits });
  } catch (e) {
    res.status(503).json({ status: "error", error: "redis_connection_failed", message: e.message });
  }
});

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body || {};
    try {
        await transporter.sendMail({
        from: email || "no-reply@local.dev",
        to: CONTACT_TO,
        subject: "DevOps Foundations - Contact test",
        text: `Name: ${name || "N/A"}\nEmail: ${email || "N/A"}\n\nMessage:\n${message || ""}`,
        });
        res.json({ status: "sent" });
    } catch (e) {
        res.status(503).json({
        status: "error",
        error: "mail_send_failed",
        message: e.message,
        });
    }
});
