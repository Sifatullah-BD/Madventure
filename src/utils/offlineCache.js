import { DISTRICTS, FARES, EMERGENCY, MECHANICS } from '../data/madventure-data';

export const cacheEmergencyData = () => {
  try {
    const data = {
      districts: DISTRICTS,
      emergency: EMERGENCY,
      fares: FARES,
      mechanics: MECHANICS,
      cachedAt: new Date().toISOString()
    };
    localStorage.setItem('madventure_offline', JSON.stringify(data));
    console.log("Offline emergency data populated successfully.");
  } catch (err) {
    console.error("Failed to populate offline emergency data: ", err);
  }
};

export const getOfflineData = () => {
    try {
        const stored = localStorage.getItem('madventure_offline');
        if (stored) return JSON.parse(stored);
        return null;
    } catch (e) {
        return null;
    }
};

export const clearOfflineData = () => {
    localStorage.removeItem('madventure_offline');
};
