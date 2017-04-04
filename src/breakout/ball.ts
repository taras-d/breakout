import { Component } from './component';

export interface BallOptions {
    radius: number,
    fill: string
}

export class Ball extends Component {

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        public options: BallOptions
    ) {
        super(ctx, x, y);
        this.moveX(x);
        this.moveY(y);
    }

    draw(): void {

        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, opts.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    moveX(x: number): void {
        let r = this.options.radius;
        this.x = x;
        this.offset.left = x - r;
        this.offset.right = x + r;
    }

    moveY(y: number): void {
        let r = this.options.radius;
        this.y = y;
        this.offset.top = y - r;
        this.offset.bottom = y + r;
    }

}