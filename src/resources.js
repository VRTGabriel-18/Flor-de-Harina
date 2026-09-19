// Define cada recurso del MockAPI una sola vez.
// - La clave (productos, categorias...) es también la ruta de la página: /productos, /categorias...
// - `ruta` es el nombre del recurso en MockAPI (si allá se llama distinto, se cambia solo aquí).
// - `campos` genera el formulario de registro/edición.
// - `columnas` genera la tabla del listado.
// - En un campo `select`: `origen` toma las opciones de otro recurso; `opciones` usa una lista fija.

export const RECURSOS = {
  productos: {
    ruta: 'producto',
    titulo: 'Productos',
    singular: 'Producto',
    icono: '🧁',
    descripcion: 'Registra productos nuevos o edita los que ya aparecen en el catálogo.',
    campos: [
      { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej. Buñuelo de queso' },
      { name: 'precio', label: 'Precio ($)', tipo: 'number', requerido: true, placeholder: 'Ej. 3500' },
      { name: 'categoria', label: 'Categoría', tipo: 'select', origen: 'categorias', requerido: true },
      { name: 'tag', label: 'Etiqueta (opcional)', tipo: 'text', placeholder: 'Ej. Popular, Nuevo' },
      { name: 'imagen', label: 'URL de la imagen', tipo: 'url', placeholder: 'https://ejemplo.com/foto.jpg', completo: true },
      { name: 'descripcion', label: 'Descripción', tipo: 'textarea', placeholder: 'Ingredientes y detalles del producto', completo: true },
    ],
    columnas: [
      { campo: 'imagen', titulo: 'Imagen', tipo: 'imagen' },
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'categoria', titulo: 'Categoría', tipo: 'badge' },
      { campo: 'precio', titulo: 'Precio', tipo: 'precio' },
      { campo: 'tag', titulo: 'Etiqueta', tipo: 'badge' },
    ],
  },

  categorias: {
    ruta: 'categoria',
    titulo: 'Categorías',
    singular: 'Categoría',
    icono: '🗂️',
    descripcion: 'Las categorías organizan el catálogo y aparecen en el menú de navegación.',
    campos: [
      { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej. Pasteles' },
    ],
    columnas: [{ campo: 'nombre', titulo: 'Nombre' }],
  },

  clientes: {
    ruta: 'cliente',
    titulo: 'Clientes',
    singular: 'Cliente',
    icono: '👥',
    descripcion: 'Personas que hacen pedidos en la pastelería.',
    campos: [
      { name: 'nombre', label: 'Nombre completo', tipo: 'text', requerido: true, placeholder: 'Ej. María Pérez' },
      { name: 'email', label: 'Correo electrónico', tipo: 'email', requerido: true, placeholder: 'maria@correo.com' },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'email', titulo: 'Correo' },
    ],
  },

  usuarios: {
    ruta: 'usuario',
    titulo: 'Usuarios',
    singular: 'Usuario',
    icono: '🧑‍🍳',
    descripcion: 'Personal de la pastelería que usa el sistema.',
    campos: [
      { name: 'nombre', label: 'Nombre completo', tipo: 'text', requerido: true, placeholder: 'Ej. Carlos Gómez' },
      { name: 'rol', label: 'Rol', tipo: 'select', opciones: ['Panadero', 'Cajero', 'Administrador'], requerido: true },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'rol', titulo: 'Rol', tipo: 'badge' },
    ],
  },

  ordenes: {
    ruta: 'orden',
    titulo: 'Órdenes',
    singular: 'Orden',
    icono: '🧾',
    descripcion: 'Pedidos registrados. El cliente y el estado se eligen de sus listas.',
    campos: [
      { name: 'cliente', label: 'Cliente', tipo: 'select', origen: 'clientes', requerido: true },
      { name: 'total', label: 'Total ($)', tipo: 'number', requerido: true, placeholder: 'Ej. 25000' },
      { name: 'estado', label: 'Estado', tipo: 'select', origen: 'estados', requerido: true },
    ],
    columnas: [
      { campo: 'cliente', titulo: 'Cliente' },
      { campo: 'total', titulo: 'Total', tipo: 'precio' },
      { campo: 'estado', titulo: 'Estado', tipo: 'badge' },
    ],
  },

  estados: {
    ruta: 'estado_orden',
    titulo: 'Estados',
    singular: 'Estado de orden',
    icono: '🏷️',
    descripcion: 'Etapas por las que pasa una orden, por ejemplo Pendiente o Entregada.',
    campos: [
      { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej. En horno' },
    ],
    columnas: [{ campo: 'nombre', titulo: 'Nombre' }],
  },

  informacion: {
    ruta: 'information',
    titulo: 'Información',
    singular: 'Información general',
    icono: 'ℹ️',
    descripcion: 'Datos de la pastelería que se muestran en el encabezado y el pie de página del sitio.',
    campos: [
      { name: 'nombre', label: 'Nombre de la pastelería', tipo: 'text', requerido: true, placeholder: 'Ej. Flor de Harina' },
      { name: 'descripcion', label: 'Descripción breve', tipo: 'textarea', requerido: true, placeholder: 'Frase corta sobre el negocio', completo: true },
      { name: 'direccion', label: 'Dirección', tipo: 'text', requerido: true, placeholder: 'Ej. Cll 32 #2E - 35, Los Patios' },
      { name: 'horario', label: 'Horario de atención', tipo: 'text', requerido: true, placeholder: 'Ej. Lunes a domingo: 7:00 AM - 7:00 PM' },
      { name: 'telefono', label: 'Teléfono', tipo: 'text', requerido: true, placeholder: 'Ej. +57 320 458 6532' },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'direccion', titulo: 'Dirección' },
      { campo: 'telefono', titulo: 'Teléfono' },
    ],
  },
};
