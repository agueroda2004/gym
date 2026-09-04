import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import DeportePage from './features/deporte/pages/Deporte'
import EjercicioPage from './features/ejercicio/pages/Ejercicio'
import HoyPage from './features/hoy/pages/Hoy'
import { NotificationProvider } from './features/notifications/NotificationProvider'
import EntrenarPage from './features/rutina/pages/Entrenar'
import RutinaPage from './features/rutina/pages/Rutina'
import RutinaDetallePage from './features/rutina/pages/RutinaDetalle'

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Navigate to="/hoy" replace />} />
            <Route path="/hoy" element={<HoyPage />} />
            <Route path="/rutinas" element={<RutinaPage />} />
            <Route path="/rutinas/:id" element={<RutinaDetallePage />} />
            <Route path="/ejercicios" element={<EjercicioPage />} />
            <Route path="/deporte" element={<DeportePage />} />
          </Route>
          <Route path="/entrenar/:sesionId" element={<EntrenarPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  )
}

export default App