import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import JDPortfolio from './pages/JDPortfolio';
import { AudioProvider } from './context/AudioContext';

const App = () => {
  return (
    <AudioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/jd" element={<JDPortfolio />} />
          {/* Fallback for now */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AudioProvider>
  );
};

export default App; // Default export for main.tsx conformance
