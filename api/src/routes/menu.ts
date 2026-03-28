import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany();
    res.json(menuItems);
  } catch (error) {
    console.error("GET menu error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// POST create a menu item
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Menu item name is required" });
    }

    if (price === undefined || price <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        category,
        available
      }
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("POST menu error:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PATCH update a menu item
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid menu item id" });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: req.body
    });

    res.json(updatedMenuItem);
  } catch (error) {
    console.error("PATCH menu error:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE a menu item
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid menu item id" });
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("DELETE menu error:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;