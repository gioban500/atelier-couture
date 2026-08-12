import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Devis from './pages/Devis';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;