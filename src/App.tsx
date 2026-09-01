import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { GeminiDisasterChat } from './components/GeminiDisasterChat';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { FeasibilityPage } from './pages/FeasibilityPage';
import { ImpactPage } from './pages/ImpactPage';
import { ResearchPage } from './pages/ResearchPage';
import { SentinelAppPage } from './pages/SentinelAppPage';
import { FEATURED_DIALECTS } from './services/dialectsData';
import type { Dialect } from './services/dialectsData';
import type { Language } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [selectedDialect, setSelectedDialect] = useState<Dialect>(FEATURED_DIALECTS[0]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      {/* Persistent Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setLanguage={setCurrentLang}
        selectedDialect={selectedDialect}
        setSelectedDialect={setSelectedDialect}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenSOS={() => setIsSOSOpen(true)}
            currentLang={currentLang}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            currentLang={currentLang}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}
        {activeTab === 'map' && (
          <LiveMapPage
            onOpenSOS={() => setIsSOSOpen(true)}
            currentLang={currentLang}
          />
        )}
        {activeTab === 'methodology' && <MethodologyPage currentLang={currentLang} />}
        {activeTab === 'feasibility' && <FeasibilityPage currentLang={currentLang} />}
        {activeTab === 'impact' && <ImpactPage currentLang={currentLang} />}
        {activeTab === 'research' && <ResearchPage currentLang={currentLang} />}
        {activeTab === 'sentinel' && (
          <SentinelAppPage
            onOpenSOS={() => setIsSOSOpen(true)}
            selectedDialect={selectedDialect}
            setSelectedDialect={setSelectedDialect}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Persistent Footer */}
      {activeTab !== 'dashboard' && (
        <Footer setActiveTab={setActiveTab} />
      )}

      {/* Emergency SOS Broadcast Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentLang={currentLang}
      />

      {/* Floating Google Gemini Disaster AI Assistant */}
      <GeminiDisasterChat currentLang={currentLang} />
    </div>
  );
}

export default App;
