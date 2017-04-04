import { Component } from './component';

export interface StatusOptions {
    fill: string,
    font: string
}

export class Status extends Component {

    private life: number;
    private score: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        public options: StatusOptions
    ) {
        super(ctx, x, y);
        this.reset();
    }

    reset(): void {
        this.score = 0;
        this.life = 3;
    }

    increaseScore(): void {
        this.score += 10;
    }

    decreaseLife(): void {
        this.life -= 1;
    }

    alive(): boolean {
        return this.life > 1;
    }

    draw(): void {

        let ctx = this.ctx,
            opts = this.options;

        // Status
        ctx.fillStyle = opts.fill;
        ctx.font = opts.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Score: ${this.score}`, 30, 30);

        // Life
        ctx.textAlign = 'right';
        ctx.textBaseline = 'left';
        ctx.fillText(`Life: ${this.life}`, this.ctx.canvas.width - 30, 30);

    }

}