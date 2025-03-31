interface PanelButtonProps {
  color: 'primary' | 'secondary' | 'danger' | 'white' | 'transparent' | 'black';
  name: string;
  textColor: 'primary' | 'secondary' | 'danger' | 'white' | 'black';
  border?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'white'
    | 'transparent'
    | 'black'
    | null;
}

const classMapping: Record<
  PanelButtonProps['color'],
  { bg: string; text: string; border: string; onHover: string }
> = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    onHover: 'saturate-150',
  },
  black: {
    bg: 'bg-black',
    text: 'text-black',
    border: 'border-black',
    onHover: 'bg-gray-700',
  },
  secondary: {
    bg: 'bg-gray-500',
    text: 'text-gray-500',
    border: 'border-gray-500',
    onHover: 'bg-gray-700',
  },
  danger: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    onHover: 'bg-gray-700',
  },
  white: {
    bg: 'bg-white',
    text: 'text-white',
    border: 'border-white',
    onHover: 'bg-gray-100',
  },
  transparent: {
    bg: 'bg-transparent',
    text: '',
    border: '',
    onHover: 'bg-gray-800',
  },
};

export default function Button({
  color,
  name,
  textColor,
  border,
}: PanelButtonProps) {
  return (
    <button
      type="button"
      className={`rounded px-4 py-3 text-sm 
        ${border ? `border border-solid ${classMapping[border].border}` : ''} 
        ${classMapping[color].bg} 
        ${classMapping[textColor].text}
        hover:${classMapping[color].onHover}
        `}
    >
      {name}
    </button>
  );
}
