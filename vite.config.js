import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
	  proxy: {
		'/generate-session': 'https://pdf-coviewing-kalvium.onrender.com',
	  },
	},
  });
