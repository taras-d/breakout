import { Playground } from './core/playground';
import { Key, GameStatus } from './core/enums'; 

import { PaddleOptions } from './components/paddle';
import { BallOptions } from './components/ball';
import { BrickOptions } from './components/brick';
import { StatusOptions } from './components/status';

import { getKeyCode } from './helpers/utils';

export interface GameOptions {
    screen: {
        width: number,
        height: number
    },
    bg: { fill: string },
    paddle: PaddleOptions,
    ball: BallOptions,
    brick: BrickOptions,
    status: StatusOptions,
    autoPlay: boolean
}

export class Game {

    private playground: Playground;
    private canvas: HTMLCanvasElement;

    private frameId: number;

    private keys: {[key: string]: boolean} = {};

    constructor(
        private options: GameOptions,
        private parent: HTMLElement = document.body
    ) {

        this.bindMethods();
        this.createPlaygroud();
        this.newGame();
    }   

    bindMethods(): void {
        this.onNewFrame = this.onNewFrame.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    createPlaygroud(): void {
        let pg = new Playground(this.options, this.parent);
        this.playground = pg;
        this.canvas = pg.canvas;
    }

    newGame(): void {

        this.playground.newGame();

        let canvas = this.canvas;

        canvas.addEventListener('mousemove', this.onMouseMove);
        canvas.addEventListener('click', this.onMouseClick);

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        const FPS = 50;
        this.frameId = setInterval(this.onNewFrame, 1000 / FPS);
    }

    stopGame(): void {

        let canvas = this.canvas;
        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('click', this.onMouseClick);

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        clearInterval(this.frameId);
    }

    onNewFrame(): void {

        let pg = this.playground,
            keys = this.keys;

        if (pg.gameStatus !== GameStatus.Play) {
            this.stopGame();
            return;
        }

        pg.draw();

        if (keys[Key.Left]) {
            pg.movePaddleLeft();
        }
        if (keys[Key.Right]) {
            pg.movePaddleRight();
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.playground.movePaddleByMouse(event);
    }

    onMouseClick(event: MouseEvent): void {
        this.playground.captureBall(false);
    }

    onKeyDown(event: KeyboardEvent): void {

        let key = getKeyCode(event);
        this.keys[key] = true;

        if (key === Key.Space) {
            this.playground.captureBall();
        }
    }

    onKeyUp(event:KeyboardEvent): void {
        let key = getKeyCode(event);
        this.keys[key] = false;
    }

    destroy(): void {

        this.stopGame();

        this.playground.destroy();
        this.playground = null;

        this.options = null;
        this.parent = null;
    }

}

// Save game constructor to global scope
window['Breakout'] = Game;