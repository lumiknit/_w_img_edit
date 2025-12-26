import { createSignal, For } from 'solid-js';
import type { Component } from 'solid-js';

import CtrlTabFile from './CtrlTabFile';
import CtrlTabPad from './CtrlTabPad';
import { Dynamic } from 'solid-js/web';

type Tab = {
	key: string;
	label: string;
	component: Component;
};

const tabs: Tab[] = [
	{
		key: 'file',
		label: '파일',
		component: CtrlTabFile,
	},
	{
		key: 'pad',
		label: '패드 추가',
		component: CtrlTabPad,
	},
];

const Controls: Component = () => {
	const [activeTab, setActiveTab] = createSignal<'file' | 'pad'>('file');

	return (
		<div class="box">
			<div class="tabs is-boxed is-small">
				<ul>
					<For each={tabs}>
						{(tab) => (
							<li
								classList={{
									'is-active': activeTab() === tab.key,
								}}
							>
								<a
									onClick={() =>
										setActiveTab(tab.key as 'file' | 'pad')
									}
								>
									{tab.label}
								</a>
							</li>
						)}
					</For>
				</ul>
			</div>
			<Dynamic
				component={tabs.find((t) => t.key === activeTab())?.component}
			/>
		</div>
	);
};

export default Controls;
