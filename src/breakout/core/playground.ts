import { GameOptions } from '../game';
import { GameStatus } from './enums';

import { Brick } from '../components/brick';
import { Ball } from '../components/ball';
import { Paddle } from '../components/paddle';
import { Status } from '../components/status';

import { logger } from '../helpers/logger';

export class Playground {

    canvas: HTMLCanvasElement;

    gameStatus: GameStatus;
    
    private width: number;
    private height: number;
    private autoPlay: boolean;

    private canvasRect: ClientRect;
    private ctx: CanvasRenderingContext2D;

    private paddle: Paddle;
    private paddleStep: number;

    private ball: Ball;
    private ballXStep: number;
    private ballYStep: number;
    private ballCaptured: boolean;

    private bricks: Brick[];
    private bricksLen: number;

    private status: Status;

    constructor(
        private options: GameOptions,
        private parent: HTMLElement
    ) {

        let opts = this.options;
        this.width = opts.screen.width;
        this.height = opts.screen.height;
        this.autoPlay = opts.autoPlay;

        this.createCanvas();
        this.createPaddle();
        this.createBall();
        this.createStatus();
    }

    newGame(): void {

        this.gameStatus = GameStatus.Play;

        this.status.reset();

        this.createBricks();

        this.movePaddleToCenter();

        this.captureBall( !this.autoPlay );
    }

    createCanvas(): void {

        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.parent.appendChild(canvas);

        this.canvasRect = canvas.getBoundingClientRect();
    }

    createPaddle(): void {
        
        let opts = this.options,
            x = 0,
            y = Math.round( this.height - opts.paddle.offsetBottom - opts.paddle.height );

        this.paddle = new Paddle(this.ctx, x, y, opts.paddle);

        this.movePaddleToCenter();

        this.paddleStep = 0.02 * this.width;
    }

    createBall(): void {

        let opts = this.options;

        this.ball = new Ball(this.ctx, 0, 0, this.options.ball);

        this.moveBallToPaddleCenter();

        this.ballXStep = Math.round( 0.013 * this.height );
        this.ballYStep = -this.ballXStep;
    }

    createBricks(): void {

        let bricks = [],
            brickOpts = this.options.brick,
            width = brickOpts.width,
            height = brickOpts.height;

        let offsetX = 100,
            offsetY = 70,
            gap = 20,
            rows = Math.round( (this.height * 0.35) / (height + gap) ),
            cols = Math.round( (this.width - offsetX * 2) / (width + gap) );

        let x = offsetX,
            y = offsetY;

        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                bricks.push( new Brick(this.ctx, x, y, brickOpts) );
                x += width + gap;
            }
            x = offsetX;
            y += height + gap; 
        }

        this.bricks = bricks;
        this.bricksLen = bricks.length;
    }

    createStatus(): void {
        this.status = new Status(this.ctx, 0, 0, this.options.status);
    }

    clear(): void {
        let opts = this.options,
            ctx = this.ctx;
        ctx.fillStyle = opts.bg.fill;
        ctx.clearRect(0, 0, opts.screen.width, opts.screen.height);
    }

    draw(): void {

        this.clear();

        this.processCollision();
        
        this.drawPaddle();
        this.drawBall();
        this.drawBricks();
        this.drawStatus();

        if (this.gameStatus !== GameStatus.Play) {
            this.drawGameEnd();
        }
    }

    drawPaddle(): void {

        let paddle = this.paddle,
            ball = this.ball;

        if (this.autoPlay) {
            this.movePaddle( ball.x - paddle.options.width / 2);
        }

        paddle.draw();
    }

    drawBall(): void {

        let ball = this.ball;

        if (this.ballCaptured) {
            this.moveBallToPaddleCenter();
        } else {
            ball.moveX( ball.x + this.ballXStep );
            ball.moveY( ball.y + this.ballYStep );
        }

        ball.draw();
    }

    drawBricks(): void {

        let bricks = this.bricks,
            bricksLen = this.bricksLen,
            brick: Brick;

        let activeBlocks = false;
        
        for (let i = 0; i < bricksLen; ++i) {
            brick = bricks[i];
            if (brick.alive()) {
                brick.draw();
                activeBlocks = true;
            }
        }

        if (!activeBlocks) {
            this.gameStatus = GameStatus.Win;
        }
    }

    drawStatus(): void {
        this.status.draw();
    }

    drawGameEnd(): void {

        let ctx = this.ctx,
            opts = this.options,
            text = this.gameStatus === GameStatus.Win? 'Congratulation. You win!': 'You lose';

        // Cover
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, 0, this.width, this.height);

        // Text
        ctx.globalAlpha = 1;
        ctx.fillStyle = opts.status.fill;
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, Math.round(this.width / 2), Math.round(this.height / 2));
    }

    movePaddle(x: number): void {

        let paddle = this.paddle;

        let xMin = 0,
            xMax = this.width - paddle.options.width;

        x = (x < xMin)? xMin: (x > xMax)? xMax: x;
        
        paddle.x = Math.round(x);
    }

    movePaddleByMouse(event: MouseEvent): void {

        if (this.autoPlay) {
            return;
        }

        this.movePaddle( 
            event.clientX - this.canvasRect.left - (this.paddle.options.width / 2) );
    }

    movePaddleLeft(): void {

        if (this.autoPlay) {
            return;
        }

        this.movePaddle( this.paddle.x - this.paddleStep );
    }

    movePaddleRight(): void {

        if (this.autoPlay) {
            return;
        }

        this.movePaddle( this.paddle.x + this.paddleStep );
    }

    movePaddleToCenter(): void {
        this.movePaddle( this.width / 2 - this.paddle.options.width / 2);
    }
    
    captureBall(capture?: boolean): void {

        if (capture === undefined) {
            capture = !this.ballCaptured;
        }

        if (!capture && this.ballCaptured) {
             // Move ball up to 1px to skip paddle collision detection
            let ball = this.ball;
            ball.moveY( ball.y - 1 );
        }

        this.ballCaptured = capture;
    }

    moveBallToPaddleCenter(): void {

        let ball = this.ball,
            paddle = this.paddle;

        ball.moveX( paddle.x + paddle.options.width / 2);
        ball.moveY( paddle.y - ball.options.radius );
    }

    destroy(): void {
        this.parent.removeChild(this.canvas);
    }

    private processCollision(): void {

        if (this.ballCaptured) {
            return;
        }

        this.processBorderCollision() ||
        this.processPaddleCollision() ||
        this.processBrickCollision();
    }

    private processBorderCollision(): boolean {

        let ball = this.ball,
            offset = ball.offset;

        // Left border
        if (offset.left <= 0) {
            logger.log('Border left collision');
            ball.moveX(ball.options.radius);
            this.ballXStep = -this.ballXStep;
            return true;
        }

        // Right border
        if (offset.right >= this.width) {
            logger.log('Border right collision');
            ball.moveX(this.width - ball.options.radius);
            this.ballXStep = -this.ballXStep;
            return true;
        }

        // Top border
        if (offset.top <= 0) {
            logger.log('Border top collision');
            ball.moveY(ball.options.radius);
            this.ballYStep = -this.ballYStep;
            return true;
        }

        // Bottom border
        if (offset.bottom >= this.height) {

            logger.log('Border bottom collision');

            logger.log('Lost life');

            let status = this.status;

            if (status.alive()) {
                this.captureBall(true);
            } else {
                this.gameStatus = GameStatus.Loss;
                logger.log('Game over');
            }

            status.decreaseLife();

            return true;
        }

        return false;
    }

    private processPaddleCollision(): boolean {

        let paddle = this.paddle,
            paddleRight = paddle.x + paddle.options.width,
            paddleBottom = paddle.y + paddle.options.height;

        let ball = this.ball,
            offset = ball.offset;

        let collide = (
            (offset.bottom >= paddle.y && offset.top < paddle.y) &&
            (
                (offset.left > paddle.x && offset.left < paddleRight) ||
                (offset.right > paddle.x && offset.right < paddleRight)
            )
        );

        if (collide) {
            logger.log('Paddle collision');
            ball.moveY( paddle.y - ball.options.radius );
            this.ballYStep = -this.ballYStep;
        }

        return collide;
    }

    private processBrickCollision(): boolean {
        
        let ball = this.ball,
            ballOffset = ball.offset;

        var bricks = this.bricks,
            bricksLen = this.bricksLen,
            brickOffset,
            brick: Brick;

        for (let i = 0; i < bricksLen; ++i) {

            brick = bricks[i];
            brickOffset = brick.offset;

            if (!brick.alive()) {
                continue;
            }
            
            // Top/bottom
            if (
                (
                    (ballOffset.bottom >= brickOffset.top && ballOffset.top < brickOffset.top) ||
                    (ballOffset.top <= brickOffset.bottom && ballOffset.bottom > brickOffset.bottom)
                ) &&
                (ball.x > brickOffset.left && ball.x < brickOffset.right)
            ) {
                logger.log('Brick top/bottom collision');
                brick.decreaseLife();
                this.status.increaseScore();
                this.ballYStep = -this.ballYStep;
                return true;
            }

            // Left/right
            if (
                (
                    (ballOffset.right >= brickOffset.left && ballOffset.left < brickOffset.left) ||
                    (ballOffset.left <= brickOffset.right && ballOffset.right > brickOffset.right)
                ) &&
                (ball.y > brickOffset.top && ball.y < brickOffset.bottom)
            ) {
                logger.log('Brick left/right collision');
                brick.decreaseLife();
                this.status.increaseScore();
                this.ballXStep = -this.ballXStep;
                return true;
            }

        }

        return false;
    }

}