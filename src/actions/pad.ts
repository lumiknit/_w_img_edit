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

	const srcX = Math.max(0, -data.left);
	const srcY = Math.max(0, -data.top);
	const destX = Math.max(0, data.left);
	const destY = Math.max(0, data.top);
	const drawWidth = Math.max(0, Math.min(oldWidth - srcX, newWidth - destX));
	const drawHeight = Math.max(
		0,
		Math.min(oldHeight - srcY, newHeight - destY)
	);

	if (drawWidth > 0 && drawHeight > 0) {
		tempCtx.drawImage(
			canvas,
			srcX,
			srcY,
			drawWidth,
			drawHeight,
			destX,
			destY,
			drawWidth,
			drawHeight
		);
	}

	const leftPad = destX;
	const topPad = destY;
	const rightPad = Math.max(0, newWidth - (destX + drawWidth));
	const bottomPad = Math.max(0, newHeight - (destY + drawHeight));
	const contentWidth = drawWidth;
	const contentHeight = drawHeight;

	if (data.color) {
		tempCtx.fillStyle = data.color;
		if (topPad > 0) {
			tempCtx.fillRect(0, 0, newWidth, topPad);
		}
		if (bottomPad > 0) {
			tempCtx.fillRect(0, newHeight - bottomPad, newWidth, bottomPad);
		}
		if (leftPad > 0) {
			tempCtx.fillRect(
				0,
				topPad,
				leftPad,
				Math.max(0, newHeight - topPad - bottomPad)
			);
		}
		if (rightPad > 0) {
			tempCtx.fillRect(
				newWidth - rightPad,
				topPad,
				rightPad,
				Math.max(0, newHeight - topPad - bottomPad)
			);
		}
	} else {
		const stretch = (
			sx: number,
			sy: number,
			sw: number,
			sh: number,
			dx: number,
			dy: number,
			dw: number,
			dh: number
		) => {
			if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return;
			tempCtx.drawImage(tempCanvas, sx, sy, sw, sh, dx, dy, dw, dh);
		};

		const hasContent = contentWidth > 0 && contentHeight > 0;
		if (hasContent) {
			const imageX = destX;
			const imageY = destY;
			const imageRight = imageX + contentWidth;
			const imageBottom = imageY + contentHeight;

			// Top & bottom bands
			if (topPad > 0) {
				stretch(
					imageX,
					imageY,
					contentWidth,
					1,
					imageX,
					0,
					contentWidth,
					topPad
				);
			}
			if (bottomPad > 0) {
				stretch(
					imageX,
					imageBottom - 1,
					contentWidth,
					1,
					imageX,
					imageBottom,
					contentWidth,
					bottomPad
				);
			}

			// Left & right bands
			if (leftPad > 0) {
				stretch(
					imageX,
					imageY,
					1,
					contentHeight,
					0,
					imageY,
					leftPad,
					contentHeight
				);
			}
			if (rightPad > 0) {
				stretch(
					imageRight - 1,
					imageY,
					1,
					contentHeight,
					imageRight,
					imageY,
					rightPad,
					contentHeight
				);
			}

			// Corners
			if (topPad > 0 && leftPad > 0) {
				stretch(imageX, imageY, 1, 1, 0, 0, leftPad, topPad);
			}
			if (topPad > 0 && rightPad > 0) {
				stretch(
					imageRight - 1,
					imageY,
					1,
					1,
					imageRight,
					0,
					rightPad,
					topPad
				);
			}
			if (bottomPad > 0 && leftPad > 0) {
				stretch(
					imageX,
					imageBottom - 1,
					1,
					1,
					0,
					imageBottom,
					leftPad,
					bottomPad
				);
			}
			if (bottomPad > 0 && rightPad > 0) {
				stretch(
					imageRight - 1,
					imageBottom - 1,
					1,
					1,
					imageRight,
					imageBottom,
					rightPad,
					bottomPad
				);
			}
		}
	}

	return tempCanvas;
};
