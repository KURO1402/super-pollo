const express = require("express");
const router = express.Router();

//  Registrar una venta
router.post("/registrar", (req, res) => {
  console.log("Datos recibidos en /ventas/registrar:", req.body);
  res.json({
    ok: true,
    mensaje: "Venta recibida correctamente (solo consola por ahora)"
  });
});

// Listar ventas con paginación
router.get("/", (req, res) => {
  const { pagina, limite } = req.query;
  console.log("Parámetros recibidos en /ventas:", { pagina, limite });
  res.json({
    ok: true,
    mensaje: "Listado de ventas (solo consola por ahora)"
  });
});

// Obtener venta por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID recibido en /ventas/:id:", id);
  res.json({
    ok: true,
    mensaje: `Detalle de la venta ${id}`
  });
});

// Obtener detalle de productos de una venta
router.get("/:id/detalle", (req, res) => {
  const { id } = req.params;
  console.log(" ID recibido en /ventas/:id/detalle:", id);
  res.json({
    ok: true,
    mensaje: `Detalle de productos de la venta ${id} `
  });
});

//  Actualizar una venta (ejemplo de update)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  console.log(" Datos recibidos en PUT /ventas/:id:", { id, body: req.body });
  res.json({
    ok: true,
    mensaje: `Venta ${id} actualizada correctamente`
  });
});

// Eliminar una venta 
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID recibido en DELETE /ventas/:id:", id);
  res.json({
    ok: true,
    mensaje: `Venta ${id} eliminada correctamente`
  });
});

module.exports = router;
