import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import PropertyRecommendationModel from '@/models/property/propertyRecommendationModel';
import { RecommendedPropertyParams } from '@/handlers/property';

interface PropertyRecommendationsProps {
  title?: string;
  initialParams?: RecommendedPropertyParams;
}

const PropertyRecommendations: React.FC<PropertyRecommendationsProps> = ({
  title = 'Recommended Hotels',
  initialParams = { limit: 6 }
}) => {
  const { properties, loading, error } = PropertyRecommendationModel(initialParams);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || properties.length === 0) {
    return null; // Don't show anything if there's an error or no properties
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link 
            href={`/property/${property.slug}`} 
            key={property.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              {property.image ? (
                <Image
                  src={property.image.path}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-full flex items-center justify-center">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                {property.category.name}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{property.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <FaMapMarkerAlt className="mr-1" />
                <span>{property.city.name}</span>
              </div>
              {property.lowestPrice && (
                <div className="mt-3">
                  {property.adjusted_price && property.adjusted_price !== property.lowestPrice ? (
                    <>
                      <p className="text-primary font-bold">
                        IDR {Number(property.adjusted_price).toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-400 text-xs">per night</p>
                    </>
                  ) : (
                    <>
                      <p className="text-primary font-bold">
                        IDR {Number(property.lowestPrice).toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-400 text-xs">per night</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyRecommendations; 