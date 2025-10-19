const hoy = new Date();
const obtenerFecha = (diasAdelante) => {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() + diasAdelante);
  return fecha.toISOString().split('T')[0];
};

export const mockReservas = [
  {
    id: "1",
    nombreCliente: "Juan Pérez García",
    numeroMesa: 3,
    cantidadPersonas: 4,
    fechaReserva: obtenerFecha(1),
    horaReserva: "19:00",
    estado: "pendiente",
    telefono: "987654321",
    comentarios: "Mesa cerca de la ventana",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "2",
    nombreCliente: "María González López",
    numeroMesa: 5,
    cantidadPersonas: 2,
    fechaReserva: obtenerFecha(2),
    horaReserva: "20:30",
    estado: "confirmado",
    telefono: "912345678",
    comentarios: "Celebración de aniversario",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "3",
    nombreCliente: "Carlos Rodríguez Sánchez",
    numeroMesa: 8,
    cantidadPersonas: 6,
    fechaReserva: obtenerFecha(3),
    horaReserva: "18:30",
    estado: "pendiente",
    telefono: "998877665",
    comentarios: "Reunión familiar",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "4",
    nombreCliente: "Ana Martínez Torres",
    numeroMesa: 2,
    cantidadPersonas: 3,
    fechaReserva: obtenerFecha(1),
    horaReserva: "21:00",
    estado: "pagado",
    telefono: "955443322",
    comentarios: "",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "5",
    nombreCliente: "Roberto Silva Vega",
    numeroMesa: 10,
    cantidadPersonas: 8,
    fechaReserva: obtenerFecha(5),
    horaReserva: "19:30",
    estado: "pendiente",
    telefono: "922334455",
    comentarios: "Cumpleaños - necesitamos decoración",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "6",
    nombreCliente: "Laura Fernández Castro",
    numeroMesa: 1,
    cantidadPersonas: 2,
    fechaReserva: obtenerFecha(0),
    horaReserva: "20:00",
    estado: "pagado",
    telefono: "966778899",
    comentarios: "Primera cita",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "7",
    nombreCliente: "Diego Ramírez Morales",
    numeroMesa: 7,
    cantidadPersonas: 5,
    fechaReserva: obtenerFecha(4),
    horaReserva: "18:00",
    estado: "cancelado",
    telefono: "933221100",
    comentarios: "Cancelado por el cliente",
    fechaCreacion: new Date().toISOString(),
  },
];

export const configuracionMesas = {
  totalMesas: 10,
  mesas: [
    { numero: 1, capacidad: 2, zona: "Ventana" },
    { numero: 2, capacidad: 2, zona: "Ventana" },
    { numero: 3, capacidad: 4, zona: "Central" },
    { numero: 4, capacidad: 4, zona: "Central" },
    { numero: 5, capacidad: 4, zona: "Central" },
    { numero: 6, capacidad: 4, zona: "Terraza" },
    { numero: 7, capacidad: 6, zona: "Terraza" },
    { numero: 8, capacidad: 6, zona: "Sala VIP" },
    { numero: 9, capacidad: 8, zona: "Sala VIP" },
    { numero: 10, capacidad: 8, zona: "Sala VIP" },
  ],
};

export const horariosDisponibles = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

export const estadosReserva = {
  pendiente: {
    valor: "pendiente",
    label: "Pendiente",
    color: "yellow",
    descripcion: "En espera de confirmación"
  },
  confirmado: {
    valor: "confirmado",
    label: "Confirmado",
    color: "blue",
    descripcion: "Reserva confirmada"
  },
  pagado: {
    valor: "pagado",
    label: "Pagado",
    color: "green",
    descripcion: "Pago realizado"
  },
  cancelado: {
    valor: "cancelado",
    label: "Cancelado",
    color: "red",
    descripcion: "Reserva cancelada"
  },
  completado: {
    valor: "completado",
    label: "Completado",
    color: "gray",
    descripcion: "Cliente atendido"
  }
};