import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json(orders);
  } catch (error) {
    console.error("GET orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// POST create an order
router.post("/", async (req, res) => {
  try {
    const { status, orderType, tableId, items } = req.body;

    if (!status || status.trim() === "") {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!orderType || orderType.trim() === "") {
      return res.status(400).json({ error: "Order type is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include at least one item" });
    }

    for (const item of items) {
      if (!item.menuItemId || item.menuItemId <= 0) {
        return res.status(400).json({ error: "Each item must have a valid menuItemId" });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: "Each item quantity must be greater than 0" });
      }
    }

    const order = await prisma.order.create({
      data: {
        status,
        orderType,
        tableId,
        orderItems: {
          create: items.map((item: { menuItemId: number; quantity: number }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        table: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("POST order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});


// PATCH update an order
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: req.body
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("PATCH order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// DELETE an order
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("DELETE order error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;