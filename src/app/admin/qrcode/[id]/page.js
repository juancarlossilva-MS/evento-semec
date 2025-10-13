"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, ref, get, update,set  } from "../../../../lib/firebase";
import { QRCodeCanvas } from "qrcode.react";

import Logo from "../../../components/Logo";

export default function QrCodeIndividual() {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }

    async function carregarTema() {
      const snapshot = await get(ref(db, `temas/${id}`));
      if (snapshot.exists()) {
        setTema(snapshot.val());
      }
    }

    carregarTema();
  }, [id]);

  if (!tema) {
    return (
      <div className="container text-center py-5">
        <h5>Carregando tema...</h5>
      </div>
    );
  }

  const linkPresenca = `${baseUrl}/presenca/${id}`;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <Logo
      />
      <h2 className="fw-bold text-primary text-center mb-3">{tema.nome}</h2>
      <div className="p-4 bg-white rounded shadow">
        <QRCodeCanvas value={linkPresenca} size={300} />
      </div>
      <p className="mt-3 text-muted text-center">{linkPresenca}</p>

      <button
        className="btn btn-outline-secondary mt-3"
        onClick={() => window.history.back()}
      >
        ← Voltar
      </button>

      <footer className="text-center mt-5 text-muted position-absolute bottom-0 w-100">
        <hr />
        <small>© {new Date().getFullYear()} - Sistema de Presença</small>
      </footer>
    </div>
  );
}
