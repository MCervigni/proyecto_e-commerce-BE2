document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/sessions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.status >= 400) {
        alert(result.message || result.error || "Error en el registro");
        return;
      }
      alert("Registro exitoso");
      window.location.href = "/login";
    } catch (err) {
      alert("Error en el registro");
    }
  });
