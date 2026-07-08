import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="app-shell landing-shell">
      <header className="hero-header landing-hero">
        <p className="eyebrow">Eduplain</p>
        <h1>Convierte sílabos en contenido accionable</h1>
        <p className="subtitle">
          Empieza con Syllabus Lab: Sube un PDF y obtén tu Informacion de manera automatica para empezar a crear tu plan de estudios.
        </p>
        <div className="landing-actions">
          <Link className="button button-primary" to="/syllabus-lab">
            Entrar a Syllabus Lab
          </Link>
        </div>
      </header>
    </main>
  )
}

export default LandingPage
