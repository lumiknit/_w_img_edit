import { onCleanup, onMount, type Component } from 'solid-js';
import { canvasSize, setMainCanvas } from '../state';

const CanvasPanel: Component = () => {
	let canvasRef: HTMLCanvasElement;
	onMount(() => {
		setMainCanvas(canvasRef!);
	});
	onCleanup(() => {
		setMainCanvas(undefined);
	});

	return (
		<div class="box">
			<div class="is-flex is-justify-content-center overflow-auto">
				<canvas
					ref={canvasRef!}
					class="has-background-light max-w-full h-auto"
				/>
			</div>
			<p class="has-text-grey is-size-7 has-text-centered mt-3">
				Width {canvasSize().width}px · Height {canvasSize().height}px
			</p>
		</div>
	);
};

export default CanvasPanel;
