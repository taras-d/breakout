import { Component } from './component';

export interface BrickOptions {
    width: number;
    height: number;
    fill: string[];
}

export class Brick extends Component {

    private life: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        public options: BrickOptions
    ) {

        super(ctx, x, y);

        let offset = this.offset;
        offset.left = x;
        offset.right = options.width + x;
        offset.top = y;
        offset.bottom = options.height + y;

        this.life = this.options.fill.length;
    }

    alive(): boolean {
        return this.life > 0;
    }

    decreaseLife(): void {
        if (this.life > 0) {
            this.life -= 1;
        }
    }

    draw(): void {
        
        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill[this.life - 1];
        ctx.fillRect(this.x, this.y, opts.width, opts.height);
    }

}