document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/sessions/logout", { method: "POST" });
    const data = await res.json();
    alert(data.message);
    document.cookie = "token=; Max-Age=0; path=/;"; // Borra la cookie
    window.location.href = "/login";
  } catch (error) {
    alert("Error al cerrar sesión");
  }
});
