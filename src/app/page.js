"use client";
import { useState, useEffect } from "react";

import { db, ref, get, update,set  } from "../lib/firebase";
import Logo from "./components/Logo";

export default function InscricaoPage() {
  const [temas, setTemas] = useState({});
  const [selecionados, setSelecionados] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [escola, setEscola] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [toastVisivel, setToastVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [qtdTemas, setQtdTemas] = useState(0);

  // Exibir mensagem tipo popup (toast)
  const mostrarMensagem = (msg, tempo = 3000) => {
    setMensagem(msg);
    setToastVisivel(true);
    setTimeout(() => setToastVisivel(false), tempo);
  };

  // Carregar temas do Firebase
  useEffect(() => {
    async function carregarTemas() {
      const snapshot = await get(ref(db, "temas"));
      if (snapshot.exists()) {
        setTemas(snapshot.val());
      } else {
        console.warn("Nenhum tema encontrado.");
      }
    }
    carregarTemas();
  }, [qtdTemas]);

  // Lógica para selecionar/deselecionar temas (até 3)
  const toggleTema = (temaId) => {
    if (selecionados.includes(temaId)) {
      setSelecionados(selecionados.filter((t) => t !== temaId));
    } else if (selecionados.length < 3) {
      const total = temas[temaId]?.inscritos || 0;
      if (total < 50) {
        setSelecionados([...selecionados, temaId]);
      } else {
        mostrarMensagem("Esse tema já está lotado!");
      }
    } else {
      mostrarMensagem("Você só pode escolher até 3 temas.");
    }
  };

  // Enviar formulário
  const enviarFormulario = async () => {
    if (!nome || !email || !escola) {
      mostrarMensagem("Preencha todos os campos!");
      return;
    }
    if (selecionados.length === 0) {
      mostrarMensagem("Escolha pelo menos 1 tema!");
      return;
    }

    setCarregando(true);
    const userKey = email.replace(/\W/g, "_");

    try {
      // Salvar os dados do participante
      await set(ref(db, `inscritos/${userKey}`), {
        nome,
        email,
        escola,
        cursos: selecionados,
        data: new Date().toISOString()
      });

      // Atualizar contador de inscritos em cada tema
      for (const temaId of selecionados) {
        const temaRef = ref(db, `temas/${temaId}/inscritos`);
        const snapshot = await get(temaRef);
        const total = snapshot.exists() ? snapshot.val() + 1 : 1;
        await update(ref(db, `temas/${temaId}`), { inscritos: total });
      }

      mostrarMensagem("✅ Inscrição realizada com sucesso!", 4000);
      setNome("");
      setEmail("");
      setEscola("");
      setSelecionados([]);
      setQtdTemas(qtdTemas+1);
    } catch (err) {
      console.error(err);
      mostrarMensagem("Erro ao enviar inscrição. Tente novamente.", 4000);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container py-5 ">
      {/* Logo e título */}
      <div className="text-center mb-4">
        <Logo />
        <h1 className="fw-bold text-primary">Formulário de Inscrição</h1>
        <p className="text-muted">Escolha até <strong>3 temas</strong> disponíveis abaixo.</p>
      </div>

      {/* Toast popup */}
      <div
        className={`position-fixed top-0 end-0 p-3 ${toastVisivel ? "d-block" : "d-none"}`}
        style={{ zIndex: 1055 }}
      >
        <div className="toast show text-white bg-primary border-0">
          <div className="d-flex">
            <div className="toast-body">{mensagem}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastVisivel(false)}></button>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 700 }}>
        <div className="mb-3">
          <label className="form-label">Nome completo</label>
          <input
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Nome da escola</label>
          <input
            className="form-control"
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            placeholder="Digite o nome da sua escola"
          />
        </div>

        {/* Lista de temas */}
        <h5 className="mb-3">Temas disponíveis</h5>
        <div className="row g-3">
          {Object.entries(temas).map(([id, tema]) => {
            const total = tema.inscritos || 0;
            const isSelecionado = selecionados.includes(id);
            const isLotado = total >= 50;
            return (
              <div className="col-md-6" key={id}>
                <div className="card h-100 border shadow-sm">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h6 className="card-title fw-bold">{tema.nome}</h6>
                    <p className="text-muted mb-2">
                      Inscritos: {total} / 50
                    </p>
                    <button
                      className={`btn ${
                        isSelecionado
                          ? "btn-success"
                          : isLotado
                          ? "btn-danger"
                          : "btn-primary"
                      }`}
                      disabled={isLotado}
                      onClick={() => toggleTema(id)}
                    >
                      {isSelecionado
                        ? "Selecionado"
                        : isLotado
                        ? "Lotado"
                        : "Escolher"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="d-grid mt-4">
          <button
            className="btn btn-success"
            onClick={enviarFormulario}
            disabled={carregando}
          >
            {carregando ? "Enviando..." : "Enviar Inscrição"}
          </button>
        </div>
      </div>

      <footer className="text-center mt-5 text-muted">
        <hr />
        <small>© {new Date().getFullYear()} - Sistema de Inscrições do Evento</small>
      </footer>
    </div>
  );
}
