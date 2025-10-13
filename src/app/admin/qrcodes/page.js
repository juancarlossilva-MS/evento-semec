"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, ref, get, update,set  } from "../../../lib/firebase";
import Logo from "../../components/Logo";
export default function QRCodesPage() {
  const [temas, setTemas] = useState({});

  useEffect(() => {
    async function carregarTemas() {
      const snapshot = await get(ref(db, "temas"));
      if (snapshot.exists()) {
        setTemas(snapshot.val());
      }
    }
    carregarTemas();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <Logo />

        <h1 className="fw-bold text-primary">Lista de Temas</h1>
        <p className="text-muted">Clique em “Ver QRCode” para abrir o código individualmente.</p>
      </div>

      <div className="row g-4">
        {Object.entries(temas).map(([id, tema]) => (
          <div className="col-md-6" key={id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold">{tema.nome}</h5>
                  <p className="text-muted mb-2">
                    Inscritos: <strong>{tema.inscritos || 0}</strong> / 50
                  </p>
                </div>
                <Link href={`/admin/qrcode/${id}`} className="btn btn-primary mt-auto">
                  Ver QRCode
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center mt-5 text-muted">
        <hr />
        <small>© {new Date().getFullYear()} - Painel de Administração</small>
      </footer>
    </div>
  );
}
