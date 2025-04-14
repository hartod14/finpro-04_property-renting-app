export function convertEnumToString(enumValue: string): string {
    return enumValue
        .split('_') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' '); 
}
