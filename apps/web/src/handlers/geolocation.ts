import { api } from './_api';

// Get the API key from environment variables
const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY as string;

interface GeocodeResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: any;
  };
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: {
    code: number;
    message: string;
  };
}

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && window.navigator !== undefined;
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<GeocodeResult | null> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=en`,
    );

    if (!response.ok) {
      throw new Error(`OpenCage API error: ${response.status}`);
    }

    const data: GeocodeResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

export const extractLocationName = (result: GeocodeResult | null): string => {
  if (!result) return '';

  // Extract city or town if available
  if (result.components.city) {
    return result.components.city;
  } else if (result.components.town) {
    return result.components.town;
  } else if (result.components.state) {
    return result.components.state;
  }
  return result.formatted;
};

export const getUserLocationName = async (): Promise<{
  locationName: string;
  coords?: { latitude: number; longitude: number };
}> => {
  if (!isBrowser()) {
    console.log('Geolocation is not available in server environment');
    return { locationName: '' };
  }

  if (!navigator.geolocation) {
    console.log('Geolocation API is not supported in this browser');
    return { locationName: '' };
  }

  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const result = await reverseGeocode(latitude, longitude);
            const locationName = extractLocationName(result);

            resolve({
              locationName,
              coords: { latitude, longitude },
            });
          } catch (error) {
            console.error('Error getting user location:', error);
            resolve({ locationName: '' });
          }
        },
        (error) => {
          // Handle specific geolocation errors
          let errorMessage = 'Unknown geolocation error';
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'User denied geolocation permission';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = 'Position unavailable';
              break;
            case 3: // TIMEOUT
              errorMessage = 'Geolocation request timed out';
              break;
          }
          console.error(`Geolocation error (${error.code}): ${errorMessage}`);
          resolve({ locationName: '' });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } catch (e) {
      console.error('Unexpected error in getUserLocationName:', e);
      resolve({ locationName: '' });
    }
  });
};

export const forwardGeocode = async (
  query: string,
): Promise<GeocodeResult | null> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${OPENCAGE_API_KEY}&language=en`,
    );

    if (!response.ok) {
      throw new Error(`OpenCage API error: ${response.status}`);
    }

    const data: GeocodeResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error('Error in forward geocoding:', error);
    return null;
  }
};
