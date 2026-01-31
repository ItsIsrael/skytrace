import React, { useEffect, useState } from 'react';
import { MapContainer as PacketMap, TileLayer, GeoJSON } from 'react-leaflet';
import { provincesData } from '../../data/mockData';
import type { ProvinceData } from '../../data/mockData';
import './MapContainer.css';
import 'leaflet/dist/leaflet.css';


interface MapComponentProps {
    onProvinceSelect: (province: ProvinceData) => void;
}

// Center of Spain
const CENTER: [number, number] = [40.4168, -3.7038];
const ZOOM = 6;

export const MapComponent: React.FC<MapComponentProps> = ({ onProvinceSelect }) => {
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-provinces.geojson')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading GeoJSON", err);
                setLoading(false);
            });
    }, []);

    const getProvinceStatus = (provinceName: string) => {
        // Check if we have data for this province in our local "JSON"
        const province = provincesData.find(p =>
            p.name.toLowerCase() === provinceName.toLowerCase() ||
            p.id.toLowerCase() === provinceName.toLowerCase()
        );
        return province?.status || 'pendiente';
    };

    const getStyle = (feature: any) => {
        const status = getProvinceStatus(feature.properties.name);

        // Assign scale colors based on status:
        // Green -> Completed
        // Yellow -> In Progress
        // Red/Grey -> Pending
        let color = '#64748b'; // default slate-500
        if (status === 'completado') color = '#4ade80'; // green-400
        if (status === 'en_proceso') color = '#facc15'; // yellow-400
        if (status === 'pendiente') color = '#ef4444'; // red-500

        return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: 'white', // white border to separate provinces
            dashArray: '3',
            fillOpacity: status === 'pendiente' ? 0.3 : 0.6
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const provinceName = feature.properties.name;
        // Add tooltip
        layer.bindTooltip(provinceName, {
            permanent: false,
            direction: "center",
            className: "custom-tooltip"
        });

        layer.on({
            mouseover: (e: any) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: '#38bdf8', // light blue hover
                    dashArray: '',
                    fillOpacity: 0.8
                });
                layer.bringToFront();
            },
            mouseout: (e: any) => {
                const layer = e.target;
                // Reset style on mouse out
                // We re-color based on original status
                const status = getProvinceStatus(provinceName);
                let color = '#64748b';
                if (status === 'completado') color = '#4ade80';
                if (status === 'en_proceso') color = '#facc15';
                if (status === 'pendiente') color = '#ef4444';

                layer.setStyle({
                    fillColor: color,
                    weight: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: status === 'pendiente' ? 0.3 : 0.6
                });
            },
            click: () => {
                const province = provincesData.find(p =>
                    p.name.toLowerCase() === provinceName.toLowerCase() ||
                    p.id.toLowerCase() === provinceName.toLowerCase()
                );

                if (province) {
                    onProvinceSelect(province);
                } else {
                    // If we have no data for this province yet (haven't flown there), create an empty one
                    console.warn(`No data for ${provinceName}`);
                    onProvinceSelect({
                        id: provinceName,
                        name: provinceName,
                        totalKm: 0,
                        flownKm: 0,
                        status: 'pendiente',
                        sections: []
                    });
                }
            }
        });
    };

    return (
        <div className="map-wrapper">
            {loading && <div className="map-loading">Cargando Mapa...</div>}
            <PacketMap center={CENTER} zoom={ZOOM} zoomControl={false} style={{ height: '100%', width: '100%', background: '#0d1117' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={getStyle}
                        onEachFeature={onEachFeature}
                    />
                )}
            </PacketMap>
        </div>
    );
};
