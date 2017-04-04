import { Component } from './component';

export interface PaddleOptions {
    width: number,
    height: number,
    offsetBottom: number,
    fill: string
}

export class Paddle extends Component {

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        public options: PaddleOptions
    ) {
        super(ctx, x, y);
    }

    draw(): void {

        let opts = this.options,
            ctx = this.ctx;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, opts.width, opts.height);
    }

}