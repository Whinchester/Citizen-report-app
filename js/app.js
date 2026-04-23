let incidents = JSON.parse(localStorage.getItem("incidents")) || [];

function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;

  localStorage.setItem("currentUser", username);

  alert("Login successful!");
  window.location.href = "../index.html";
}

// SAVE INCIDENT
async function saveIncident(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const currentUser = localStorage.getItem("currentUser");

  const file = document.getElementById("image").files[0];

  let imageData = "";

  if (file) {
    imageData = await toBase64(file);
  }

  const incident = {
    title,
    category,
    description,
    latitude,
    longitude,
    image: imageData,
    user: currentUser
  };

  incidents.push(incident);
  localStorage.setItem("incidents", JSON.stringify(incidents));

  alert("Incident submitted!");
  window.location.href = "incidents.html";
}

// LOAD INCIDENTS
function loadIncidents() {
  const container = document.getElementById("incidentList");

  if (!container) return;

  const savedIncidents = JSON.parse(localStorage.getItem("incidents")) || [];

  container.innerHTML = "";

  if (savedIncidents.length === 0) {
    container.innerHTML = "<p>No incidents submitted yet.</p>";
    return;
  }

  savedIncidents.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p>${item.description}</p>
      <p><strong>Lat:</strong> ${item.latitude || "N/A"}</p>
      <p><strong>Lng:</strong> ${item.longitude || "N/A"}</p>
      ${item.image ? `<img src="${item.image}" style="width:100%; margin-top:10px;">` : ""}
    `;

    container.appendChild(div);
  });
}

// FILTER INCIDENTS
function filterIncidents() {
  const selected = document.getElementById("filter").value;
  const container = document.getElementById("incidentList");
  const savedIncidents = JSON.parse(localStorage.getItem("incidents")) || [];

  container.innerHTML = "";

  const filtered = savedIncidents.filter((item) => {
    return selected === "All" || item.category === selected;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No incidents found for this category.</p>";
    return;
  }

  filtered.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p>${item.description}</p>
      <p><strong>Lat:</strong> ${item.latitude || "N/A"}</p>
      <p><strong>Lng:</strong> ${item.longitude || "N/A"}</p>
      ${item.image ? `<img src="${item.image}" style="width:100%; margin-top:10px;">` : ""}
    `;

    container.appendChild(div);
  });
}

function loadMyIncidents() {
  const container = document.getElementById("myList");
  const currentUser = localStorage.getItem("currentUser");
  const savedIncidents = JSON.parse(localStorage.getItem("incidents")) || [];

  if (!container) return;

  container.innerHTML = "";

  const mine = savedIncidents.filter(item => item.user === currentUser);

  if (mine.length === 0) {
    container.innerHTML = "<p>No incidents submitted by you.</p>";
    return;
  }

  mine.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.category}</p>
      <p>${item.description}</p>
      <p>Lat: ${item.latitude}</p>
      <p>Lng: ${item.longitude}</p>
      ${item.image ? `<img src="${item.image}" style="width:100%">` : ""}
    `;

    container.appendChild(div);
  });
}

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      document.getElementById("latitude").value = position.coords.latitude;
      document.getElementById("longitude").value = position.coords.longitude;
    },
    function(error) {
      alert("Error getting location");
    }
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}