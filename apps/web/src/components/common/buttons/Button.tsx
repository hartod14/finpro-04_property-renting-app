interface PanelButtonProps {
    color: 'primary' | 'secondary' | 'danger' | 'white';
    name: string;
    textColor: 'primary' | 'secondary' | 'danger' | 'white';
    border?: 'primary' | 'secondary' | 'danger' | 'white' | null;
}

// Consolidated color mapping
const classMapping: Record<PanelButtonProps['color'], { bg: string; text: string; border: string }> = {
    primary: {
        bg: 'bg-primary',
        text: 'text-primary',
        border: 'border-primary'
    },
    secondary: {
        bg: 'bg-gray-500',
        text: 'text-gray-500',
        border: 'border-gray-500'
    },
    danger: {
        bg: 'bg-red-500',
        text: 'text-red-500',
        border: 'border-red-500'
    },
    white: {
        bg: 'bg-white',
        text: 'text-white',
        border: 'border-white'
    },
};

export default function Button({ color, name, textColor, border }: PanelButtonProps) {
    return (
        <button
            type="button"
            className={`rounded ${border ? `border border-solid ${classMapping[border].border}` : ''} px-4 py-3 text-sm 
                        ${classMapping[color].bg} ${classMapping[textColor].text}`}
        >
            {name}
        </button>
    );
}
