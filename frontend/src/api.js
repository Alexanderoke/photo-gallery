const BASE = "http://127.0.0.1:8000/api/photos/";

async function handle(res) {
  if (res.ok) return res.status ===204 ? null : res.json();
  let message = `Request failed(${res.status})`;
  try {
    const data = await res.json();
    message = Object.entries(data)
    .map(([field, msgs]) =>`${field}: ${[].concat(msgs).join("")}`)
    .join("\n");
  }catch {
    
  }
  throw new Error(message);
    
}

export const listPhotos = () => fetch(BASE).then(handle);
export const createPhoto = (formData) =>
  fetch(BASE, {method: "POST", body: formData}).then(handle);

export const updatePhoto = (id, formData) =>
  fetch(`${BASE}${id}/`, {method: "PATCH", body: formData}).then(handle);

export const deletePhoto = (id) =>
  fetch(`${BASE}${id}`, {method: "DELETE"}).then(handle);