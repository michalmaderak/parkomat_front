// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: { // <--- DODAJ TĘ SEKCJĘ
      port: 5174, // Możesz ustawić port, na którym działa frontend (domyślnie Vite używa 5173 lub innego wolnego)
                  // Upewnij się, że backend Spring Boot działa na innym porcie (np. 8080)
      proxy: {
        // Wszystkie żądania, których ścieżka zaczyna się od '/api'
        // będą przekierowywane do Twojego backendu Spring Boot.
        '/api': {
          target: 'http://localhost:8080', // <--- URL Twojego backendu Spring Boot
          changeOrigin: true, // Ważne, aby serwer docelowy myślał, że żądanie pochodzi z tego samego źródła
          // secure: false, // Dodaj, jeśli Twój backend używa HTTPS z certyfikatem self-signed (w deweloperce)
          // rewrite: (path) => path.replace(/^\/api/, '') 
          //   Powyższą linię odkomentuj TYLKO WTEDY, gdy Twój backend Spring Boot
          //   NIE oczekuje prefiksu /api w swoich endpointach.
          //   Np. jeśli frontend wysyła /api/parkings/5, a backend oczekuje /parkings/5,
          //   to rewrite usunie /api. Jeśli backend oczekuje /api/parkings/5, zostaw zakomentowane.
        }
      }
    }
  }
})