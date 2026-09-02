import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useLanguage } from '../i18n/LanguageContext';
import { DEMO_NEARBY_CENTERS } from '../services/demoData';
import { Navigation, ExternalLink, Search } from 'lucide-react';

export const NearbyHelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [centers] = useState(DEMO_NEARBY_CENTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => {
          setUserLocation('Pune, Maharashtra (Default)');
          setIsLocating(false);
        }
      );
    }
  };

  const handleGetDirections = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 10 // {t.help.tag}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.help.title}
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            {t.help.subtitle}
          </p>
        </div>

        {/* Location Search Bar & Geolocation Button */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A58B7B]" />
            <input
              type="text"
              placeholder={t.common.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3E4C8] border border-[#3F2928] pl-9 pr-3 py-2 text-xs focus:outline-none text-[#3F2928]"
            />
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full sm:w-auto bg-[#3F2928] text-[#FFF8EA] px-4 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] font-bold flex items-center justify-center gap-2 hover:bg-[#7A302F] transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#D47794] shrink-0" />
            <span>{isLocating ? t.help.locating : userLocation ? `GPS: ${userLocation}` : t.help.useGps}</span>
          </button>
        </div>

        {/* Service Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="case-card p-4 sm:p-6 border-2 border-[#3F2928] flex flex-col justify-between"
            >
              <div>
                
                {/* Top Badge Line */}
                <div className="flex justify-between items-start mb-2">
                  <span className="evidence-tag">{center.type}</span>
                  <span className="stamp stamp-verified text-[9px]">{center.status}</span>
                </div>

                {/* Name */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-1">
                  {center.name}
                </h3>
                
                {/* Address */}
                <p className="font-mono text-xs text-[#A58B7B] mb-3 leading-relaxed">
                  {center.address}
                </p>

                {/* Services List */}
                <div className="space-y-1 font-mono text-[11px] mb-4">
                  <span className="text-[#3F2928] font-bold block text-[10px]">{t.help.servicesOffered}</span>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-[#F3E4C8] border border-[#3F2928] text-[#3F2928] text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#3F2928]/20 flex items-center justify-between font-mono text-xs">
                <span className="text-[#7A302F] font-bold">{center.distanceKm} km</span>

                <button
                  onClick={() => handleGetDirections(center.address)}
                  className="text-[#7A302F] hover:underline font-bold flex items-center gap-1"
                >
                  <span>{t.help.directions}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
