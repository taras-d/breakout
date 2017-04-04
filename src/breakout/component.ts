
export class Component {

    public offset = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    constructor(
        protected ctx: CanvasRenderingContext2D,
        public x: number,
        public y: number
    ) {

    }

}
