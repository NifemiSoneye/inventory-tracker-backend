const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.ALLOWED_ORIGINS || "",
];

export default allowedOrigins;
