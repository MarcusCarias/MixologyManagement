
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "vaul@1.1.2": "vaul",
        "sonner@2.0.3": "sonner",
        "recharts@2.15.2": "recharts",
        "react-resizable-panels@2.1.7": "react-resizable-panels",
        "react-hook-form@7.55.0": "react-hook-form",
        "react-day-picker@8.10.1": "react-day-picker",
        "next-themes@0.4.6": "next-themes",
        "lucide-react@0.487.0": "lucide-react",
        "input-otp@1.4.2": "input-otp",
        "figma:asset/ff6777c2979622d15954538ade2cbfd52671f5e0.png":
          path.resolve(
            __dirname,
            "./src/assets/ff6777c2979622d15954538ade2cbfd52671f5e0.png",
          ),
        "figma:asset/f4e711edc0aaca3bb8806641875da133c9e25c6b.png":
          path.resolve(
            __dirname,
            "./src/assets/f4e711edc0aaca3bb8806641875da133c9e25c6b.png",
          ),
        "figma:asset/f042553d298712233d95b0cee252c161af64ed55.png":
          path.resolve(
            __dirname,
            "./src/assets/f042553d298712233d95b0cee252c161af64ed55.png",
          ),
        "figma:asset/ee46842322b04f10a4f0fd46778bcdfa42b2d8bb.png":
          path.resolve(
            __dirname,
            "./src/assets/ee46842322b04f10a4f0fd46778bcdfa42b2d8bb.png",
          ),
        "figma:asset/d1862b629b71b3ba1225901b1a1108a89792dcf8.png":
          path.resolve(
            __dirname,
            "./src/assets/d1862b629b71b3ba1225901b1a1108a89792dcf8.png",
          ),
        "figma:asset/ce20a74ff227ca777717164f398f4dc2c8081e97.png":
          path.resolve(
            __dirname,
            "./src/assets/ce20a74ff227ca777717164f398f4dc2c8081e97.png",
          ),
        "figma:asset/c537bf758803dfa5afc2cf51c426e21d89b2eabe.png":
          path.resolve(
            __dirname,
            "./src/assets/c537bf758803dfa5afc2cf51c426e21d89b2eabe.png",
          ),
        "figma:asset/b864550aedd95f41f2d2687dadc24e930417b9c1.png":
          path.resolve(
            __dirname,
            "./src/assets/b864550aedd95f41f2d2687dadc24e930417b9c1.png",
          ),
        "figma:asset/b39866e3efe206bba7b76c3dd07efdaa1112a686.png":
          path.resolve(
            __dirname,
            "./src/assets/b39866e3efe206bba7b76c3dd07efdaa1112a686.png",
          ),
        "figma:asset/b11883d42e10501777bfc8efe57eb3e157169620.png":
          path.resolve(
            __dirname,
            "./src/assets/b11883d42e10501777bfc8efe57eb3e157169620.png",
          ),
        "figma:asset/aea31373ac58ed63d1dbb2deee4d8cea347263a6.png":
          path.resolve(
            __dirname,
            "./src/assets/aea31373ac58ed63d1dbb2deee4d8cea347263a6.png",
          ),
        "figma:asset/a4678e896a5d6646c13a0369c169a0fe09ffc938.png":
          path.resolve(
            __dirname,
            "./src/assets/a4678e896a5d6646c13a0369c169a0fe09ffc938.png",
          ),
        "figma:asset/9a3ba283e0cffa6e65069e5ae398c641e76c4555.png":
          path.resolve(
            __dirname,
            "./src/assets/9a3ba283e0cffa6e65069e5ae398c641e76c4555.png",
          ),
        "figma:asset/987c1f9103839d971ed2d246441d8cecc825a9b3.png":
          path.resolve(
            __dirname,
            "./src/assets/987c1f9103839d971ed2d246441d8cecc825a9b3.png",
          ),
        "figma:asset/8c8181b5fa780573d23ab882cd935d9f7230d820.png":
          path.resolve(
            __dirname,
            "./src/assets/8c8181b5fa780573d23ab882cd935d9f7230d820.png",
          ),
        "figma:asset/8263b8ecc46b43cbe87ad3ff45d0077a77d71623.png":
          path.resolve(
            __dirname,
            "./src/assets/8263b8ecc46b43cbe87ad3ff45d0077a77d71623.png",
          ),
        "figma:asset/80e26dcd0fd814cd8a0824a739f9deaf460b3cd5.png":
          path.resolve(
            __dirname,
            "./src/assets/80e26dcd0fd814cd8a0824a739f9deaf460b3cd5.png",
          ),
        "figma:asset/7ae773d4ac019d079ebb4e9a283b4e27d197d49b.png":
          path.resolve(
            __dirname,
            "./src/assets/7ae773d4ac019d079ebb4e9a283b4e27d197d49b.png",
          ),
        "figma:asset/5c1c6af1538d3a9cf00f6641e253ea60700c0154.png":
          path.resolve(
            __dirname,
            "./src/assets/5c1c6af1538d3a9cf00f6641e253ea60700c0154.png",
          ),
        "figma:asset/5a2f71026b26359cc76abf5575cf3a3d08a00ffb.png":
          path.resolve(
            __dirname,
            "./src/assets/5a2f71026b26359cc76abf5575cf3a3d08a00ffb.png",
          ),
        "figma:asset/4d7d6f93ae0ee0fa6bc1be1bee5b20dc8da87add.png":
          path.resolve(
            __dirname,
            "./src/assets/4d7d6f93ae0ee0fa6bc1be1bee5b20dc8da87add.png",
          ),
        "embla-carousel-react@8.6.0": "embla-carousel-react",
        "cmdk@1.1.1": "cmdk",
        "class-variance-authority@0.7.1": "class-variance-authority",
        "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
        "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
        "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
        "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
        "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
        "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
        "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
        "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
        "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
        "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
        "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
        "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
        "@radix-ui/react-navigation-menu@1.2.5":
          "@radix-ui/react-navigation-menu",
        "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
        "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
        "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
        "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
        "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
        "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
        "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
        "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
        "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
        "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      outDir: "build",
    },
    server: {
      proxy: {
        "/api": "http://127.0.0.1:8000",
      },
    },
  });