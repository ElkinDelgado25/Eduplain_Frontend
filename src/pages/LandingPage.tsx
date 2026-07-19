import { Link } from 'react-router-dom'
import EduplainGlobe from '../components/EduplainGlobe'
import MarqueeCarousel from '../components/MarqueeCarousel'
import argentinaFlag from 'flag-icons/flags/4x3/ar.svg?url'
import brazilFlag from 'flag-icons/flags/4x3/br.svg?url'
import chileFlag from 'flag-icons/flags/4x3/cl.svg?url'
import colombiaFlag from 'flag-icons/flags/4x3/co.svg?url'
import costaRicaFlag from 'flag-icons/flags/4x3/cr.svg?url'
import courseraLogo from 'simple-icons/icons/coursera.svg?url'
import dominicanRepublicFlag from 'flag-icons/flags/4x3/do.svg?url'
import edxLogo from 'simple-icons/icons/edx.svg?url'
import ecuadorFlag from 'flag-icons/flags/4x3/ec.svg?url'
import spainFlag from 'flag-icons/flags/4x3/es.svg?url'
import googleClassroomLogo from 'simple-icons/icons/googleclassroom.svg?url'
import khanAcademyLogo from 'simple-icons/icons/khanacademy.svg?url'
import mexicoFlag from 'flag-icons/flags/4x3/mx.svg?url'
import moodleLogo from 'simple-icons/icons/moodle.svg?url'
import panamaFlag from 'flag-icons/flags/4x3/pa.svg?url'
import peruFlag from 'flag-icons/flags/4x3/pe.svg?url'
import udemyLogo from 'simple-icons/icons/udemy.svg?url'
import unitedStatesFlag from 'flag-icons/flags/4x3/us.svg?url'

const countries = [
  { label: 'Ecuador', flagSrc: ecuadorFlag, featured: true },
  { label: 'Colombia', flagSrc: colombiaFlag },
  { label: 'Perú', flagSrc: peruFlag },
  { label: 'Chile', flagSrc: chileFlag },
  { label: 'México', flagSrc: mexicoFlag },
  { label: 'Costa Rica', flagSrc: costaRicaFlag },
  { label: 'Panamá', flagSrc: panamaFlag },
  { label: 'Argentina', flagSrc: argentinaFlag },
  { label: 'Brasil', flagSrc: brazilFlag },
  { label: 'Estados Unidos', flagSrc: unitedStatesFlag },
  { label: 'España', flagSrc: spainFlag },
  { label: 'República Dominicana', flagSrc: dominicanRepublicFlag },
] as const

const learningPlatforms = [
  { label: 'Moodle', logoSrc: moodleLogo },
  { label: 'Google Classroom', logoSrc: googleClassroomLogo },
  { label: 'Coursera', logoSrc: courseraLogo },
  { label: 'edX', logoSrc: edxLogo },
  { label: 'Khan Academy', logoSrc: khanAcademyLogo },
  { label: 'Udemy', logoSrc: udemyLogo },
] as const

function LandingPage() {
  return (
    <main className="presentation-landing">
      <header className="presentation-nav">
        <a className="brand-lockup" href="#inicio" aria-label="Eduplain, inicio">
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>Eduplain</span>
        </a>

        <div className="presentation-nav__meta">
          <span className="nav-location-dot" aria-hidden="true" />
          Ecuador · Hub principal
        </div>
      </header>

      <section
        className="carousel-section carousel-section--countries"
        id="presencia"
        aria-labelledby="presence-title"
      >
        <div className="carousel-section__heading">
          <p className="presentation-kicker">Alcance regional</p>
          <h2 id="presence-title">
            Presente en <span>10+ países</span>
          </h2>
          <p>
            Construimos conexiones entre comunidades académicas de América
            Latina, Norteamérica y Europa.
          </p>
        </div>

        <MarqueeCarousel
          items={countries}
          label="Países donde Eduplain tiene presencia"
          variant="countries"
        />
      </section>

      <section className="presentation-hero" id="inicio" aria-labelledby="landing-title">
        <div className="presentation-copy">
          <p className="presentation-kicker">Tecnología académica latinoamericana</p>
          <h1 id="landing-title" className="presentation-title">
            EDUPLAIN
          </h1>
          <p className="presentation-lede">
            Una plataforma para transformar la información académica en
            experiencias de aprendizaje claras, conectadas y accionables.
          </p>

          <div className="headquarters-card">
            <span className="headquarters-card__pin" aria-hidden="true">
              ●
            </span>
            <div>
              <strong>Ecuador</strong>
              <span>Nuestro punto de partida y sede principal</span>
            </div>
          </div>

          <div className="landing-actions">
            <Link
              className="presentation-button presentation-button--primary"
              to="/syllabus-lab"
            >
              Explorar Eduplain
              <span aria-hidden="true">↗</span>
            </Link>
            <a className="presentation-button presentation-button--ghost" href="#plataformas">
              Ver ecosistema
            </a>
          </div>
        </div>

        <div className="presentation-visual">
          <div className="visual-ornament visual-ornament--top" aria-hidden="true" />
          <EduplainGlobe />
          <div className="globe-hub-label">
            <span className="globe-hub-label__dot" aria-hidden="true" />
            Ecuador
          </div>
        </div>
      </section>

      <section
        className="carousel-section platforms-section"
        id="plataformas"
        aria-labelledby="platforms-title"
      >
        <div className="carousel-section__heading">
          <p className="presentation-kicker">Ecosistema de aprendizaje</p>
          <h2 id="platforms-title">Plataformas educativas</h2>
        </div>

        <MarqueeCarousel
          items={learningPlatforms}
          label="Plataformas educativas"
          variant="platforms"
        />
      </section>

      <footer className="presentation-footer">
        <span>01 — Eduplain / Presentación</span>
        <span>Aprendizaje conectado, desde Ecuador para el mundo.</span>
      </footer>
    </main>
  )
}

export default LandingPage
