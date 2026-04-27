// vite.config.ts
import { defineConfig } from "file:///C:/Users/hp/Documents/Suhel_Mulla/frontend/ARC-F/node_modules/vite/dist/node/index.js";
import viteReact from "file:///C:/Users/hp/Documents/Suhel_Mulla/frontend/ARC-F/node_modules/@vitejs/plugin-react/dist/index.js";
import { TanStackRouterVite } from "file:///C:/Users/hp/Documents/Suhel_Mulla/frontend/ARC-F/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\hp\\Documents\\Suhel_Mulla\\frontend\\ARC-F";
var vite_config_default = defineConfig({
  plugins: [TanStackRouterVite(), viteReact()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    chunkSizeWarningLimit: 2500
  },
  server: {
    host: "0.0.0.0",
    // 👈 This exposes it to the network
    port: 5173
    // 👈 Optional: avoid random port change
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxocFxcXFxEb2N1bWVudHNcXFxcU3VoZWxfTXVsbGFcXFxcZnJvbnRlbmRcXFxcQVJDLUZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGhwXFxcXERvY3VtZW50c1xcXFxTdWhlbF9NdWxsYVxcXFxmcm9udGVuZFxcXFxBUkMtRlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvaHAvRG9jdW1lbnRzL1N1aGVsX011bGxhL2Zyb250ZW5kL0FSQy1GL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2aXRlUmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tICdAdGFuc3RhY2svcm91dGVyLXBsdWdpbi92aXRlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbVGFuU3RhY2tSb3V0ZXJWaXRlKCksIHZpdGVSZWFjdCgpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyNTAwLFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMC4wLjAuMCcsICAvLyBcdUQ4M0RcdURDNDggVGhpcyBleHBvc2VzIGl0IHRvIHRoZSBuZXR3b3JrXHJcbiAgICBwb3J0OiA1MTczICAgICAgICAvLyBcdUQ4M0RcdURDNDggT3B0aW9uYWw6IGF2b2lkIHJhbmRvbSBwb3J0IGNoYW5nZVxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdWLFNBQVMsb0JBQW9CO0FBQzdXLE9BQU8sZUFBZTtBQUN0QixTQUFTLDBCQUEwQjtBQUNuQyxTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQztBQUFBLEVBQzNDLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCx1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
