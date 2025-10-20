"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db, ref, get, update,set  } from "../../../lib/firebase";
import Logo from "../../components/Logo";

export default function PresencaPage() {
  const { id } = useParams();
  const [cursoNome, setCursoNome] = useState(null);
  const [periodo, setPeriodo] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [gerando, setGerando] = useState(false);

  const mostrarMensagem = (m, t=3000)=>{ setMensagem(m); setMostrarToast(true); setTimeout(()=>setMostrarToast(false), t); };

  useEffect(()=>{
    async function carregar(){ 
      try {
        const snap = await get(ref(db, `salas/${id}`));
        if (snap.exists()) {
          const val = snap.val();
          setCursoNome(val.nome);
          setPeriodo(val.periodo);
        } else setCursoNome("Curso não encontrado");
      } catch(e) { console.error(e); setCursoNome("Erro ao carregar curso"); }
    }
    carregar();
  },[id]);

  const registrarPresenca = async ()=>{
    if (!nome || !email) { mostrarMensagem("Preencha nome e email!",3000); return; }
    try {
      const chave = email.replace(/\W/g,'_');
      const userRef = ref(db, `inscritos/${chave}`);
      const userSnap = await get(userRef);
      if (!userSnap.exists()) { mostrarMensagem("Email não cadastrado!",3000); return; }
      await update(userRef, { [`presenca_${id}`]: true });
      mostrarMensagem("Presença registrada!",2000);
      gerarCertificado(nome, periodo);
    } catch(e) { console.error(e); mostrarMensagem("Erro ao registrar presença",4000); }
  };

  const gerarCertificado = async (nome, periodo) => {
    
    setGerando(true);

    try {
     
       const resp = await fetch("/api/certificado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome, periodo:periodo }),
      });

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `certificado_${nome}.pdf`; a.click();
      URL.revokeObjectURL(url);
      mostrarMensagem("Certificado gerado!",3000);
    } catch(e) { console.error(e); mostrarMensagem("Erro ao gerar certificado",4000); }
    finally { setGerando(false); }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <Logo />
        <h1 className="fw-bold text-primary">Registro de Presença</h1>
        <p className="text-muted">Curso: <strong>{cursoNome || 'Carregando...'}</strong></p>
      </div>

      <div className={`position-fixed top-0 end-0 p-3 ${mostrarToast? 'd-block':'d-none'}`} style={{zIndex:1055}}>
        <div className="toast show align-items-center text-white bg-primary border-0">
          <div className="d-flex"><div className="toast-body">{mensagem}</div><button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={()=>setMostrarToast(false)}></button></div>
        </div>
      </div>

      <div className="card shadow p-4 mx-auto" style={{maxWidth:500}}>
        <div className="mb-3"><label className="form-label">Nome completo</label><input className="form-control" value={nome} onChange={(e)=>setNome(e.target.value)}/></div>
        <div className="mb-3"><label className="form-label">Email cadastrado</label><input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
        <div className="d-grid"><button className="btn btn-success" onClick={registrarPresenca} disabled={gerando}>{gerando? 'Gerando certificado...':'Registrar Presença'}</button></div>
      </div>

      <footer className="text-center mt-5 text-muted"><hr/><small>© {new Date().getFullYear()} - Sissala</small></footer>
    </div>
  );
}
