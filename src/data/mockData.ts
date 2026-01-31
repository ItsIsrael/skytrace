export interface FlightSection {
    id: string;
    name: string;
    status: 'volado' | 'pendiente' | 'en_progreso';
    date?: string;
}

export interface ProvinceData {
    id: string;
    name: string;
    totalKm: number;
    flownKm: number;
    sections: FlightSection[];
    status: 'completado' | 'en_proceso' | 'pendiente';
}

// Helper to generate random data
const generateRandomData = (id: string, name: string): ProvinceData => {
    const statuses: ('completado' | 'en_proceso' | 'pendiente')[] = ['completado', 'en_proceso', 'en_proceso', 'pendiente', 'pendiente'];
    const mainStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const totalKm = Math.floor(Math.random() * 1500) + 300;
    let flownKm = 0;

    if (mainStatus === 'completado') {
        flownKm = totalKm;
    } else if (mainStatus === 'en_proceso') {
        flownKm = Math.floor(Math.random() * (totalKm * 0.8));
    }
    // If pending, flownKm remains 0

    // Generate sections
    const numSections = Math.floor(Math.random() * 6) + 2;
    const sections: FlightSection[] = [];

    for (let i = 1; i <= numSections; i++) {
        let secStatus: 'volado' | 'pendiente' | 'en_progreso' = 'pendiente';
        let date = undefined;

        if (mainStatus === 'completado') {
            secStatus = 'volado';
            date = `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`;
        } else if (mainStatus === 'pendiente') {
            secStatus = 'pendiente';
        } else {
            // Mix
            const r = Math.random();
            if (r > 0.6) secStatus = 'volado';
            else if (r > 0.3) secStatus = 'en_progreso';
            else secStatus = 'pendiente';

            if (secStatus === 'volado') date = `2024-01-${Math.floor(Math.random() * 28) + 1}`;
        }

        sections.push({
            id: `SEC-${id.substring(0, 3).toUpperCase()}-0${i}`,
            name: `Tramo ${name} ${i}`,
            status: secStatus,
            date: date
        });
    }

    return {
        id,
        name,
        totalKm,
        flownKm,
        sections,
        status: mainStatus
    };
};

// Manual list of provinces to ensure coverage
// Includes common names and GeoJSON variants
const provinceList = [
    "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares",
    "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba",
    "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "La Rioja",
    "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense",
    "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria",
    "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza",
    // Variants to ensure match with GeoJSON (English/Local)
    "Seville", "Bizkaia", "Illes Balears", "A Coruña", "Ourense"
];

// Generate data and remove duplicates by ID
const generatedProvinces = provinceList.map(name => generateRandomData(name, name));
// Ensure basic uniqueness
const uniqueProvincesMap = new Map();
generatedProvinces.forEach(p => {
    if (!uniqueProvincesMap.has(p.id)) uniqueProvincesMap.set(p.id, p);
});

export const provincesData: ProvinceData[] = Array.from(uniqueProvincesMap.values());
