import { useEffect, useState } from 'react'
import { listPhotos, createPhoto, updatePhoto, deletePhoto } from './api.js';
import PhotoCard from "./components/PhotoCard.jsx"
import PhotoForm from "./components/PhotoForm.jsx"
import './App.css'

export default function App (){
  const [photos, setPhotos] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

async function load() {
  try {
    const loadedPhotos = await listPhotos();
    setError("");
    setPhotos(loadedPhotos);
  } catch {
    setError("could not reach the backend. Is Django running on port 8000?");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  let active = true;
  listPhotos()
    .then((loadedPhotos) => {
      if (!active) return;
      setError("");
      setPhotos(loadedPhotos);
    })
    .catch(() => {
      if (active) {
        setError("could not reach the backend. Is Django running on port 8000?");
      }
    })
    .finally(() => {
      if (active) setLoading(false);
    });
  return () => {
    active = false;
  };
}, []);

async function handleSave(formData) {
  if (editing && editing.id){
    await updatePhoto(editing.id, formData);
  }else {
    await createPhoto(formData);
  }
  setEditing(null);
  await load();  
}

async function handleDelete(photo) {
  if (!window.confirm(`Delete "${photo.title}"?`)) return;
  try {
    await deletePhoto(photo.id);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }catch (e) {
    setError(e.message);
  }
}

return (
  <div className="app">
    <header className = "top">
      <h1>Photo Gallery</h1>
      {/*{} as the editing value means "open the form to add a new photo"*/}
      <button className= "btn primary" onClick={() => setEditing({})}>
        + Add photo
      </button>
    </header>

    {/* "a && b" shows b only when a is true */}
    {error && <p className= "error">{error}</p>}
    {loading && <p className= "muted">Loading</p>}

    {!loading && !error && photos.length === 0 && (
      <p className= "muted empty">No photos yet. Click "Add photo" to upload your first one.</p>
    )}

    <div className="grid">
      {/* .map turns each photo into a card. "key" lets React track items.*/}
      {photos.map((photo) =>(
        <PhotoCard
        key ={photo.id}
        photo={photo}
        onView={() => setViewing(photo)}
        onEdit={() => setEditing(photo)}
        onDelete={() => handleDelete(photo)}
        />
      ))}
    </div>

    {editing && (
      <PhotoForm
      photo= {editing.id ? editing: null}
      onSave ={handleSave}
      onCancel ={() => setEditing(null)}
      />
    )}

    {viewing && (
      <div className="overlay" onClick={() => setViewing(null)}>
        <figure className="lightbox" onClick={(e) => e.stopPropagation()}>
          <img src={viewing.image} alt={viewing.title}/>
          <figcaption>
            <strong>{viewing.title}</strong>
            {viewing.description && <p>{viewing.description}</p>}
          </figcaption>
        </figure>
      </div>
    )}
  </div>
);
}
