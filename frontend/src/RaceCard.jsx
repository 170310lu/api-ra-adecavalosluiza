export default function RaceCard({ raca, canEdit, onEdit, onDelete }) {
  return (
    <article className="race-card">
      <div className="race-card-top">
        <span className="race-id">Nº {String(raca.id).padStart(2, '0')}</span>
        {canEdit && (
          <div className="card-actions">
            <button className="icon-button" type="button" onClick={() => onEdit(raca)} aria-label={`Editar ${raca.nome}`} title="Editar">
              <span aria-hidden="true">✎</span>
            </button>
            <button className="icon-button icon-danger" type="button" onClick={() => onDelete(raca)} aria-label={`Excluir ${raca.nome}`} title="Excluir">
              <span aria-hidden="true">⌫</span>
            </button>
          </div>
        )}
      </div>
      <h2>{raca.nome}</h2>
      <p className="race-origin">{raca.origem}</p>
      <p className="race-description">{raca.descricao}</p>
      <div className="race-measures">
        <div><span>Altura média</span><strong>{raca.alturaMediaCm} <small>cm</small></strong></div>
        <div><span>Peso médio</span><strong>{raca.pesoMedioKg} <small>kg</small></strong></div>
      </div>
      <dl className="race-details">
        <div><dt>Pelagem</dt><dd>{raca.pelagem}</dd></div>
        <div><dt>Temperamento</dt><dd>{raca.temperamento}</dd></div>
        <div><dt>Finalidade</dt><dd>{raca.finalidade}</dd></div>
      </dl>
    </article>
  );
}