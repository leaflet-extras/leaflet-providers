const banner = `/*! GENERATED FILE - DO NOT EDIT DIRECTLY. Edit files in src/ and run 'npm run build' */`;

export default [
	// ESM build (supports named and default exports)
	{
		input: 'src/leaflet-providers.js',
		external: ['leaflet'],
		output: {
			file: 'dist/leaflet-providers.js',
			format: 'es',
			banner,
			sourcemap: false
		},
	},
	// UMD build (uses separate entry for clean default export → L.Control.FullScreen)
	{
		input: 'src/umd-entry.js',
		external: ['leaflet'],
		output: {
			file: 'dist/leaflet-providers.umd.js',
			format: 'umd',
			name: 'L.TileLayer.Provider',
			exports: 'default',
			globals: {
				leaflet: 'L'
			},
			banner,
			sourcemap: false
		}
	}
];
