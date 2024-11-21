import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
    server:{
        port:5188
    },
    plugins: [react()],
    css: {
        devSourcemap: true
    },
    build: {
        chunkSizeWarningLimit: 5000,
    },
    define: {
        global: "globalThis",
    },
})
