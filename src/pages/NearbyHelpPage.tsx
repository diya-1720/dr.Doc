import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DEMO_NEARBY_CENTERS } from '../services/demoData';
import { MapPin, Navigation, ExternalLink, Search } from 'lucide-react';

export const NearbyHelpPage: React.FC = () => {
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

      <main className="flex-1 p-6 md:p-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHYSICAL ASSISTANCE LOCATOR
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928]">
            NEARBY ASSISTANCE CENTRES
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            Find verified offline document centers, Aadhaar Seva Kendras, CSC Digital desks, and notarization service providers near you.
          </p>
        </div>

        {/* Location Search Bar & Geolocation Button */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A58B7B]" />
            <input
              type="text"
              placeholder="Search service type (e.g. Aadhaar, PAN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3E4C8] border border-[#3F2928] pl-9 pr-3 py-1.5 focus:outline-none text-[#3F2928]"
            />
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="bg-[#3F2928] text-[#FFF8EA] px-4 py-2 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] font-bold flex items-center gap-2 hover:bg-[#7A302F] transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#D47794]" />
            {isLocating ? 'LOCATING...' : userLocation ? `GPS: ${userLocation}` : 'USE CURRENT GPS LOCATION'}
          </button>
        </div>

        {/* Service Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="case-card p-6 border-2 border-[#3F2928] flex flex-col justify-between"
            >
              <div>
                
                {/* Top Badge Line */}
                <div className="flex justify-between items-start mb-2">
                  <span className="evidence-tag">{center.type}</span>
                  <span className="stamp stamp-verified text-[9px]">{center.status}</span>
                </div>

                {/* Name */}
                <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-1">
                  {center.name}
                </h3>
                
                {/* Address */}
                <div className="font-mono text-xs text-[#3F2928] flex items-start gap-1.5 mb-3">
                  <MapPin className="w-4 h-4 text-[#7A302F] shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </div>

                {/* Distance & Hours */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-[#F3E4C8] p-3 border border-[#3F2928] mb-4">
                  <div>
                    <span className="text-[#A58B7B]">DISTANCE:</span>
                    <strong className="text-[#7A302F] ml-1">{center.distanceKm} KM</strong>
                  </div>
                  <div>
                    <span className="text-[#A58B7B]">HOURS:</span>
                    <span className="ml-1 font-semibold text-[#3F2928]">{center.hours}</span>
                  </div>
                  <div>
                    <span className="text-[#A58B7B]">PHONE:</span>
                    <span className="ml-1 font-bold text-[#3F2928]">{center.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#A58B7B]">RATING:</span>
                    <span className="ml-1 font-bold text-[#7A302F]">★ {center.rating}</span>
                  </div>
                </div>

                {/* Provided Services List */}
                <div className="font-mono text-xs mb-4">
                  <div className="font-bold text-[#3F2928] mb-1 text-[10px] uppercase">
                    SERVICES PROVIDED:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#F3E4C8] border border-[#3F2928] text-[10px] text-[#3F2928]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Get Directions Button */}
              <button
                onClick={() => handleGetDirections(center.address)}
                className="w-full bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-heading text-base font-bold flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#FFF8EA]" />
                GET DIRECTIONS ON MAPS
              </button>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
