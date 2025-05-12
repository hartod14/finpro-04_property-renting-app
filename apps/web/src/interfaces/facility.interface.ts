import React from 'react';

export interface IFacility {
  id: number;
  name: string;
  type?: string;
  icon?: string;
}

// Type for enhanced facility with React icon node
export interface IFacilityWithIcon extends Omit<IFacility, 'icon'> {
  icon: React.ReactNode;
  id: number;
  name: string;
  type?: 'PROPERTY' | 'ROOM';
}
