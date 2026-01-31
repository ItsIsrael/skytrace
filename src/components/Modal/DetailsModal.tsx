import React from 'react';
import { X, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import type { ProvinceData } from '../../data/mockData';
import './DetailsModal.css';

interface DetailsModalProps {
    province: ProvinceData | null;
    onClose: () => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ province, onClose }) => {
    if (!province) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completado': return <CheckCircle className="w-5 h-5 text-green" />;
            case 'en_proceso': return <TrendingUp className="w-5 h-5 text-yellow" />;
            default: return <AlertCircle className="w-5 h-5 text-gray" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completado': return 'success';
            case 'en_proceso': return 'warning';
            default: return 'pending';
        }
    };

    // Logic to calculate percentage safely, avoiding NaN errors
    const percentage = province.totalKm > 0
        ? Math.round((province.flownKm / province.totalKm) * 100)
        : 0;

    // Count pending sections to display in the badge
    const pendingCount = province.sections.filter(s => s.status === 'pendiente').length;

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content animate-fade-in">

                {/* Header */}
                <div className="modal-header">
                    <div className="title-container">
                        <h2 className="modal-title">{province.name}</h2>
                        <div className={`badge ${getStatusClass(province.status)} badge-wrapper`}>
                            {getStatusIcon(province.status)}
                            {province.status.replace('_', ' ')}
                            {pendingCount > 0 && (
                                <span className="pending-count-badge" title="Tramos pendientes">
                                    {pendingCount} pendientes
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn" aria-label="Cerrar">
                        <X size={24} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-label">Total Trazado</p>
                        <p className="stat-value text-white">{province.totalKm} km</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Volado</p>
                        <p className="stat-value text-blue">{province.flownKm} km</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Progreso</p>
                        <p className="stat-value text-green">{percentage}%</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-track">
                    <div
                        className="progress-bar"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {/* Sections List */}
                <h3 className="sections-title">Secciones</h3>
                <div className="sections-list">
                    {province.sections.map((section) => (
                        <div key={section.id} className="section-item">
                            <div className="section-info">
                                <div className={`status-dot ${section.status === 'volado' ? 'bg-green' :
                                    section.status === 'en_progreso' ? 'bg-yellow' : 'bg-gray'
                                    }`} />
                                <div>
                                    <p className="section-name">{section.name}</p>
                                    <p className="section-id">{section.id}</p>
                                </div>
                            </div>
                            <div className="section-meta">
                                <span className={`status-text ${section.status === 'volado' ? 'status-pill-green' :
                                    section.status === 'en_progreso' ? 'status-pill-yellow' : 'status-pill-gray'
                                    }`}>
                                    {section.status}
                                </span>
                                {section.date && <p className="section-date">{section.date}</p>}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
