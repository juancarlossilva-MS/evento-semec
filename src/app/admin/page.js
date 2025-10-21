"use client";

import { useEffect, useState } from "react";
import { db, ref, get, update,set  } from "../../lib/firebase";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Logo from "../components/Logo";
export default function AdminPage() {
  const [inscritos, setInscritos] = useState({});
  const [temas, setTemas] = useState({});
  const [salas, setSalas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarInscritos() {
      try {
        const snapshot = await get(ref(db, "inscritos"));
        if (snapshot.exists()) {
          setInscritos(snapshot.val());
        } else {
          setInscritos({});
        }
      } catch (error) {
        console.error("Erro ao carregar inscritos:", error);
      } finally {
        setLoading(false);
      }
    }

    async function carregarTemas() {
      try {
        const snapshot = await get(ref(db, "temas"));
        if (snapshot.exists()) {
          setTemas(snapshot.val());
        } else {
          setTemas({});
        }
      } catch (error) {
        console.error("Erro ao carregar temas:", error);
      } finally {
        setLoading(false);
      }
    }

    async function carregarSalas() {
      try {
        const snapshot = await get(ref(db, "salas"));
        if (snapshot.exists()) {
          setSalas(snapshot.val());
        } else {
          setSalas({});
        }
      } catch (error) {
        console.error("Erro ao carregar salas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarInscritos();
    carregarTemas();
    carregarSalas();
    
  }, []);

  // Agrupa por sala
  const agrupadosPorSala = {};
  Object.values(inscritos).forEach((pessoa) => {
    pessoa.cursos.forEach((curso) => {
      if (!agrupadosPorSala[curso]) agrupadosPorSala[curso] = [];
      agrupadosPorSala[curso].push(pessoa);
    });
  });

  // Exportar Excel
  const exportarExcel = () => {
    const planilhas = [];

    Object.entries(agrupadosPorSala).forEach(([sala, pessoas]) => {
      const linhas = pessoas.map((p) => ({
        Nome: p.nome,
        Escola: p.escola,
        Email: p.email,
        Curso: sala,
        Data: new Date(p.data).toLocaleString("pt-BR"),
      }));
      planilhas.push(...linhas);
    });

    const ws = XLSX.utils.json_to_sheet(planilhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inscritos");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "inscritos_evento.xlsx");
  };

  // Imprimir PDF (usa print do navegador)
  const imprimirPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <Logo />
        <h1 className="fw-bold text-primary">Lista de Inscritos</h1>
        <p className="text-muted">
          Agrupados por curso — total de{" "}
          <strong>{Object.keys(inscritos).length}</strong> inscritos
        </p>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="btn btn-success" onClick={exportarExcel}>
            📊 Exportar Excel
          </button>
          <button className="btn btn-outline-primary" onClick={imprimirPDF}>
            🖨️ Imprimir PDF
          </button>
          <button
            onClick={() => window.location.href = "/admin/qrcodes"}
            className="btn btn-warning text-muted"
          >
            📱 Gerar QRCode
          </button>
        </div>
      </div>

      {Object.entries(agrupadosPorSala).map(([sala, pessoas]) => (
        <div key={sala} className="mb-5">
          <h4 className="bg-light p-2 border-start border-4 border-primary">
            {salas[sala]?.nome} - ({pessoas.length})
          </h4>
          
          {salas[sala]?.temas && Object.entries(salas[sala]?.temas).map(([id,tema]) => (
              <p className="card-subtitle mb-2">
                <b>Tema:</b> <i>{temas[tema]?.nome}</i>
                <br/>
                <small className="text-muted mb-2">
                  Palestrante: {temas[tema]?.palestrante}
                </small>
              </p>
          ))}
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Nome</th>
                  <th>Escola</th>
                  <th>Email</th>
                  <th>Data de Inscrição</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa, i) => (
                  <tr key={i}>
                    <td>{pessoa.nome}</td>
                    <td>{pessoa.escola}</td>
                    <td>{pessoa.email}</td>
                    <td>
                      {new Date(pessoa.data).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <footer className="text-center text-muted mt-5">
        <hr />
        <small>© {new Date().getFullYear()} - Painel de Inscrições</small>
      </footer>
    </div>
  );
}
