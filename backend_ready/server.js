import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// In-memory data
let flights = [
  { id: "1", code: "AI101", from: "BOM", to: "DEL", departAt: new Date(Date.now()+86400000).toISOString(), arriveAt: new Date(Date.now()+90000000).toISOString(), price: 5500, seats: 60 },
  { id: "2", code: "AI202", from: "DEL", to: "BLR", departAt: new Date(Date.now()+172800000).toISOString(), arriveAt: new Date(Date.now()+180000000).toISOString(), price: 6200, seats: 50 }
];
let bookings = [];
let idCounter = 3;

app.get("/", (req, res) => res.json({ ok: true, message: "Airline API (in-memory) running" }));

app.get("/api/flights", (req, res) => res.json({ ok: true, flights }));

app.post("/api/bookings", (req, res) => {
  const { userEmail, flightId, passengers = [] } = req.body;
  const booking = { id: String(idCounter++), userEmail, flightId, status: "PENDING", passengers };
  bookings.push(booking);
  res.status(201).json({ ok: true, booking });
});

app.patch("/api/bookings/:id/cancel", (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ ok: false, error: "Not found" });
  if (b.status === "PAID") return res.status(400).json({ ok: false, error: "Cannot cancel a paid booking" });
  b.status = "CANCELLED";
  res.json({ ok: true, booking: b });
});

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
