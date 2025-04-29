import React from 'react';
import {
  FaParking,
  FaSignOutAlt,
  FaArrowAltCircleUp,
  FaConciergeBell,
  FaUtensils,
  FaSwimmingPool,
  FaUserClock,
  FaShieldAlt,
  FaSuitcase,
  FaTshirt,
  FaSnowflake,
  FaCoffee,
  FaTv,
  FaWind,
  FaShower,
  FaLock,
  FaTint,
  FaGlassMartini,
  FaUmbrella,
} from 'react-icons/fa';
import { IFacility } from '@/interfaces/facility.interface';

// Map facility names to their corresponding icons
export const getFacilityIconByName = (facilityName: string): React.ReactNode => {
  switch (facilityName) {
    // Property facilities
    case 'Parking Area': return <FaParking />;
    case 'Express Check-out': return <FaSignOutAlt />;
    case 'Elevator': return <FaArrowAltCircleUp />;
    case '24-Hour Room Service': return <FaConciergeBell />;
    case 'Restaurant': return <FaUtensils />;
    case 'Swimming Pool': return <FaSwimmingPool />;
    case '24-Hour Reception': return <FaUserClock />;
    case '24-Hour Security': return <FaShieldAlt />;
    case 'Luggage Storage': return <FaSuitcase className="text-primary" />;
    case 'Laundry': return <FaTshirt className="text-primary" />;
    
    // Room facilities
    case 'Air Conditioning': return <FaSnowflake />;
    case 'Coffee/Tea Maker': return <FaCoffee />;
    case 'Television': return <FaTv />;
    case 'Hair Dryer': return <FaWind className="text-primary" />;
    case 'Shower': return <FaShower />;
    case 'Room Safe': return <FaLock />;
    case 'Refrigerator': return <FaSnowflake />;
    case 'Iron': return <FaTint className="text-primary" />;
    case 'Minibar': return <FaGlassMartini />;
    case 'Balcony/Terrace': return <FaUmbrella className="text-primary" />;
    
    // Default fallback
    default: return <FaSwimmingPool />;
  }
};

// Enhanced facility object with icon included
export const enhanceFacilityWithIcon = (facility: IFacility): IFacility & { icon: React.ReactNode } => {
  return {
    ...facility,
    icon: getFacilityIconByName(facility.name),
  };
};

// Process all facilities to include icons
export const enhanceFacilitiesWithIcons = (facilities: IFacility[]): (IFacility & { icon: React.ReactNode })[] => {
  return facilities.map(enhanceFacilityWithIcon);
}; 