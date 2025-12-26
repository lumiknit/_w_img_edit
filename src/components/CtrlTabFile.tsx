import { createSignal, type Component, type JSX } from 'solid-js';
import toast from 'solid-toast';
import { getMainCanvas, setToMainCanvas } from '../state';

const CtrlTabFile: Component = () => {
	const [selectedFileName, setSelectedFileName] =
		createSignal('No file selected');

	const fileReader = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () =>
				reject(reader.error ?? new Error('파일을 읽을 수 없습니다.'));
			reader.readAsDataURL(file);
		});

	const loadImage = (src: string) =>
		new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () =>
				reject(new Error('이미지를 해석할 수 없습니다.'));
			img.src = src;
		});

	const loadFileIntoCanvas = async (
		file: File,
		canvasEl: HTMLCanvasElement | undefined,
		setCanvasFromSource: (source: HTMLCanvasElement) => void
	) => {
		if (!canvasEl) {
			throw new Error('캔버스가 준비되지 않았습니다.');
		}
		const dataUrl = await fileReader(file);
		const image = await loadImage(dataUrl);
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = image.width || 1;
		tempCanvas.height = image.height || 1;
		const tempCtx = tempCanvas.getContext('2d');
		if (!tempCtx) {
			throw new Error('임시 캔버스를 만들 수 없습니다.');
		}
		tempCtx.drawImage(image, 0, 0);
		setCanvasFromSource(tempCanvas);
	};

	const handleFileChange: JSX.EventHandlerUnion<
		HTMLInputElement,
		Event
	> = async (event) => {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		setSelectedFileName(file.name);
		await loadFileIntoCanvas(file, getMainCanvas()!, setToMainCanvas);
	};

	const handleSaveCanvas = () => {
		const canvas = getMainCanvas();
		if (!canvas) {
			toast.error('저장할 캔버스가 없습니다.');
			return;
		}
		const link = document.createElement('a');
		link.href = canvas.toDataURL('image/png');
		link.download = `canvas-${Date.now()}.png`;
		link.click();
		toast.success('PNG로 저장했습니다.');
	};

	return (
		<div>
			<div class="field">
				<label class="label is-size-6">Load Image File</label>
				<div class="file has-name is-fullwidth">
					<label class="file-label">
						<input
							class="file-input"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
						/>
						<span class="file-cta">
							<span class="file-label">File</span>
						</span>
						<span class="file-name">{selectedFileName()}</span>
					</label>
				</div>
			</div>
			<button
				class="button is-link is-fullwidth"
				onClick={handleSaveCanvas}
			>
				Save Canvas
			</button>
		</div>
	);
};

export default CtrlTabFile;
