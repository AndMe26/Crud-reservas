export default function ReservationCard(reservation, role) {
  const { id, workspace, date, startHour, endHour, reason, status } = reservation;
  return `
    <article class="rounded border p-4">
      <h3 class="font-bold text-lg">${workspace}</h3>

      <div class="">
        <p>Fecha: ${date}</p>
        <p>Horario: ${startHour} - ${endHour}</p>
        <p>Motivo: ${reason}</p>
        <p>Estado: <span>${status}</span></p>
      </div>

      <div class="flex gap-2 mt-3">
        <button class="editBtn bg-yellow-500 text-white px-3 py-1 rounded" data-id="${id}">Editar</button>
        <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded" data-id="${id}">Eliminar</button>

        ${role === "admin" ? `
          <button class="approveBtn bg-green-600 text-white px-3 py-1 rounded" data-id="${id}">Aprobar</button>
          <button class="rejectBtn bg-gray-500 text-white px-3 py-1 rounded" data-id="${id}">Rechazar</button>
        ` : ""}
      </div>
    </article>
  `;
}