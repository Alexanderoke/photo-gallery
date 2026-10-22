//One tile in the grid.

export default function PhotoCard({photo, onView, onEdit, onDelete}) {
  return(
    <article className="card">
      <img src={photo.image} alt={photo.title} onClick={onView} loading="lazy"/>
      <div className="card-body">
        <h3>{photo.title}</h3>
        {photo.description && <p>{photo.description}</p>}
        <div className="actions">
          <button className="btn" onClick={onEdit}>Edit</button>
          <button className="btn danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </article>
  );
}