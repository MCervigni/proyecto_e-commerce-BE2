document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch("/api/sessions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.status >= 400) {
      alert(result.error || result.message || "Credenciales inválidas");
      return;
    }
    document.getElementById("loginSuccess").style.display = "block";

  } catch (err) {
    alert("Error al iniciar sesión");
  }
});
