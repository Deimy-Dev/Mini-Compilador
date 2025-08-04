// public/app.js
async function compileCode() {
  const code = document.getElementById("code").value;

  const res = await fetch("/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });

  const result = await res.json();
  document.getElementById("output").innerText = result.output;
}