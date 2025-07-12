async function getCurrentUser() {
  try {
    const res = await fetch("/api/sessions/current");
    const data = await res.json();
    if (res.status === 200) {
      document.getElementById("userInfo").innerText = JSON.stringify(data.user, null, 2);
    } else {
      alert(data.message || "No autorizado");
      window.location.href = "/login";
    }
  } catch (error) {
    alert("Error al cargar usuario");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("getUserBtn")?.addEventListener("click", getCurrentUser);
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/sessions/logout", { method: "POST" });
      const result = await res.json();
      document.cookie = "token=; Max-Age=0; path=/;";
      alert(result.message || "Sesión cerrada");
      window.location.href = "/login";
    } catch (error) {
      alert("Error al cerrar sesión");
    }
  });
});
