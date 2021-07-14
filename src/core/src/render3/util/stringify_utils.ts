export function renderStringify(value: any): string {
    if (typeof value === 'string') return value;
    if (value == null) return '';
    return String(value);
}

export function stringifyForError(value: any): string {
    if (typeof value === 'function') return value.name || value.toString();
    if (typeof value === 'object' && value != null && typeof value.type === 'function') {
        return value.type.name || value.type.toString();
    }

    return renderStringify(value);
}
