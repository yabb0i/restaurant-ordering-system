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

    if (!customerName || customerName.trim() === "") {
      return res.status(400).json({ error: "Customer name is required" });
    }

    if (!partySize || partySize <= 0) {
      return res.status(400).json({ error: "Party size must be greater than 0" });
    }

    if (!reservationTime) {
      return res.status(400).json({ error: "Reservation time is required" });
    }

    if (!status || status.trim() === "") {
      return res.status(400).json({ error: "Status is required" });
    }

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
    console.error("POST reservation error:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const updateData: any = { ...req.body };

    if (updateData.reservationTime) {
      updateData.reservationTime = new Date(updateData.reservationTime);
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error("PATCH reservation error:", error);
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