import { type Component } from 'solid-js';

import CanvasPanel from './components/CanvasPanel';
import Controls from './components/Controls';

const App: Component = () => {
	return (
		<section class="section">
			<div class="container">
				<div class="columns is-variable is-5">
					<div class="column is-two-thirds">
						<CanvasPanel />
					</div>
					<div class="column">
						<Controls />
					</div>
				</div>
			</div>
		</section>
	);
};

export default App;
