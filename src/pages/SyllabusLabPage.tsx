import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertPdfToMarkdown } from '../api/documents'
import { fetchHealth } from '../api/health'
import type { PdfToMarkdownResponse } from '../types/documents'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

type BackendStatus = 'checking' | 'connected' | 'disconnected'

function SyllabusLabPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<PdfToMarkdownResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking')

  useEffect(() => {
    let cancelled = false

    async function checkBackend() {
      try {
        await fetchHealth()
        if (!cancelled) {
          setBackendStatus('connected')
        }
      } catch {
        if (!cancelled) {
          setBackendStatus('disconnected')
        }
      }
    }

    void checkBackend()

    return () => {
      cancelled = true
    }
  }, [])

  const fileStatus = getFileStatus(selectedFile, result, errorMessage, isUploading)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    setResult(null)
    setErrorMessage(null)

    if (!file) {
      setSelectedFile(null)
      return
    }

    const validationError = validatePdfFile(file)

    if (validationError) {
      setSelectedFile(null)
      setErrorMessage(validationError)
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedFile) {
      setErrorMessage('Selecciona un archivo PDF antes de convertirlo.')
      return
    }

    const validationError = validatePdfFile(selectedFile)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsUploading(true)
    setErrorMessage(null)

    try {
      const conversion = await convertPdfToMarkdown(selectedFile)
      setResult(conversion)
    } catch (error) {
      setResult(null)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado al convertir el PDF.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  function handleClear() {
    setSelectedFile(null)
    setResult(null)
    setErrorMessage(null)
    setIsUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="app-shell">
      <nav className="page-nav" aria-label="Navegación de página">
        <Link className="back-link" to="/">
          <span className="back-link-icon" aria-hidden="true">
            ←
          </span>
          Volver
        </Link>
      </nav>

      <header className="hero-header">
        <p className="eyebrow">Syllabus Lab</p>
        <h1>Eduplain Syllabus Lab</h1>
        <p className="subtitle">
          Convierte un sílabo PDF en Markdown para validar el procesamiento
          inicial.
        </p>
        <p className="backend-status" aria-live="polite">
          Backend:{' '}
          <span className={`status-pill status-pill--${backendStatus}`}>
            {getBackendStatusLabel(backendStatus)}
          </span>
        </p>
      </header>

      <section className="lab-grid" aria-label="Conversor de PDF a Markdown">
        <form className="card upload-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <p className="section-label">Entrada</p>
            <h2>Sube el sílabo PDF</h2>
            <p>
              El archivo se enviará al backend Django REST usando
              multipart/form-data. Tamaño máximo: 10 MB.
            </p>
          </div>

          <label className="drop-zone" htmlFor="pdf-file">
            <span className="drop-zone-icon" aria-hidden="true">
              PDF
            </span>
            <span className="drop-zone-title">
              Selecciona un archivo PDF
            </span>
            <span className="drop-zone-copy">
              Solo se acepta application/pdf o archivos con extensión .pdf.
            </span>
            <input
              ref={fileInputRef}
              id="pdf-file"
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          <div className="file-panel" aria-live="polite">
            {selectedFile ? (
              <dl className="file-details">
                <div>
                  <dt>Archivo</dt>
                  <dd>{selectedFile.name}</dd>
                </div>
                <div>
                  <dt>Tamaño</dt>
                  <dd>{formatFileSize(selectedFile.size)}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>
                    <span className="status-pill">{fileStatus}</span>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="empty-state">No hay un PDF seleccionado.</p>
            )}
          </div>

          {errorMessage ? (
            <div className="alert alert-error" role="alert">
              <strong>Error</strong>
              <p>{errorMessage}</p>
            </div>
          ) : null}

          {result ? (
            <div className="alert alert-success" role="status">
              <strong>Conversión completada</strong>
              <p>
                {result.filename} · {result.characters.toLocaleString('es-PE')}{' '}
                caracteres extraídos
              </p>
            </div>
          ) : null}

          <div className="actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Convirtiendo...' : 'Convertir a Markdown'}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={handleClear}
              disabled={isUploading}
            >
              Limpiar
            </button>
          </div>
        </form>

        <section className="card markdown-card" aria-labelledby="markdown-title">
          <div className="card-heading markdown-heading">
            <div>
              <p className="section-label">Salida</p>
              <h2 id="markdown-title">Markdown generado</h2>
            </div>
            {result ? (
              <span className="character-count">
                {result.characters.toLocaleString('es-PE')} caracteres
              </span>
            ) : null}
          </div>

          {isUploading ? (
            <div className="markdown-placeholder" role="status">
              Procesando el PDF en el backend...
            </div>
          ) : result ? (
            <pre className="markdown-output" aria-label="Markdown convertido">
              <code>{result.markdown}</code>
            </pre>
          ) : (
            <div className="markdown-placeholder">
              El Markdown devuelto por el backend aparecerá aquí después de la
              conversión.
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

function getBackendStatusLabel(status: BackendStatus): string {
  if (status === 'checking') {
    return 'Comprobando...'
  }

  if (status === 'connected') {
    return 'Conectado'
  }

  return 'Sin conexión'
}

function validatePdfFile(file: File): string | null {
  const hasPdfMimeType = file.type === 'application/pdf'
  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf')

  if (!hasPdfMimeType && !hasPdfExtension) {
    return 'El archivo seleccionado debe ser un PDF.'
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'El archivo supera el tamaño máximo permitido de 10 MB.'
  }

  return null
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getFileStatus(
  file: File | null,
  result: PdfToMarkdownResponse | null,
  errorMessage: string | null,
  isUploading: boolean,
): string {
  if (!file) {
    return 'Sin archivo'
  }

  if (isUploading) {
    return 'Convirtiendo'
  }

  if (result) {
    return 'Convertido'
  }

  if (errorMessage) {
    return 'Revisar error'
  }

  return 'Listo para convertir'
}

export default SyllabusLabPage
