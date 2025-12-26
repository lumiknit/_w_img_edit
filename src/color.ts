function clamp01(v: number) {
	return Math.min(1, Math.max(0, v));
}

function roundByte(v: number) {
	return Math.round(Math.min(255, Math.max(0, v)));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hh = (h % 360) / 60;
	const x = c * (1 - Math.abs((hh % 2) - 1));
	let r1 = 0,
		g1 = 0,
		b1 = 0;
	if (hh >= 0 && hh < 1) [r1, g1, b1] = [c, x, 0];
	else if (hh >= 1 && hh < 2) [r1, g1, b1] = [x, c, 0];
	else if (hh >= 2 && hh < 3) [r1, g1, b1] = [0, c, x];
	else if (hh >= 3 && hh < 4) [r1, g1, b1] = [0, x, c];
	else if (hh >= 4 && hh < 5) [r1, g1, b1] = [x, 0, c];
	else [r1, g1, b1] = [c, 0, x];
	const m = l - c / 2;
	return [
		roundByte((r1 + m) * 255),
		roundByte((g1 + m) * 255),
		roundByte((b1 + m) * 255),
	];
}

const namedColors: Record<string, string> = {
	black: '#000000',
	silver: '#c0c0c0',
	gray: '#808080',
	white: '#ffffff',
	maroon: '#800000',
	red: '#ff0000',
	purple: '#800080',
	fuchsia: '#ff00ff',
	green: '#008000',
	lime: '#00ff00',
	olive: '#808000',
	yellow: '#ffff00',
	navy: '#000080',
	blue: '#0000ff',
	teal: '#008080',
	aqua: '#00ffff',
};

export function parseColorToRGB(input: string): [number, number, number] {
	const str = input.trim().toLowerCase();

	// named color
	if (namedColors[str]) {
		return parseColorToRGB(namedColors[str]);
	}

	// hex formats
	const hexMatch = str.match(/^#([0-9a-f]{3,8})$/i);
	if (hexMatch) {
		const hex = hexMatch[1];
		if (hex.length === 3 || hex.length === 4) {
			// short form #rgb or #rgba
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			return [r, g, b];
		}
		if (hex.length === 6 || hex.length === 8) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			return [r, g, b];
		}
	}

	// rgb() or rgba()
	const rgbMatch = str.match(/^rgba?\(([^)]+)\)$/);
	if (rgbMatch) {
		const parts = rgbMatch[1].split(',').map((p) => p.trim());
		if (parts.length >= 3) {
			const parseChannel = (v: string) => {
				if (v.endsWith('%')) {
					return roundByte((parseFloat(v) / 100) * 255);
				}
				return roundByte(parseFloat(v));
			};
			const r = parseChannel(parts[0]);
			const g = parseChannel(parts[1]);
			const b = parseChannel(parts[2]);
			return [r, g, b];
		}
	}

	// hsl() or hsla()
	const hslMatch = str.match(/^hsla?\(([^)]+)\)$/);
	if (hslMatch) {
		const parts = hslMatch[1].split(',').map((p) => p.trim());
		if (parts.length >= 3) {
			const h = parseFloat(parts[0].replace(/deg$/, ''));
			const s = parts[1].endsWith('%')
				? parseFloat(parts[1]) / 100
				: parseFloat(parts[1]);
			const l = parts[2].endsWith('%')
				? parseFloat(parts[2]) / 100
				: parseFloat(parts[2]);
			return hslToRgb(h, clamp01(s), clamp01(l));
		}
	}

	// fallback: attempt to parse plain numbers ("r g b")
	const parts = str.split(/\s+/).filter(Boolean);
	if (parts.length === 3) {
		const r = roundByte(parseFloat(parts[0]));
		const g = roundByte(parseFloat(parts[1]));
		const b = roundByte(parseFloat(parts[2]));
		if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b))
			return [r, g, b];
	}

	throw new Error(`Unrecognized color format: ${input}`);
}

export default parseColorToRGB;
