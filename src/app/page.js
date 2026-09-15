"use client";
import { useState, useEffect } from "react";

import { db, ref, get, update,set  } from "../lib/firebase";
import Logo from "./components/Logo";

export default function InscricaoPage() {
  const [salas, setSalas] = useState({});
  const [temas, setTemas] = useState({});
  const [selecionados, setSelecionados] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [escola, setEscola] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [toastVisivel, setToastVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [qtdSalas, setQtdSalas] = useState(0);

  // Exibir mensagem tipo popup (toast)
  const mostrarMensagem = (msg, tempo = 3000) => {
    setMensagem(msg);
    setToastVisivel(true);
    setTimeout(() => setToastVisivel(false), tempo);
  };

  // Carregar salas do Firebase
  useEffect(() => {
    async function carregarSalas() {
      const snapshot = await get(ref(db, "salas"));
      if (snapshot.exists()) {
        setSalas(snapshot.val());
      } else {
        console.warn("Nenhum sala encontrado.");
      }
    }
    carregarSalas();
  }, [qtdSalas]);


  // Carregar salas do Firebase
  useEffect(() => {
    async function carregarTemas() {
      const snapshot = await get(ref(db, "temas"));
      if (snapshot.exists()) {
        setTemas(snapshot.val());
      } else {
        console.warn("Nenhum sala encontrado.");
      }
    }
    carregarTemas();
  }, []);

  // Lógica para selecionar/deselecionar salas (até 3)
  const toggleSala = (salaId) => {
    if (selecionados.includes(salaId)) {
      setSelecionados(selecionados.filter((t) => t !== salaId));
    } else if (selecionados.length < 2) {

      if (selecionados.length == 1) {
        const selId = selecionados[0];
        if (salas[salaId]?.periodo == salas[selId]?.periodo){
          mostrarMensagem("Você só pode escolher uma sala por periodo!");
          return;
        }
      }
      const total = salas[salaId]?.inscritos || 0;
      const maximo = salas[salaId]?.maximo || 70;
      if (total < maximo) {
        setSelecionados([...selecionados, salaId]);
      } else {
        mostrarMensagem("Esse sala já está lotado!");
      }
    } else {
      mostrarMensagem("Você só pode escolher até 2 salas!");
    }
  };

  // Enviar formulário
  const enviarFormulario = async () => {
    if (!nome || !email || !escola) {
      mostrarMensagem("Preencha todos os campos!");
      return;
    }
    if (selecionados.length === 0) {
      mostrarMensagem("Escolha pelo menos 1 sala!");
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

      // Atualizar contador de inscritos em cada sala
      for (const salaId of selecionados) {
        const salaRef = ref(db, `salas/${salaId}/inscritos`);
        const snapshot = await get(salaRef);
        const total = snapshot.exists() ? snapshot.val() + 1 : 1;
        await update(ref(db, `salas/${salaId}`), { inscritos: total });
      }

      mostrarMensagem("✅ Inscrição realizada com sucesso!", 4000);
      setNome("");
      setEmail("");
      setEscola("");
      setSelecionados([]);
      setQtdSalas(qtdSalas+1);
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
        <p className="text-muted">Escolha <strong>2 salas</strong> disponíveis abaixo.</p>
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

       {/* Lista de salas */}
        <h5 className="mb-3">Salas disponíveis</h5>
        <div className="row g-3">
          {/* Coluna MATUTINO */}
          <div className="col-md-6 d-flex flex-column gap-2">
            <h5 className="mb-3">Matutino</h5>
            <div className="row row-cols-1 g-3 align-items-stretch">
              {Object.entries(salas).map(([id, sala]) => {
                const total = sala.inscritos || 0;
                const isSelecionado = selecionados.includes(id);
                const isLotado = total >= 50;
                const temasDaSala = sala.temas;

                if (sala.periodo == "vespertino") return null;

                return (
                  <div className="col d-flex" key={id}>
                    <div className="card flex-fill border shadow-sm" >
                      <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: "55vh" }} >
                        <h6 className="card-title fw-bold">{sala.nome}</h6>
                            {
                              Object.entries(temas).map(([id, tema]) => {
                                if (id == temasDaSala.tema1 || id == temasDaSala.tema2){
                                  return (
                                      <>
                                        
                                        <p className="card-subtitle mb-2">
                                          <b>Tema:</b> <i>{tema.nome}</i>
                                          <br/>
                                          <small className="text-muted mb-2">
                                            Palestrante: {tema.palestrante}
                                          </small>
                                        </p>
                                      </>
                                    )
                                }
                              })

                            }
                          <button
                            className={`btn ${
                              isSelecionado
                                ? "btn-success"
                                : isLotado
                                ? "btn-danger"
                                : "btn-primary"
                            }`}
                            disabled={isLotado}
                            onClick={() => toggleSala(id)}
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
            </div>


          {/* Coluna VESPERTINO */}
          <div className="col-md-6 d-flex flex-column gap-2">
            <h5 className="mb-3">Vespertino</h5>
            <div className="row row-cols-1 g-3 align-items-stretch">
              {Object.entries(salas).map(([id, sala]) => {
                const total = sala.inscritos || 0;
                const isSelecionado = selecionados.includes(id);
                const isLotado = total >= 50;
                const temasDaSala = sala.temas;

                if (sala.periodo == "matutino") return null;

                return (
                  <div className="col d-flex" key={id}>
                    <div className="card flex-fill border shadow-sm">
                      <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: "55vh" }} >
                        <h6 className="card-title fw-bold">{sala.nome}</h6>
                          {
                              Object.entries(temas).map(([id, tema]) => {
                                if (id == temasDaSala.tema1 || id == temasDaSala.tema2){
                                  return (
                                      <>
                                        
                                        <p className="card-subtitle mb-2">
                                          <b>Tema:</b> <i>{tema.nome}</i>
                                          <br/>
                                          <small className="text-muted mb-2">
                                            Palestrante: {tema.palestrante}
                                          </small>
                                        </p>
                                      </>
                                    )
                                }
                              })

                            }
                          <button
                            className={`btn ${
                              isSelecionado
                                ? "btn-success"
                                : isLotado
                                ? "btn-danger"
                                : "btn-primary"
                            }`}
                            disabled={isLotado}
                            onClick={() => toggleSala(id)}
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
            </div>

                    
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
        <small>© {new Date().getFullYear()} - Sissala de Inscrições do Evento</small>
      </footer>
    </div>
  );
}
