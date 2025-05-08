import React from 'react';

interface PanelButtonProps {
  color: 'primary' | 'primary2' | 'secondary' | 'danger' | 'white' | 'transparent' | 'black' | 'primaryOrange' | 'lightGray';
  name: string;
  textColor: 'primary' | 'secondary' | 'danger' | 'white' | 'black' | 'primaryOrange' | 'lightGray';
  border?:
    | 'primary'
    | 'primary2'
    | 'secondary'
    | 'danger'
    | 'white'
    | 'transparent'
    | 'black'
    | 'primaryOrange'
    | 'lightGray';
  icon?: React.ReactNode;
  iconPosition?: 'before' | 'after';
}

const classMapping: Record<
  PanelButtonProps['color'],
  { bg: string; text: string; border: string; onHover: string }
> = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    onHover: 'hover:saturate-150',
  },
  primary2: {
    bg: 'bg-primary2',
    text: 'text-primary2',
    border: 'border-primary2',
    onHover: 'hover:bg-primary2/80',
  },
  black: {
    bg: 'bg-black',
    text: 'text-black',
    border: 'border-black',
    onHover: 'hover:bg-gray-700',
  },
  secondary: {
    bg: 'bg-gray-500',
    text: 'text-gray-500',
    border: 'border-gray-500',
    onHover: 'hover:bg-gray-700',
  },
  danger: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    onHover: 'hover:bg-gray-700',
  },
  white: {
    bg: 'bg-white',
    text: 'text-white',
    border: 'border-white',
    onHover: 'hover:bg-gray-100',
  },
  transparent: {
    bg: 'bg-transparent',
    text: '',
    border: '',
    onHover: 'hover:bg-gray-800',
  },
  primaryOrange: {
    bg: 'bg-primaryOrange',
    text: 'text-white',
    border: 'border-primaryOrange',
    onHover: 'hover:bg-orange-600',
  },
  lightGray: {
    bg: 'bg-gray-300',
    text: 'text-gray-500',
    border: 'border-gray-300',
    onHover: 'hover:bg-gray-300',
  },
};

export default function Button({
  color,
  name,
  textColor,
  border,
  icon,
  iconPosition = 'before',
}: PanelButtonProps) {
  return (
    <div
      className={`rounded px-3 py-2 text-sm flex items-center gap-2
        ${border ? `border border-solid ${classMapping[border].border}` : ''} 
        ${classMapping[color].bg} 
        ${classMapping[textColor].text}
        ${classMapping[color].onHover}
        `}
    >
      {icon && iconPosition == 'before' && <span>{icon}</span>}
      <span>{name}</span>
      {icon && iconPosition == 'after' && <span>{icon}</span>}
    </div>
  );
}
