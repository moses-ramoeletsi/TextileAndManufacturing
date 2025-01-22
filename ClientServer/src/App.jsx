
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashborad'
import TextileManufacturingApp from './pages/TextileManufacturing'
import MensTopProductionCalculator from './pages/MensTopProductionCalculator'
import ZipperTopCalculator from './pages/ZipperTopCalculator'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manstop" element={<MensTopProductionCalculator  />} />
        <Route path="/tshirt" element={<TextileManufacturingApp />} />
        <Route path="/zippertop" element={<ZipperTopCalculator />} />

      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
