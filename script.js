document.addEventListener('DOMContentLoaded', () => {
    const catalogo = document.getElementById('catalogo');

    // Función para cargar vehículos desde el backend
    const cargarVehiculos = async () => {
        try {
            const response = await fetch('http://localhost:3000/vehiculos');
            const vehiculos = await response.json();

            vehiculos.forEach(vehiculo => {
                const vehiculoDiv = document.createElement('div');
                vehiculoDiv.classList.add('vehiculo');

                vehiculoDiv.innerHTML = `
                    <img src="${vehiculo.imagen_url}" alt="Imagen de ${vehiculo.marca} ${vehiculo.modelo}">
                    <div class="info">
                        <h2>${vehiculo.marca} ${vehiculo.modelo}</h2>
                        <p>Tipo: ${vehiculo.tipo}</p>
                        <p>Año: ${vehiculo.anio}</p>
                        <p>Precio: $${vehiculo.precio.toFixed(2)}</p>
                        <p>${vehiculo.descripcion}</p>
                    </div>
                `;

                catalogo.appendChild(vehiculoDiv);
            });
        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
        }
    };

    cargarVehiculos();
});