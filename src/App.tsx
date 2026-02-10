import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        {/* Fallback for now */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App; // Default export for main.tsx conformance
