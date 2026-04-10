import { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import MapView from './components/MapView';
import ReportModal from './components/ReportModal';
import { DUMMY_REPORTS } from './data/reports';

export default function App() {
  // ── State ────────────────────────────────────────────────
  const [reports, setReports] = useState(DUMMY_REPORTS);
  const [filters, setFilters] = useState({ severity: 'all', status: 'all' });
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null); // {lat, lng}
  const [showModal, setShowModal] = useState(false);

  // ── Derived data ─────────────────────────────────────────
  const filteredReports = reports.filter((r) => {
    if (filters.severity !== 'all' && r.severity !== filters.severity) return false;
    if (filters.status !== 'all' && r.status !== filters.status) return false;
    return true;
  });

  const stats = {
    total: reports.length,
    reported: reports.filter((r) => r.status === 'reported').length,
    inProgress: reports.filter((r) => r.status === 'in_progress').length,
    cleaned: reports.filter((r) => r.status === 'cleaned').length,
  };

  // ── Handlers ─────────────────────────────────────────────

  /** Called when user clicks on the map while in adding mode */
  const handleMapClick = useCallback((lat, lng) => {
    setPendingLocation({ lat, lng });
    setShowModal(true);
    setIsAddingMode(false);
  }, []);

  /** Use device geolocation to pre-fill location for a new report */
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPendingLocation({ lat: coords.latitude, lng: coords.longitude });
        setShowModal(true);
      },
      () => {
        alert(
          'Unable to get your location.\nPlease click "Add Report" and click directly on the map instead.'
        );
      },
      { timeout: 10000 }
    );
  }, []);

  /** Add a new report from the modal form */
  const handleAddReport = useCallback((reportData) => {
    setReports((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        status: 'reported',
        timestamp: new Date(),
        ...reportData,
      },
    ]);
    setShowModal(false);
    setPendingLocation(null);
  }, []);

  /** Volunteer claims a cleanup task */
  const handleClaimCleanup = useCallback((id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'in_progress' } : r))
    );
  }, []);

  /** Volunteer marks a spot as cleaned */
  const handleMarkCleaned = useCallback((id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cleaned' } : r))
    );
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingLocation(null);
  }, []);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F7F7F5' }}>
      <Header
        isAddingMode={isAddingMode}
        onAddReport={() => setIsAddingMode(true)}
        onCancelAdding={() => setIsAddingMode(false)}
        onGeolocate={handleGeolocate}
      />

      <Dashboard stats={stats} />

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Map fills remaining height */}
      <div className={`flex-1 min-h-0 ${isAddingMode ? 'map-adding-mode' : ''}`}>
        <MapView
          reports={filteredReports}
          isAddingMode={isAddingMode}
          onMapClick={handleMapClick}
          onClaimCleanup={handleClaimCleanup}
          onMarkCleaned={handleMarkCleaned}
        />
      </div>

      {/* Report form modal */}
      {showModal && pendingLocation && (
        <ReportModal
          location={pendingLocation}
          onSubmit={handleAddReport}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
