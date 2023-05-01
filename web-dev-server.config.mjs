export default {
  nodeResolve: true,
  port: 8000,
  preserveSymlinks: true,
  plugins: [
    {
      name: 'custom-headers',
      transform(context) {
        context.set('Cross-Origin-Opener-Policy', 'same-origin');
        context.set('Cross-Origin-Embedder-Policy', 'require-corp');
      }
    }
  ]
};
