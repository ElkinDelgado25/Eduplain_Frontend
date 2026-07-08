import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SyllabusLabPage from './pages/SyllabusLabPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/syllabus-lab" element={<SyllabusLabPage />} />
    </Routes>
  )
}

export default App
