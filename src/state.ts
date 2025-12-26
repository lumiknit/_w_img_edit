import { createSignal } from 'solid-js';

let mainCanvas: HTMLCanvasElement | null = null;
let mainCtx: CanvasRenderingContext2D | null = null;

export const registerCanvas = (canvas: HTMLCanvasElement) => {
	mainCanvas = canvas;
	mainCtx = canvas.getContext('2d');
};

export const setMainCanvas = (canvas: HTMLCanvasElement | undefined) => {
	if (canvas) {
		mainCanvas = canvas;
		mainCtx = canvas.getContext('2d');
	} else {
		mainCanvas = null;
		mainCtx = null;
	}
};

export const getMainCanvas = () => mainCanvas;

export const getMainContext = () => mainCtx;

export type Size = {
	width: number;
	height: number;
};
export const [canvasSize, setCanvasSize] = createSignal<Size>({
	width: 0,
	height: 0,
});

export const canvasUpdated = () => {
	if (!mainCanvas) return;
	setCanvasSize({ width: mainCanvas.width, height: mainCanvas.height });
};

export const setToMainCanvas = (sourceCanvas: HTMLCanvasElement) => {
	if (!mainCanvas) throw new Error('캔버스를 찾을 수 없습니다.');
	const ctx = mainCanvas.getContext('2d');
	if (!ctx) throw new Error('캔버스 컨텍스트를 가져올 수 없습니다.');
	mainCanvas.width = sourceCanvas.width;
	mainCanvas.height = sourceCanvas.height;
	ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	ctx.drawImage(sourceCanvas, 0, 0);
	canvasUpdated();
};
