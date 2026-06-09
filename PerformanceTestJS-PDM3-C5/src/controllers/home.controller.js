import ReservationCard from "@components/ReservationCard";
import { getReservations, createReservation, updateReservation, deleteReservation } from "@services/reservation.service";
import { getSession } from "@/utils";

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");

  const user = getSession();

  const reservations = await getReservations();

  const filteredReservations =
    user.role === "admin"
      ? reservations
      : reservations.filter((reservation) => reservation.userId === user.id);

  container.innerHTML = filteredReservations?.length
    ? filteredReservations
        .map((reservation) => ReservationCard(reservation, user.role))
        .join("")
    : `
      <div class="w-full text-center py-8 col-span-2">
        <p class="text-slate-500">
          No hay reservas disponibles
        </p>
      </div>
    `;

  document.querySelector("#newReservation")?.addEventListener("click", () => {
    container.innerHTML = `
      <form id="reservationForm" class="flex flex-col gap-3 p-4">
        <input name="workspace" placeholder="Sala" class="border p-2 rounded" required />
        <input name="date" type="date" class="border p-2 rounded" required />
        <input name="startHour" type="time" class="border p-2 rounded" required />
        <input name="endHour" type="time" class="border p-2 rounded" required />
        <input name="reason" placeholder="Motivo" class="border p-2 rounded" required />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    `;

    document.querySelector("#reservationForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      await createReservation({
        userId: user.id,
        workspace: form.workspace.value,
        date: form.date.value,
        startHour: form.startHour.value,
        endHour: form.endHour.value,
        reason: form.reason.value,
        status: "pending"
      });
      homeController();
    });
  });

  document.querySelector("#manageReservation")?.addEventListener("click", () => {
    container.innerHTML = `
      <form id="reservationForm" class="flex flex-col gap-3 p-4">
        <input name="workspace" placeholder="Sala" class="border p-2 rounded" required />
        <input name="date" type="date" class="border p-2 rounded" required />
        <input name="startHour" type="time" class="border p-2 rounded" required />
        <input name="endHour" type="time" class="border p-2 rounded" required />
        <input name="reason" placeholder="Motivo" class="border p-2 rounded" required />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    `;

    document.querySelector("#reservationForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      await createReservation({
        userId: user.id,
        workspace: form.workspace.value,
        date: form.date.value,
        startHour: form.startHour.value,
        endHour: form.endHour.value,
        reason: form.reason.value,
        status: "pending"
      });
      homeController();
    });
  });

  // DELETE
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteReservation(id);
      homeController();
    });
  });

  // EDIT
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const reservation = reservations.find((r) => r.id == id);

      container.innerHTML = `
        <form id="editForm" class="flex flex-col gap-3 p-4">
          <input name="workspace" value="${reservation.workspace}" class="border p-2 rounded" required />
          <input name="date" type="date" value="${reservation.date}" class="border p-2 rounded" required />
          <input name="startHour" type="time" value="${reservation.startHour}" class="border p-2 rounded" required />
          <input name="endHour" type="time" value="${reservation.endHour}" class="border p-2 rounded" required />
          <input name="reason" value="${reservation.reason}" class="border p-2 rounded" required />
          <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Actualizar</button>
        </form>
      `;

      document.querySelector("#editForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        await updateReservation(id, {
          workspace: form.workspace.value,
          date: form.date.value,
          startHour: form.startHour.value,
          endHour: form.endHour.value,
          reason: form.reason.value,
          status: reservation.status
        });
        homeController();
      });
    });
  });

  // APROBAR
  document.querySelectorAll(".approveBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const reservation = reservations.find((r) => r.id == id);
      await updateReservation(id, { ...reservation, status: "approved" });
      homeController();
    });
  });

  // RECHAZAR
  document.querySelectorAll(".rejectBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const reservation = reservations.find((r) => r.id == id);
      await updateReservation(id, { ...reservation, status: "rejected" });
      homeController();
    });
  });

};