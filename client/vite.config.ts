import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; 


//https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      "@types": path.resolve(__dirname, './src/types/'), 
      '@hooks': path.resolve(__dirname, './src/hooks/'), 
      '@pages': path.resolve(__dirname, './src/pages/'), 
      '@store': path.resolve(__dirname, './src/store/'), 
      '@config': path.resolve(__dirname, './src/config/'),
      '@assets':  path.resolve(__dirname, './src/assets/'), 
      "@helpers": path.resolve(__dirname, './src/helpers/'),
      '@components': path.resolve(__dirname, './src/components/'),
    }
  }
})



