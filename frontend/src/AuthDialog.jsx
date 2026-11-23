import { useState } from 'react';

export default function AuthDialog({ mode, error, loading, onClose, onModeChange, onSubmit }) {
  const [campos, setCampos] = useState({ nome: '', email: '', senha: '' });
  const cadastro = mode === 'register';

  function atualizar(event) {
    setCampos((atuais) => ({ ...atuais, [event.target.name]: event.target.value }));
  }

  async function enviar(event) {
    event.preventDefault();
    await onSubmit({ ...campos, modo: mode });
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="dialog auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Fechar">
          <span aria-hidden="true">×</span>
        </button>
        <p className="eyebrow">ÁREA DO CRIADOR</p>
        <h2 id="auth-title">{cadastro ? 'Criar acesso' : 'Bem-vinda de volta'}</h2>
        <p className="dialog-intro">
          {cadastro ? 'Cadastre-se para contribuir com o catálogo.' : 'Entre para editar e cadastrar raças.'}
        </p>
        <form className="stack-form" onSubmit={enviar}>
          {cadastro && (
            <label>Nome
              <input name="nome" value={campos.nome} onChange={atualizar} autoComplete="name" required />
            </label>
          )}
          <label>Email
            <input name="email" type="email" value={campos.email} onChange={atualizar} autoComplete="email" required />
          </label>
          <label>Senha
            <input name="senha" type="password" value={campos.senha} onChange={atualizar} autoComplete={cadastro ? 'new-password' : 'current-password'} minLength={cadastro ? 8 : undefined} required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-wide" type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : cadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch">
          {cadastro ? 'Já tem acesso?' : 'Ainda não tem acesso?'}{' '}
          <button type="button" className="text-button" onClick={() => onModeChange(cadastro ? 'login' : 'register')}>
            {cadastro ? 'Fazer login' : 'Cadastre-se'}
          </button>
        </p>
      </section>
    </div>
  );
}