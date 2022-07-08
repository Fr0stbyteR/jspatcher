/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-f313b8eb'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  workbox.setCacheNameDetails({
    prefix: "JSPatcher"
  });
  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "_7062.js/8f9e10b0da5130be7227.worklet.js",
    "revision": null
  }, {
    "url": "_fd2b.js/8f9e10b0da5130be7227.worklet.js",
    "revision": null
  }, {
    "url": "assets/00aa018e3ae78d50160b.ttf",
    "revision": null
  }, {
    "url": "assets/08eb0932dc2145b3f6b2.woff",
    "revision": null
  }, {
    "url": "assets/0d0882bc6997a213dace.woff",
    "revision": null
  }, {
    "url": "assets/1d2ca94dfba6f8d87cfd.woff",
    "revision": null
  }, {
    "url": "assets/1fd1d41f8c400da7af75.woff",
    "revision": null
  }, {
    "url": "assets/21b3848a32fce5b0f501.woff2",
    "revision": null
  }, {
    "url": "assets/278156e41e0ad908cf7f.woff2",
    "revision": null
  }, {
    "url": "assets/34b49f334f41cea8e365.woff2",
    "revision": null
  }, {
    "url": "assets/353a3bb93ba34c9b0476.woff2",
    "revision": null
  }, {
    "url": "assets/38c6d8bab26db77d8c80.woff2",
    "revision": null
  }, {
    "url": "assets/3e22a5367c2e68d6e4ba.woff2",
    "revision": null
  }, {
    "url": "assets/3e6b99809852a8290c42.woff",
    "revision": null
  }, {
    "url": "assets/3fdee263fe69b843601f.woff",
    "revision": null
  }, {
    "url": "assets/425399f81e4ce7cbd967.woff",
    "revision": null
  }, {
    "url": "assets/46957bf0a71db5883313.woff2",
    "revision": null
  }, {
    "url": "assets/5367103510b27b784827.ttf",
    "revision": null
  }, {
    "url": "assets/546b4809e90728a64a4f.woff",
    "revision": null
  }, {
    "url": "assets/598d09137818c7135a24.woff",
    "revision": null
  }, {
    "url": "assets/5b824a726edcf6642539.woff",
    "revision": null
  }, {
    "url": "assets/62a9c838c99d073c7ba6.woff",
    "revision": null
  }, {
    "url": "assets/62d9dae4e0040e81c980.svg",
    "revision": null
  }, {
    "url": "assets/65a2fb6d9aaa164b41a0.ttf",
    "revision": null
  }, {
    "url": "assets/6729d29753e000c17489.svg",
    "revision": null
  }, {
    "url": "assets/687a4990ea22bb1a49d4.woff2",
    "revision": null
  }, {
    "url": "assets/6ae7abff1b20614e4a70.woff2",
    "revision": null
  }, {
    "url": "assets/6cfa65c63939188f33ef.woff",
    "revision": null
  }, {
    "url": "assets/6d20cff5b3255dd0078f.woff2",
    "revision": null
  }, {
    "url": "assets/73d2c04510d153b6da52.woff2",
    "revision": null
  }, {
    "url": "assets/752905fa5edf21fc52a1.eot",
    "revision": null
  }, {
    "url": "assets/75614cfcfedd509b1f7a.woff2",
    "revision": null
  }, {
    "url": "assets/75f024ce11d1fb961e8c.woff2",
    "revision": null
  }, {
    "url": "assets/7d1b926dcecd9fd7425e.woff",
    "revision": null
  }, {
    "url": "assets/848f3a6e80058194c450.woff",
    "revision": null
  }, {
    "url": "assets/863985d67436f8342e2d.woff2",
    "revision": null
  }, {
    "url": "assets/89b618086a797a8be0f4.woff",
    "revision": null
  }, {
    "url": "assets/8ea310a0c29539324b47.woff",
    "revision": null
  }, {
    "url": "assets/99f63ae7a743f21ab308.png",
    "revision": null
  }, {
    "url": "assets/9ba7233345056c919454.woff",
    "revision": null
  }, {
    "url": "assets/9c4845b4b41ef40a22fa.svg",
    "revision": null
  }, {
    "url": "assets/a01e3f2d6c83dc3aee17.eot",
    "revision": null
  }, {
    "url": "assets/a071abba7e9bd90947f7.woff2",
    "revision": null
  }, {
    "url": "assets/a6069540692725c247f1.woff2",
    "revision": null
  }, {
    "url": "assets/b9c017a718cdeb8538b8.woff2",
    "revision": null
  }, {
    "url": "assets/bb5de40edffdbd3ab519.woff2",
    "revision": null
  }, {
    "url": "assets/c656b8caa454ed19b9a2.ttf",
    "revision": null
  }, {
    "url": "assets/c66465590541129e82d3.woff",
    "revision": null
  }, {
    "url": "assets/cac87dc00c87a5d74711.woff",
    "revision": null
  }, {
    "url": "assets/d68fa3e67dbb653a13ce.eot",
    "revision": null
  }, {
    "url": "assets/dcb1947bf381a2824c71.woff2",
    "revision": null
  }, {
    "url": "assets/ddae9b1ba9b0b42f5880.woff",
    "revision": null
  }, {
    "url": "assets/ddf3ba7c143ea711126c.woff2",
    "revision": null
  }, {
    "url": "assets/e014213d2c1456d5f1af.woff",
    "revision": null
  }, {
    "url": "assets/e244488c8cc2f5337153.woff2",
    "revision": null
  }, {
    "url": "assets/e48918f9c91871c0ce3e.woff2",
    "revision": null
  }, {
    "url": "assets/ed49088eb627c1c0155d.woff",
    "revision": null
  }, {
    "url": "deps/ffmpeg-core.js",
    "revision": "81faf2a5276ce04cb470928d42b3273c"
  }, {
    "url": "deps/ffmpeg-core.wasm",
    "revision": "0af60f6122e7ed986f424c66381fb321"
  }, {
    "url": "deps/ffmpeg-core.worker.js",
    "revision": "71a5f91e424e40dd1861849eb5471b19"
  }, {
    "url": "deps/gen2faust.lib",
    "revision": "6024187832c1ad7af33a5103e57bcfc8"
  }, {
    "url": "deps/libGUIDOEngine.wasm",
    "revision": "42914c6132a30517e800b4e840079cb6"
  }, {
    "url": "deps/libfaust-wasm.d.cts",
    "revision": "03618e323bfe4f59d21bbeb9ed0a7070"
  }, {
    "url": "deps/libfaust-wasm.d.ts",
    "revision": "03618e323bfe4f59d21bbeb9ed0a7070"
  }, {
    "url": "deps/libfaust-wasm.data",
    "revision": "31cc63b38067985d6f724b7fe3f1664b"
  }, {
    "url": "deps/libfaust-wasm.data.d.ts",
    "revision": "efb8590a96d416771ef946b323008668"
  }, {
    "url": "deps/libfaust-wasm.js",
    "revision": "2e12de73fd5b29de368d13d4832b9eb1"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "14fcca6642d30dd07726f784e39503e9"
  }, {
    "url": "deps/libfaust-wasm.wasm.d.ts",
    "revision": "efb8590a96d416771ef946b323008668"
  }, {
    "url": "deps/libmusicxml.wasm",
    "revision": "f2855aa8cdc4f78211ffa8273dd3025e"
  }, {
    "url": "deps/primitives.lib",
    "revision": "27152c0ce5169d607ce0667196b1b858"
  }, {
    "url": "favicon.png",
    "revision": "04e837afc63d41dbe05e1d30d1b9cf13"
  }, {
    "url": "icon/icon_192.png",
    "revision": "a6ff457ac7ccf688d6a02d2c3b68b4b7"
  }, {
    "url": "icon/icon_512.png",
    "revision": "40eb5c38e88a44fc7415b3a5e3e0ce0b"
  }, {
    "url": "index.html",
    "revision": "987cc16509739c52074516f060857dd0"
  }, {
    "url": "index.js",
    "revision": "5110ac5c7237f65a11557e0a87dbc3a1"
  }, {
    "url": "js/017d998140f1ad199103.worker.js",
    "revision": null
  }, {
    "url": "js/024c16a3edf18aee81fe.js",
    "revision": null
  }, {
    "url": "js/071091a41ad3a183f5ff.js",
    "revision": null
  }, {
    "url": "js/07e33866699bf5fd4a65.js",
    "revision": null
  }, {
    "url": "js/0a763945e9f4eb8d5543.js",
    "revision": null
  }, {
    "url": "js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "js/1b130d9deb0c69ced1ab.worklet.js",
    "revision": null
  }, {
    "url": "js/1c50b3e8b002743ad72c.worker.js",
    "revision": null
  }, {
    "url": "js/1cd3c2ad419a2e650c84.js",
    "revision": null
  }, {
    "url": "js/1e220086e4c1bf15fdb2.js",
    "revision": null
  }, {
    "url": "js/1f369371c6017e16477f.js",
    "revision": null
  }, {
    "url": "js/2d5069b2681db1b4acf5.js",
    "revision": null
  }, {
    "url": "js/2e0391304b68c9279541.js",
    "revision": null
  }, {
    "url": "js/3fb4f39a3f1a3938103d.js",
    "revision": null
  }, {
    "url": "js/414b9770b3b621e76edf.js",
    "revision": null
  }, {
    "url": "js/455af92e7e1dc39fdbc8060f6680ab32.worker.js",
    "revision": "6c96cb396f6c37b118e729c9b96fd18d"
  }, {
    "url": "js/4b51cda933a2d7a9c4b7.js",
    "revision": null
  }, {
    "url": "js/692f81aa5bbfa47d5dbd.js",
    "revision": null
  }, {
    "url": "js/6b1ed1bedd96f08944b0e5a8b12c4739.worker.js",
    "revision": "3cafc222030e049a264341e3d78032dc"
  }, {
    "url": "js/6e2139066a4dc501281b.js",
    "revision": null
  }, {
    "url": "js/7a7bb4fea8ae344974ca.js",
    "revision": null
  }, {
    "url": "js/7e8729ab303b77eab8d8.js",
    "revision": null
  }, {
    "url": "js/8f9e10b0da5130be7227.worklet.js",
    "revision": null
  }, {
    "url": "js/8fa2586bde2598a52f05.worker.js",
    "revision": null
  }, {
    "url": "js/935cbd49681dce055a65.worker.js",
    "revision": null
  }, {
    "url": "js/9fafbd929f0362cda40f.worker.js",
    "revision": null
  }, {
    "url": "js/a24e7b40b5bb9c187984.worker.js",
    "revision": null
  }, {
    "url": "js/a6e665684664be253825.worklet.js",
    "revision": null
  }, {
    "url": "js/a96e3a2182789d074698.js",
    "revision": null
  }, {
    "url": "js/b48e24c12d2496127b6583b54fc55dfe.worker.js",
    "revision": "f2ef4a2f6a378fed0bf7bcfd3c1976e5"
  }, {
    "url": "js/b725de21f83e0738bf73.js",
    "revision": null
  }, {
    "url": "js/c278d97b461ecb5deea9.worker.js",
    "revision": null
  }, {
    "url": "js/c3660f0216a7135ebc0e.js",
    "revision": null
  }, {
    "url": "js/da9b5ead4848cc2777299f9d18504d8c.worker.js",
    "revision": "c7dc4aca24aa192b4e10bd83dc1aa303"
  }, {
    "url": "js/de44efc5dfdf33808316.js",
    "revision": null
  }, {
    "url": "js/e05b5ec401b9493def27.worker.js",
    "revision": null
  }, {
    "url": "js/e420ff6929ac4dee4f98.worker.js",
    "revision": null
  }, {
    "url": "js/e669d9f16f8595e2df80.worklet.js",
    "revision": null
  }, {
    "url": "js/eaf685b3c0a73438cd37.js",
    "revision": null
  }, {
    "url": "js/ed9d26e0c15fbfe1f527.js",
    "revision": null
  }, {
    "url": "js/f110948908d77213fe99.js",
    "revision": null
  }, {
    "url": "js/f537a9f9fb49fac4be24.js",
    "revision": null
  }, {
    "url": "js/f972dd09676511318f5e.js",
    "revision": null
  }, {
    "url": "js/faa60f4cac914477448f.worker.js",
    "revision": null
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }, {
    "url": "packages/analysers/index.js",
    "revision": "1ebf2dc29ad8a002cfb2dd3dad1a9df8"
  }, {
    "url": "packages/analysers/index.jspatpkg.js",
    "revision": "a07d822052f82b81bf48230fbb81e078"
  }, {
    "url": "packages/cac/index.js",
    "revision": "305cb6372f8c9ffe4c51d6844ff167c1"
  }, {
    "url": "packages/cac/index.jspatpkg.js",
    "revision": "fe9e7c00a6068eabc2455292b6008b33"
  }, {
    "url": "packages/dsp/index.js",
    "revision": "7c39aec8b6a21c8ed37f5e0fe65ea10a"
  }, {
    "url": "packages/dsp/index.jspatpkg.js",
    "revision": "100c75105dd7cf252719df32109dfc2d"
  }, {
    "url": "packages/internal-packages.json",
    "revision": "95e8ad0b02143d69cb4c2fa71d8d14c9"
  }, {
    "url": "packages/live/index.js",
    "revision": "fa6a6a09918e16781ac25b3ea025b4e5"
  }, {
    "url": "packages/live/index.jspatpkg.js",
    "revision": "2d68d14a5dd2a5cc271d883f1119c08e"
  }, {
    "url": "packages/midi/index.js",
    "revision": "83bdb9f4d9c6ee2bb77d3a226d556c38"
  }, {
    "url": "packages/midi/index.jspatpkg.js",
    "revision": "78709633a9313f4c3aa3bfe58fc65aa1"
  }, {
    "url": "packages/op/index.js",
    "revision": "549601486a7aef08ad83b657b6cdc2aa"
  }, {
    "url": "packages/op/index.jsdsppkg.aw.js",
    "revision": "c670096c1a7f9c3bd31673cb0da82dd4"
  }, {
    "url": "packages/op/index.jsdsppkg.main.js",
    "revision": "014457e0532b9ff74c951acc6394d04b"
  }, {
    "url": "packages/op/index.jspatpkg.js",
    "revision": "d0a0f222e40668ef030524bbc5472bea"
  }, {
    "url": "packages/std/index.js",
    "revision": "30a0b4840c53ae78f87ef98780828834"
  }, {
    "url": "packages/std/index.jsdsppkg.aw.js",
    "revision": "b0b32148c445dcb57af8b8575817df1c"
  }, {
    "url": "packages/std/index.jsdsppkg.main.js",
    "revision": "a7685e7e71c00099f3f64c2f8d664acf"
  }, {
    "url": "packages/std/index.jspatpkg.js",
    "revision": "3919e1ab410440ada301d5aeab66902d"
  }, {
    "url": "packages/ui/index.js",
    "revision": "01d1aa6004f25aa4cb1257a3f0e94574"
  }, {
    "url": "packages/ui/index.jspatpkg.js",
    "revision": "1d97210d6ecff683896ae319ddeefbfa"
  }, {
    "url": "packages/webaudio/index.js",
    "revision": "d09ab0b6eaf7e9027de37aa17bbc4108"
  }, {
    "url": "packages/webaudio/index.jspatpkg.js",
    "revision": "01193be29c15ac36f796f5af9c3f8485"
  }, {
    "url": "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_ImageEditor_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_PatcherImage_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_PatcherText_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_TextEditor_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_PatcherVideo_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_VideoEditor_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }, {
    "url": "src_core_worklets_PatcherNode_ts.js/0aa8a692bd71da49dd36.worklet.js",
    "revision": null
  }], {});
  workbox.cleanupOutdatedCaches();

}));
//# sourceMappingURL=service-worker.js.map
