import { useState } from "react";

export default function PhotoForm({photo, onSave, onCancel}) {
  const [title, setTitle] = useState(photo?.title ?? "");
  const [description, setDescription] = useState(photo?.description ?? "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const preview = file ? URL.createObjectURL(file) : photo?.image;

  async function submit(e) {
    e.preventDefault();
    if (!photo && !file){
      setError("Please choose a photo.");
      return;
    }
    
    const data =new FormData();
    data.append("title", title);
    data.append("description", description);
    if (file) data.append("image", file);

    setSaving(true);
    setError("");
    try {
      await onSave(data);
    }catch (err){
      setError(err.message);
      setSaving(false);
    }
  }
  return(
    <div className="overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{photo ? "Edit photo" : "Add photo"}</h2>


        {preview && <img className="preview" src={preview} alt="Preview" />}

        <label>
          photo {photo && <span className="muted">(leave empty to keep current)</span>}
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] ??
            null)}/>
        </label>

        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required
          maxLength={120}/>
        </label>

        <label>
          Description
          <textarea row={3} value={description} onChange={(e) => setDescription(e.target.value)}/>
                   
        </label>

        {error && <p className="error">{error}</p>}

        <div className="actions end">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}