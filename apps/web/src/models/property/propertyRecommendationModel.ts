import { useState, useEffect } from 'react';
import { getRecommendedProperties, RecommendedPropertyParams } from '@/handlers/property';

interface RecommendedProperty {
  id: number;
  name: string;
  slug: string;
  address: string;
  category: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  image: {
    id: number;
    path: string;
  } | null;
  lowestPrice: number | null;
  adjusted_price?: number | null;
}

export default function PropertyRecommendationModel(initialParams: RecommendedPropertyParams = {}) {
  const [properties, setProperties] = useState<RecommendedProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<RecommendedPropertyParams>(initialParams);

  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      setLoading(true);
      try {
        const data = await getRecommendedProperties(params);
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recommended properties');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProperties();
  }, [params]);

  const updateParams = (newParams: Partial<RecommendedPropertyParams>) => {
    setParams(prevParams => ({
      ...prevParams,
      ...newParams
    }));
  };

  return {
    properties,
    loading,
    error,
    updateParams
  };
} 