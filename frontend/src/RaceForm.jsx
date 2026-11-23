import { useState } from 'react';

const campos = [
  ['nome', 'Nome da raça', 'text'],
  ['origem', 'Origem', 'text'],
  ['alturaMediaCm', 'Altura média (cm)', 'number'],
  ['pesoMedioKg', 'Peso médio (kg)', 'number'],
  ['pelagem', 'Pelagem', 'text'],
  ['temperamento', 'Temperamento', 'text'],
  ['finalidade', 'Finalidade', 'text']
];

export default function RaceForm({ raca, error, saving, onCancel, onSave }) {
  const [dados, setDados] = useState(() => ({
    nome: raca?.nome || '',
    origem: raca?.origem || '',
    alturaMediaCm: raca?.alturaMediaCm ?? '',
    pesoMedioKg: raca?.pesoMedioKg ?? '',
    pelagem: raca?.pelagem || '',
    temperamento: raca?.temperamento || '',
    finalidade: raca?.finalidade || '',
    descricao: raca?.descricao || ''
  }));

  function atualizar(event) {
    setDados((atuais) => ({ ...atuais, [event.target.name]: event.target.value }));
  }

  async function enviar(event) {
    event.preventDefault();
    await onSave({
      ...dados,
      alturaMediaCm: Number(dados.alturaMediaCm),
      pesoMedioKg: Number(dados.pesoMedioKg)
    });
  }

  return (
    <div className="overlay" role="presentation">
      <section className="dialog race-dialog" role="dialog" aria-modal="true" aria-labelledby="race-title">
        <button className="icon-button dialog-close" type="button" onClick={onCancel} aria-label="Fechar">
          <span aria-hidden="true">×</span>
        </button>
        <p className="eyebrow">CATÁLOGO DE RAÇAS</p>
        <h2 id="race-title">{raca ? 'Editar raça' : 'Nova raça'}</h2>
        <form className="race-form" onSubmit={enviar}>
          {campos.map(([name, label, type]) => (
            <label key={name}>{label}
              <input
                name={name}
                type={type}
                value={dados[name]}
                onChange={atualizar}
                min={type === 'number' ? 1 : undefined}
                step={type === 'number' ? 1 : undefined}
                required
              />
            </label>
          ))}
          <label className="form-description">Descrição
            <textarea name="descricao" value={dados.descricao} onChange={atualizar} rows="3" required />
          </label>
          {error && <p className="form-error form-description" role="alert">{error}</p>}
          <div className="dialog-actions">
            <button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar raça'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}