import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="text-2xl font-bold text-brown-700">
                    <span className="text-3xl">🏡</span> VMP Villa Home Stay
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/invoice"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Invoice
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invoice" element={<InvoicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to VMP Villa Home Stay
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional GST Invoice Generator for your homestay business. Create, customize,
              and export beautiful invoices in seconds.
            </p>
            <Link
              to="/invoice"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Create Your First Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📄"
              title="Professional Invoices"
              description="Create GST-compliant invoices that match your brand and meet tax requirements"
            />
            <FeatureCard
              icon="💰"
              title="Auto GST Calculation"
              description="Automatic CGST, SGST, and IGST calculations based on customer location"
            />
            <FeatureCard
              icon="📥"
              title="PDF Export"
              description="Download high-quality PDFs or print directly from your browser"
            />
            <FeatureCard
              icon="⚡"
              title="Real-time Preview"
              description="See your invoice update in real-time as you add items and details"
            />
            <FeatureCard
              icon="🔢"
              title="Smart Calculations"
              description="Automatic totals, tax calculations, and amount-to-words conversion"
            />
            <FeatureCard
              icon="📱"
              title="Responsive Design"
              description="Works perfectly on desktop, tablet, and mobile devices"
            />
          </div>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              About VMP Villa Home Stay
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Our Location</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Address:</strong> A-73, KPS Town, Baroli Ahir,<br />
                  Shamsabad Road, Agra, UP. 283125
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>State:</strong> Uttar Pradesh
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Us</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> 9258555345
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> support@vmpvilla.in
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>GSTIN:</strong> 09CAFPB2385C1Z1
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 VMP Villa Home Stay. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Your home, away from home</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default App;
