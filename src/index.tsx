/* @refresh reload */
import { render } from 'solid-js/web';
import { Toaster } from 'solid-toast';

import 'bulma/css/bulma.min.css';
import './index.css';

import App from './App.tsx';

const root = document.getElementById('root');

render(
	() => (
		<>
			<Toaster />
			<App />
		</>
	),
	root!
);
