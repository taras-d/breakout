
export function getKeyCode(event: KeyboardEvent): number {
    return event.keyCode || event.which;
}