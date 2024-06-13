export function generateClassName(conditions) {
    return Object.entries(conditions).map(
        ([className, condition]) => (condition ? className : ''),
    ).filter(Boolean).join(' ');
}