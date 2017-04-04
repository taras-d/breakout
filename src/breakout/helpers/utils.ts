
export function getKeyCode(event: KeyboardEvent): number {
    return event.keyCode || event.which;
}

export function merge(
    target: {[key: string]: any}, 
    ...objs: {[key: string]: any}[]
): {[key: string]: any} {

    let obj, prop, val;

    for (let i = 0; i < objs.length; ++i) {
        obj = objs[i];
        for (prop in obj) {
            val = obj[prop];
            if (Array.isArray(val)) {
                target[prop] = val.slice();
            } else if (typeof val === 'object') {
                if (typeof target[prop] !== 'object') {
                    target[prop] = {};
                }
                merge(target[prop], obj[prop]);
            } else {
                target[prop] = val;
            }
        }
    }

    return target;
}