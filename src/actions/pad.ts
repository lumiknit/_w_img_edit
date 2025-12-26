export type ActionPad = {
	type: 'pad';
	left: number;
	top: number;
	right: number;
	bottom: number;
	color?: string;
};

export const runActionPad = async (
	data: ActionPad,
	canvas: HTMLCanvasElement
): Promise<HTMLCanvasElement> => {
	// Create a temporary canvas to draw the padded area

	const oldWidth = canvas.width;
	const oldHeight = canvas.height;
	let newWidth = oldWidth + data.left + data.right;
	let newHeight = oldHeight + data.top + data.bottom;
	if (newWidth <= 0 || newHeight <= 0) {
		newWidth = 1;
		newHeight = 1;
	}

	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = newWidth;
	tempCanvas.height = newHeight;
	const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
	if (!tempCtx) {
		throw new Error('Could not get canvas context');
	}

	// Draw the old canvas onto the new canvas at the correct position
	tempCtx.drawImage(canvas, data.left, data.top);

	if (data.color) {
		// Fill boarder
		tempCtx.fillStyle = data.color || 'rgba(0,0,0,0)';

		if (data.top > 0) {
			tempCtx.fillRect(0, 0, newWidth, data.top);
		}
		if (data.bottom > 0) {
			tempCtx.fillRect(0, oldHeight + data.top, newWidth, data.bottom);
		}
		if (data.left > 0) {
			tempCtx.fillRect(0, 0, data.left, newHeight);
		}
		if (data.right > 0) {
			tempCtx.fillRect(oldWidth + data.left, 0, data.right, newHeight);
		}
	} else {
		// Extend edges
		for (let x = 0; x < newWidth; x++) {
			console.log('A');
			await new Promise((r) => setTimeout(r, 0)); // Yield to avoid blocking UI

			const betweenLeftAndRight =
				x >= data.left && x < data.left + oldWidth;
			for (let y = 0; y < newHeight; y++) {
				if (
					betweenLeftAndRight &&
					y >= data.top &&
					y < data.top + oldHeight
				) {
					// Skip to the next
					y = data.top + oldHeight - 1;
					continue;
				}

				let sy = y;
				if (y < data.top) {
					sy = 0;
				} else if (y >= data.top + oldHeight) {
					sy = oldHeight - 1;
				} else {
					sy = y - data.top;
				}

				let sx = x;
				if (x < data.left) {
					sx = 0;
				} else if (x >= data.left + oldWidth) {
					sx = oldWidth - 1;
				} else {
					sx = x - data.left;
				}

				const pixel = canvas
					.getContext('2d')!
					.getImageData(sx, sy, 1, 1);
				tempCtx.putImageData(pixel, x, y);
			}
		}
	}

	return tempCanvas;
};
