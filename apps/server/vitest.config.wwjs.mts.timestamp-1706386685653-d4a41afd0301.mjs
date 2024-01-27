// vitest.config.wwjs.mts
import { config } from "file:///C:/WWW/@opensource/whatshare/packages/config/vitest/dist/node.mjs";
import swc from "file:///C:/WWW/@opensource/whatshare/node_modules/.pnpm/unplugin-swc@1.4.4_@swc+core@1.3.106/node_modules/unplugin-swc/dist/index.mjs";
import { defineConfig, mergeConfig } from "file:///C:/WWW/@opensource/whatshare/node_modules/.pnpm/vitest@1.2.2_@types+node@20.11.7_@vitest+ui@1.2.2/node_modules/vitest/dist/config.js";
var vitest_config_wwjs_default = defineConfig(
  mergeConfig(config, {
    test: {
      include: ["**/*.wwjs-spec.ts"],
      setupFiles: [
        "./test/setup/mongo-database-test.ts",
        "./test/setup/wwjs-session.ts"
      ],
      testTimeout: 1e3 * 40,
      // 40 seconds
      fileParallelism: false,
      sequence: {
        setupFiles: "list"
      }
    },
    plugins: [
      swc.vite({
        module: { type: "es6" }
      })
    ]
  })
);
export {
  vitest_config_wwjs_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy53d2pzLm10cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFdXV1xcXFxAb3BlbnNvdXJjZVxcXFx3aGF0c2hhcmVcXFxcYXBwc1xcXFxzZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFdXV1xcXFxAb3BlbnNvdXJjZVxcXFx3aGF0c2hhcmVcXFxcYXBwc1xcXFxzZXJ2ZXJcXFxcdml0ZXN0LmNvbmZpZy53d2pzLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV1dXL0BvcGVuc291cmNlL3doYXRzaGFyZS9hcHBzL3NlcnZlci92aXRlc3QuY29uZmlnLnd3anMubXRzXCI7aW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnQHdoYXRzaGFyZS92aXRlc3QtY29uZmlnL25vZGUnXHJcbmltcG9ydCBzd2MgZnJvbSAndW5wbHVnaW4tc3djJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnLCBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhcclxuICBtZXJnZUNvbmZpZyhjb25maWcsIHtcclxuICAgIHRlc3Q6IHtcclxuICAgICAgaW5jbHVkZTogWycqKi8qLnd3anMtc3BlYy50cyddLFxyXG4gICAgICBzZXR1cEZpbGVzOiBbXHJcbiAgICAgICAgJy4vdGVzdC9zZXR1cC9tb25nby1kYXRhYmFzZS10ZXN0LnRzJyxcclxuICAgICAgICAnLi90ZXN0L3NldHVwL3d3anMtc2Vzc2lvbi50cycsXHJcbiAgICAgIF0sXHJcbiAgICAgIHRlc3RUaW1lb3V0OiAxMDAwICogNDAsIC8vIDQwIHNlY29uZHNcclxuICAgICAgZmlsZVBhcmFsbGVsaXNtOiBmYWxzZSxcclxuICAgICAgc2VxdWVuY2U6IHtcclxuICAgICAgICBzZXR1cEZpbGVzOiAnbGlzdCcsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBzd2Mudml0ZSh7XHJcbiAgICAgICAgbW9kdWxlOiB7IHR5cGU6ICdlczYnIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICB9IGFzIFVzZXJDb25maWcpLFxyXG4pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1UsU0FBUyxjQUFjO0FBQzdWLE9BQU8sU0FBUztBQUNoQixTQUFTLGNBQWMsbUJBQStCO0FBRXRELElBQU8sNkJBQVE7QUFBQSxFQUNiLFlBQVksUUFBUTtBQUFBLElBQ2xCLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxtQkFBbUI7QUFBQSxNQUM3QixZQUFZO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxhQUFhLE1BQU87QUFBQTtBQUFBLE1BQ3BCLGlCQUFpQjtBQUFBLE1BQ2pCLFVBQVU7QUFBQSxRQUNSLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsSUFBSSxLQUFLO0FBQUEsUUFDUCxRQUFRLEVBQUUsTUFBTSxNQUFNO0FBQUEsTUFDeEIsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGLENBQWU7QUFDakI7IiwKICAibmFtZXMiOiBbXQp9Cg==
