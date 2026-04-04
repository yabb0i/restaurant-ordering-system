import express from "express";
import cors from "cors";
import "dotenv/config";
import reservationRoutes from "./routes/reservations";
import menuRoutes from "./routes/menu";
import orderRoutes from "./routes/orders";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.use("/reservations", reservationRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});