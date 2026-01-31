import { useState } from 'react';
import { MapComponent } from './components/Map/MapContainer';
import { DetailsModal } from './components/Modal/DetailsModal';
import type { ProvinceData } from './data/mockData';
import './index.css'; // Ensure global styles are loaded

function App() {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Overlay Title / Controls could go here */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 999,
        pointerEvents: 'none' // Let clicks pass through to map where transparent
      }}>
        <div className="glass-panel" style={{ pointerEvents: 'auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            SkyTrace
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Monitorización Inteligente de Redes Aéreas
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, background: '#4ade80', borderRadius: '50%' }}></span> Completado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, background: '#facc15', borderRadius: '50%' }}></span> En Proceso
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }}></span> Pendiente
            </div>
          </div>
        </div>
      </div>

      <MapComponent onProvinceSelect={setSelectedProvince} />

      {selectedProvince && (
        <DetailsModal
          province={selectedProvince}
          onClose={() => setSelectedProvince(null)}
        />
      )}
    </div>
  );
}

export default App;
