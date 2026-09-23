import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VerificationPage from './pages/VerificationPage';
import QRCodePage from './pages/QRCodePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify/:certificateNumber" element={<VerificationPage />} />
        <Route path="/qr/:certificateNumber" element={<QRCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
