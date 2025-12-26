import { createSignal, Show, type Component } from 'solid-js';

import { getMainCanvas, setToMainCanvas } from '../state';
import toast from 'solid-toast';
import { runActionPad } from '../actions/pad';

const CtrlTabPad: Component = () => {
	const [extendColor, setExtendColor] = createSignal(false);
	const [color, setColor] = createSignal('#00000000');

	let inputLeftRef: HTMLInputElement;
	let inputRightRef: HTMLInputElement;
	let inputTopRef: HTMLInputElement;
	let inputBottomRef: HTMLInputElement;

	const applyPadding_ = async () => {
		const canvas = getMainCanvas();
		if (!canvas) {
			throw new Error('패딩을 적용할 캔버스가 없습니다.');
		}
		const left = Number(inputLeftRef!.value) || 0;
		const right = Number(inputRightRef!.value) || 0;
		const top = Number(inputTopRef!.value) || 0;
		const bottom = Number(inputBottomRef!.value) || 0;
		let c: string | undefined = undefined;
		if (!extendColor()) {
			c = color();
		}
		const result = await runActionPad(
			{
				type: 'pad',
				left,
				right,
				top,
				bottom,
				color: c,
			},
			canvas
		);
		setToMainCanvas(result);
	};

	const applyPadding = () =>
		toast.promise(applyPadding_(), {
			loading: '작업중... 패딩 적용 중입니다.',
			success: '패딩을 적용했습니다.',
			error: (err) =>
				err instanceof Error
					? err.message
					: '패딩 적용에 실패했습니다.',
		});

	return (
		<div>
			<div class="field is-horizontal">
				<div class="field-body">
					<div class="field">
						<label class="label">Top</label>
						<div class="control">
							<input
								ref={inputTopRef!}
								class="input"
								type="number"
							/>
						</div>
					</div>
					<div class="field">
						<label class="label">Bottom</label>
						<div class="control">
							<input
								ref={inputBottomRef!}
								class="input"
								type="number"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-body">
					<div class="field">
						<label class="label">Left</label>
						<div class="control">
							<input
								ref={inputLeftRef!}
								class="input"
								type="number"
							/>
						</div>
					</div>
					<div class="field">
						<label class="label">Right</label>
						<div class="control">
							<input
								ref={inputRightRef!}
								class="input"
								type="number"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="field">
				<div class="control">
					<label class="checkbox">
						<input
							type="checkbox"
							checked={extendColor()}
							onChange={() => setExtendColor((c) => !c)}
						/>
						Extend Boundary Color
					</label>
				</div>
			</div>

			<Show when={!extendColor()}>
				<div class="field">
					<label class="label">Color</label>
					<div class="control">
						<input
							class="input"
							type="color"
							value={color()}
							onChange={(e) => setColor(e.currentTarget.value)}
						/>
					</div>
					<div class="control">
						<input
							class="input"
							type="text"
							value={color()}
							onChange={(e) => setColor(e.currentTarget.value)}
						/>
					</div>
				</div>
			</Show>

			<button
				class="button is-primary is-fullwidth"
				onClick={applyPadding}
			>
				Apply Padding
			</button>
		</div>
	);
};

export default CtrlTabPad;
