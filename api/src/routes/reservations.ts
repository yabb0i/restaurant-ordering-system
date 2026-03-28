import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, partySize, reservationTime, status, tableId } = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        partySize,
        reservationTime: new Date(reservationTime),
        status,
        tableId
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data
    });

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update reservation" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.reservation.delete({
      where: { id }
    });

    res.json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});

export default router;