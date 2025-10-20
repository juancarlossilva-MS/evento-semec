import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req) {
  try {
    const { nome, periodo } = await req.json();

    if (!nome || !periodo) {
      return NextResponse.json(
        { error: "O nome e o periodo do participante é obrigatório." },
        { status: 400 }
      );
    }
    let pdfPath = "";
    if (periodo == 'matutino'){
      pdfPath = join(process.cwd(), "public", "certificado-matutino.pdf");
    }else if (periodo == 'vespertino'){
      pdfPath = join(process.cwd(), "public", "certificado-vespertino.pdf");
    }else{
      return NextResponse.json(
        { error: "Periodo inválido." },
        { status: 400 }
      );
    }

    // Caminho do certificado base
    const pdfBase = await readFile(pdfPath);

    // Carrega o PDF
    const pdfDoc = await PDFDocument.load(pdfBase);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Definir fonte e tamanho
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 16;

    // Coordenadas exatas do nome (ajuste conforme o seu modelo)
    const x = 300; // posição horizontal
    const y = 333; // posição vertical

    // Escreve o nome no certificado
    firstPage.drawText(nome, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Gera o novo PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado-${nome}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar certificado:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar certificado" },
      { status: 500 }
    );
  }
}
