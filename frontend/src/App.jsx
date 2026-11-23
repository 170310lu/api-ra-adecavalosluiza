import { useEffect, useState } from 'react';
import { api } from './api.js';
import AuthDialog from './AuthDialog.jsx';
import RaceCard from './RaceCard.jsx';
import RaceForm from './RaceForm.jsx';

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

export default function App() {
  const [racas, setRacas] = useState([]);
  const [consulta, setConsulta] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [initialToken] = useState(() => window.localStorage.getItem('racas-token'));
  const [token, setToken] = useState(initialToken);
  const [usuario, setUsuario] = useState(null);
  const [verificandoSessao, setVerificandoSessao] = useState(Boolean(initialToken));
  const [dialogoAuth, setDialogoAuth] = useState(false);
  const [modoAuth, setModoAuth] = useState('login');
  const [erroAuth, setErroAuth] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [formularioRaca, setFormularioRaca] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    let ativo = true;
    api('/racas')
      .then((resultado) => { if (ativo) setRacas(resultado.data); })
      .catch((error) => { if (ativo) setMensagem({ tipo: 'erro', texto: error.message }); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let ativo = true;
    api('/auth/me', { token })
      .then((resultado) => { if (ativo) setUsuario(resultado.data); })
      .catch((error) => {
        if (!ativo) return;
        window.localStorage.removeItem('racas-token');
        setToken(null);
        setUsuario(null);
        setMensagem({ tipo: 'erro', texto: 'Sua sessão expirou. Entre novamente para continuar.' });
      })
      .finally(() => { if (ativo) setVerificandoSessao(false); });
    return () => { ativo = false; };
  }, [token]);

  async function recarregarRacas() {
    const resultado = await api('/racas');
    setRacas(resultado.data);
  }

  async function autenticar(dados) {
    setErroAuth('');
    setSalvando(true);
    try {
      if (dados.modo === 'register') {
        await api('/auth/cadastro', {
          method: 'POST',
          body: JSON.stringify({ nome: dados.nome, email: dados.email, senha: dados.senha })
        });
        setModoAuth('login');
        setDialogoAuth(false);
        setMensagem({ tipo: 'sucesso', texto: 'Cadastro realizado. Entre com seu email e senha.' });
        return;
      }
      const resultado = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: dados.email, senha: dados.senha })
      });
      window.localStorage.setItem('racas-token', resultado.data.token);
      setToken(resultado.data.token);
      setUsuario(resultado.data.usuario);
      setDialogoAuth(false);
      setMensagem({ tipo: 'sucesso', texto: `Bem-vinda, ${resultado.data.usuario.nome}. Login realizado com sucesso.` });
    } catch (error) {
      setErroAuth(error.message);
    } finally {
      setSalvando(false);
    }
  }

  function abrirAuth(modo = 'login') {
    setModoAuth(modo);
    setErroAuth('');
    setDialogoAuth(true);
  }

  function abrirFormulario(raca = {}) {
    setErroFormulario('');
    setFormularioRaca(raca);
  }

  function encerrarSessao() {
    window.localStorage.removeItem('racas-token');
    setToken(null);
    setUsuario(null);
    setMensagem({ tipo: 'sucesso', texto: 'Você saiu da sua conta.' });
  }

  function tratarErro(error) {
    if (error.status === 401 && token) {
      encerrarSessao();
      setMensagem({ tipo: 'erro', texto: 'Sua sessão expirou. Entre novamente para continuar.' });
      return;
    }
    setMensagem({ tipo: 'erro', texto: error.message });
  }

  async function salvarRaca(dados) {
    setSalvando(true);
    try {
      const editando = Boolean(formularioRaca?.id);
      const path = editando ? `/racas/${formularioRaca.id}` : '/racas';
      await api(path, {
        method: editando ? 'PATCH' : 'POST',
        token,
        body: JSON.stringify(dados)
      });
      await recarregarRacas();
      setFormularioRaca(null);
      setErroFormulario('');
      setMensagem({ tipo: 'sucesso', texto: editando ? 'Raça atualizada com sucesso.' : 'Raça cadastrada com sucesso.' });
    } catch (error) {
      setErroFormulario(error.message);
      tratarErro(error);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirRaca(raca) {
    if (!window.confirm(`Excluir a raça ${raca.nome}?`)) return;
    try {
      await api(`/racas/${raca.id}`, { method: 'DELETE', token });
      await recarregarRacas();
      setMensagem({ tipo: 'sucesso', texto: 'Raça excluída com sucesso.' });
    } catch (error) {
      tratarErro(error);
    }
  }

  const termo = normalizar(consulta.trim());
  const racasVisiveis = racas.filter((raca) =>
    normalizar(`${raca.nome} ${raca.origem} ${raca.finalidade}`).includes(termo)
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Atlas Equino, início">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span><strong>ATLAS EQUINO</strong><small>RAÇAS & CULTURA</small></span>
        </a>
        <nav className="header-actions" aria-label="Conta">
          {usuario ? (
            <>
              <span className="user-greeting">Olá, {usuario.nome}</span>
              <button className="button button-outline" type="button" onClick={encerrarSessao}>Sair</button>
            </>
          ) : (
            <button className="button button-outline" type="button" onClick={() => abrirAuth()} disabled={verificandoSessao}>
              {verificandoSessao ? 'Verificando...' : 'Entrar'}
            </button>
          )}
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> CADERNO DE CAMPO <span>·</span> 01</p>
          <h1>Raças que contam<br />histórias.</h1>
          <p className="hero-description">Um catálogo para conhecer a origem, o temperamento e as aptidões de cada raça equina.</p>
          <div className="hero-bottom">
            <span className="catalog-count"><strong>{racas.length.toString().padStart(2, '0')}</strong> raças catalogadas</span>
            <span className="hero-note">CONHECIMENTO EM MOVIMENTO</span>
          </div>
        </div>
        <figure className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=85"
            alt="Cavalo em movimento em uma paisagem aberta"
          />
          <figcaption>HERANÇA · MOVIMENTO · TERRITÓRIO</figcaption>
        </figure>
      </section>

      <section className="catalog-section" aria-labelledby="catalog-heading">
        <div className="catalog-heading-row">
          <div>
            <p className="eyebrow">REGISTRO EQUESTRE</p>
            <h2 id="catalog-heading">O catálogo</h2>
          </div>
          <div className="catalog-controls">
            <label className="search-box">
              <span className="search-icon" aria-hidden="true" />
              <span className="visually-hidden">Buscar raças</span>
              <input value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Buscar raça, origem..." />
            </label>
            <button className="button button-primary" type="button" onClick={() => usuario ? abrirFormulario() : abrirAuth()}>
              <span aria-hidden="true">+</span> Nova raça
            </button>
          </div>
        </div>

        {mensagem && (
          <div className={`notice notice-${mensagem.tipo}`} role={mensagem.tipo === 'erro' ? 'alert' : 'status'}>
            <span>{mensagem.texto}</span>
            <button className="notice-close" type="button" onClick={() => setMensagem(null)} aria-label="Fechar mensagem">×</button>
          </div>
        )}

        {carregando ? (
          <div className="loading-state"><span className="spinner" /> Carregando catálogo...</div>
        ) : racasVisiveis.length ? (
          <div className="race-grid">
            {racasVisiveis.map((raca) => (
              <RaceCard
                key={raca.id}
                raca={raca}
                canEdit={Boolean(usuario)}
                onEdit={abrirFormulario}
                onDelete={excluirRaca}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">∅</span>
            <h3>{consulta ? 'Nenhuma raça encontrada' : 'O catálogo está vazio'}</h3>
            <p>{consulta ? 'Tente outra busca por nome, origem ou finalidade.' : 'Cadastre a primeira raça para iniciar o catálogo.'}</p>
            {!consulta && !usuario && <button className="button button-outline" type="button" onClick={() => abrirAuth('register')}>Criar acesso</button>}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <span>ATLAS EQUINO <span aria-hidden="true">·</span> UM REGISTRO VIVO DAS RAÇAS</span>
        <span>CONSULTA E GESTÃO DE RAÇAS EQUESTRES</span>
      </footer>

      {dialogoAuth && (
        <AuthDialog
          mode={modoAuth}
          error={erroAuth}
          loading={salvando}
          onClose={() => setDialogoAuth(false)}
          onModeChange={(modo) => { setModoAuth(modo); setErroAuth(''); }}
          onSubmit={autenticar}
        />
      )}
      {formularioRaca && usuario && (
        <RaceForm
          raca={formularioRaca.id ? formularioRaca : null}
          error={erroFormulario}
          saving={salvando}
          onCancel={() => setFormularioRaca(null)}
          onSave={salvarRaca}
        />
      )}
    </main>
  );
}