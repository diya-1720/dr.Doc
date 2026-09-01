import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ForensicsProvider } from './context/ForensicsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { VerifySetupPage } from './pages/VerifySetupPage';
import { DocumentInboxPage } from './pages/DocumentInboxPage';
import { OcrWorkspacePage } from './pages/OcrWorkspacePage';
import { DocumentQualityPage } from './pages/DocumentQualityPage';
import { VerificationPage } from './pages/VerificationPage';
import { CrossCheckPage } from './pages/CrossCheckPage';
import { IssuesPage } from './pages/IssuesPage';
import { FixApplicationPage } from './pages/FixApplicationPage';
import { DocumentToolsPage } from './pages/DocumentToolsPage';
import { NearbyHelpPage } from './pages/NearbyHelpPage';
import { VerificationReportPage } from './pages/VerificationReportPage';

import { LanguageProvider } from './i18n/LanguageContext';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ForensicsProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#F3E4C8] text-[#3F2928] antialiased">
          <Header />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/verify" element={<VerifySetupPage />} />
              <Route path="/documents" element={<DocumentInboxPage />} />
              <Route path="/ocr" element={<OcrWorkspacePage />} />
              <Route path="/quality" element={<DocumentQualityPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/cross-check" element={<CrossCheckPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/fix" element={<FixApplicationPage />} />
              <Route path="/tools" element={<DocumentToolsPage />} />
              <Route path="/help-nearby" element={<NearbyHelpPage />} />
              <Route path="/report" element={<VerificationReportPage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </ForensicsProvider>
  </LanguageProvider>
  );
};

export default App;
