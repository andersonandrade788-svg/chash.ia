import type { EbookTheme } from './ebook-themes'

export type { EbookTheme }

interface EbookData {
  title: string
  subtitle?: string
  content: string
  theme: EbookTheme
  authorName?: string
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .trim()
}

function addPageHeader(doc: jsPDF, theme: EbookTheme, pageNum: number, total?: number) {
  const [pr, pg, pb] = theme.primary
  const pageW = doc.internal.pageSize.getWidth()

  // Linha no topo
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, 0, pageW, 3, 'F')

  // Rodapé
  doc.setFillColor(245, 245, 250)
  doc.rect(0, doc.internal.pageSize.getHeight() - 14, pageW, 14, 'F')
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 180)
  doc.text('Gerado por Cash.IA', 14, doc.internal.pageSize.getHeight() - 5)
  if (total) {
    doc.text(`${pageNum} / ${total}`, pageW - 14, doc.internal.pageSize.getHeight() - 5, { align: 'right' })
  }
}

export async function generateEbookPDF(data: EbookData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()   // 210
  const pageH = doc.internal.pageSize.getHeight()  // 297
  const margin = 18
  const contentW = pageW - margin * 2
  const [pr, pg, pb] = data.theme.primary
  const [sr, sg, sb] = data.theme.secondary
  const [lr, lg, lb] = data.theme.light

  // ── CAPA ─────────────────────────────────────────────────────
  // Fundo principal
  doc.setFillColor(pr, pg, pb)
  doc.rect(0, 0, pageW, pageH, 'F')

  // Faixa decorativa lateral esquerda mais escura
  doc.setFillColor(sr, sg, sb)
  doc.rect(0, 0, 8, pageH, 'F')

  // Círculo decorativo superior direito
  doc.setFillColor(sr, sg, sb)
  doc.circle(pageW + 10, -10, 60, 'F')

  // Faixa clara na parte inferior (30%)
  doc.setFillColor(sr, sg, sb)
  doc.rect(0, pageH * 0.72, pageW, pageH * 0.28, 'F')

  // Linha separadora
  doc.setFillColor(lr, lg, lb)
  doc.rect(0, pageH * 0.72, pageW, 1.5, 'F')

  // Badge "eBook"
  doc.setFillColor(lr, lg, lb)
  doc.roundedRect(margin, 28, 30, 8, 2, 2, 'F')
  doc.setFontSize(7)
  doc.setTextColor(pr, pg, pb)
  doc.setFont('helvetica', 'bold')
  doc.text('eBOOK', margin + 15, 33.5, { align: 'center' })

  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(data.title.toUpperCase(), contentW - 10)
  const titleFontSize = titleLines.length > 2 ? 22 : 28
  doc.setFontSize(titleFontSize)
  let titleY = 65
  titleLines.forEach((line: string) => {
    doc.text(line, margin + 4, titleY)
    titleY += titleFontSize * 0.45
  })

  // Linha decorativa abaixo do título
  doc.setFillColor(lr, lg, lb)
  doc.rect(margin + 4, titleY + 4, 40, 2, 'F')

  // Subtítulo
  if (data.subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.setTextColor(220, 220, 240)
    const subLines = doc.splitTextToSize(data.subtitle, contentW - 10)
    subLines.slice(0, 3).forEach((line: string, i: number) => {
      doc.text(line, margin + 4, titleY + 16 + i * 6)
    })
  }

  // Área inferior da capa
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text('Cash.IA', margin + 4, pageH * 0.72 + 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(200, 200, 220)
  doc.text('Plataforma de Produtos Digitais com IA', margin + 4, pageH * 0.72 + 21)

  if (data.authorName) {
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text(data.authorName, pageW - margin, pageH - 16, { align: 'right' })
  }

  // ── CONTEÚDO ─────────────────────────────────────────────────
  // Parseia o markdown em blocos
  const lines = data.content.split('\n')
  let pageCount = 1
  let y = 20

  const newPage = () => {
    doc.addPage()
    pageCount++
    y = 20
  }

  const checkY = (needed: number) => {
    if (y + needed > pageH - 20) newPage()
  }

  doc.addPage()

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    if (!line) {
      y += 3
      continue
    }

    // H1
    if (line.startsWith('# ')) {
      checkY(20)
      addPageHeader(doc, data.theme, pageCount)

      const text = stripMarkdown(line.replace(/^# /, ''))
      // Fundo colorido para H1
      doc.setFillColor(pr, pg, pb)
      doc.rect(margin - 2, y - 5, contentW + 4, 12, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.text(text, margin + 1, y + 3)
      y += 16
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      checkY(16)
      const text = stripMarkdown(line.replace(/^## /, ''))
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(pr, pg, pb)
      doc.text(text, margin, y)
      // Linha abaixo do H2
      doc.setFillColor(pr, pg, pb)
      doc.rect(margin, y + 1.5, contentW, 0.5, 'F')
      y += 10
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      checkY(12)
      const text = stripMarkdown(line.replace(/^### /, ''))
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(sr, sg, sb)
      doc.text(text, margin, y)
      y += 8
      continue
    }

    // Lista
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('✅') || line.startsWith('1️⃣') || line.startsWith('2️⃣') || line.startsWith('3️⃣')) {
      const text = stripMarkdown(line.replace(/^[-*]\s/, '').replace(/^[✅1️⃣2️⃣3️⃣]\s?/, '• '))
      const wrapped = doc.splitTextToSize(`• ${text}`, contentW - 6)
      checkY(wrapped.length * 5 + 2)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 60)
      doc.text(wrapped, margin + 4, y)
      y += wrapped.length * 5 + 2
      continue
    }

    // Linha horizontal
    if (line.startsWith('---') || line.startsWith('===')) {
      doc.setFillColor(220, 220, 230)
      doc.rect(margin, y, contentW, 0.5, 'F')
      y += 5
      continue
    }

    // Parágrafo normal
    const text = stripMarkdown(line)
    if (!text) continue
    const wrapped = doc.splitTextToSize(text, contentW)
    checkY(wrapped.length * 5.5 + 3)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 55)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 5.5 + 3
  }

  // Adiciona cabeçalho/rodapé em todas as páginas de conteúdo
  const totalPages = doc.getNumberOfPages()
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p)
    addPageHeader(doc, data.theme, p - 1, totalPages - 1)
  }

  // Salva o PDF
  const filename = data.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'ebook'
  doc.save(`${filename}.pdf`)
}
