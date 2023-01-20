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
define(['./workbox-f76b7dd5'], (function (workbox) { 'use strict';

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
    "url": "_7062.js/1644599fbe595bf3f0a8.worklet.js",
    "revision": null
  }, {
    "url": "_7062.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "_af15.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "_dc1c.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "_fd2b.js/1644599fbe595bf3f0a8.worklet.js",
    "revision": null
  }, {
    "url": "_fd2b.js/16e5ef45fc47d2b4b4fe.worklet.js",
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
    "revision": "cef35c37b0dcdb9408f85f29aeb40d49"
  }, {
    "url": "deps/libfaust-wasm.d.ts",
    "revision": "cef35c37b0dcdb9408f85f29aeb40d49"
  }, {
    "url": "deps/libfaust-wasm.data",
    "revision": "f1126e184dcb3ae9883fabe9706cf23d"
  }, {
    "url": "deps/libfaust-wasm.data.d.ts",
    "revision": "efb8590a96d416771ef946b323008668"
  }, {
    "url": "deps/libfaust-wasm.js",
    "revision": "263d4f7f04cad7f94352997bd4f7ae6d"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "8a8701619074e0513fa1489a0ee4b8f6"
  }, {
    "url": "deps/libfaust-wasm.wasm.d.ts",
    "revision": "efb8590a96d416771ef946b323008668"
  }, {
    "url": "deps/libmusicxml.wasm",
    "revision": "24f31c7255007b345545a69a7d2adf82"
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
    "revision": "f2450370dc035ed5575ac9d80385a520"
  }, {
    "url": "js/017d998140f1ad199103.worker.js",
    "revision": null
  }, {
    "url": "js/11fcb9bf014a499ad4aa.js",
    "revision": null
  }, {
    "url": "js/1644599fbe595bf3f0a8.worklet.js",
    "revision": null
  }, {
    "url": "js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "js/1cfe1b6a9f45aed77abe.worklet.js",
    "revision": null
  }, {
    "url": "js/1f369371c6017e16477f.js",
    "revision": null
  }, {
    "url": "js/20a9ac1476c4046ca623.worker.js",
    "revision": null
  }, {
    "url": "js/234ac2162745aae96787.js",
    "revision": null
  }, {
    "url": "js/265dcba2f1ffa980e0cf.worker.js",
    "revision": null
  }, {
    "url": "js/2d0b0230cd82accd273b.worklet.js",
    "revision": null
  }, {
    "url": "js/2d5069b2681db1b4acf5.js",
    "revision": null
  }, {
    "url": "js/2e0391304b68c9279541.js",
    "revision": null
  }, {
    "url": "js/3d66d3399e31e10f1c80.js",
    "revision": null
  }, {
    "url": "js/414b9770b3b621e76edf.js",
    "revision": null
  }, {
    "url": "js/455af92e7e1dc39fdbc8060f6680ab32.worker.js",
    "revision": "aa4ccaed553f2300b7568f570811fa30"
  }, {
    "url": "js/524ec5fc982d3d4e327e.js",
    "revision": null
  }, {
    "url": "js/528aec79268e9e0f0963.js",
    "revision": null
  }, {
    "url": "js/5da8e4d396a96c22d406.js",
    "revision": null
  }, {
    "url": "js/692f81aa5bbfa47d5dbd.js",
    "revision": null
  }, {
    "url": "js/6b1ed1bedd96f08944b0e5a8b12c4739.worker.js",
    "revision": "f254cb0386f773899b80cbde500893dd"
  }, {
    "url": "js/6b2296d7726f0841c01f.worker.js",
    "revision": null
  }, {
    "url": "js/733c9ab9b4b3654f4872.js",
    "revision": null
  }, {
    "url": "js/7a7bb4fea8ae344974ca.js",
    "revision": null
  }, {
    "url": "js/878bebf3967460a8ab39.worklet.js",
    "revision": null
  }, {
    "url": "js/8a4347fec65c1c07c549.js",
    "revision": null
  }, {
    "url": "js/8fa2586bde2598a52f05.worker.js",
    "revision": null
  }, {
    "url": "js/949204d4095be2321020.worklet.js",
    "revision": null
  }, {
    "url": "js/97b78266f3a7d31a9167.worker.js",
    "revision": null
  }, {
    "url": "js/9886dc26a5fc81de36e6.js",
    "revision": null
  }, {
    "url": "js/9e1522ceb3a0d28b3797.worker.js",
    "revision": null
  }, {
    "url": "js/a96e3a2182789d074698.js",
    "revision": null
  }, {
    "url": "js/a98981e7e7ba44414f86.js",
    "revision": null
  }, {
    "url": "js/b48e24c12d2496127b6583b54fc55dfe.worker.js",
    "revision": "571c28e65dd89c5b51759b9df96bc49a"
  }, {
    "url": "js/bc92b42113beb4749365.js",
    "revision": null
  }, {
    "url": "js/ccc617a85eb7411370f7.worker.js",
    "revision": null
  }, {
    "url": "js/d00be89a3eb942472ad7.js",
    "revision": null
  }, {
    "url": "js/d5652357bfdb09cbde7b.worker.js",
    "revision": null
  }, {
    "url": "js/da31a2ebc72b1ed753f7.worker.js",
    "revision": null
  }, {
    "url": "js/da9b5ead4848cc2777299f9d18504d8c.worker.js",
    "revision": "a03aaeeddaf51013cb05b33b947bed38"
  }, {
    "url": "js/db71fa29726e0d23374a.js",
    "revision": null
  }, {
    "url": "js/de44efc5dfdf33808316.js",
    "revision": null
  }, {
    "url": "js/e8b3fdfc7e8b62c1c960.js",
    "revision": null
  }, {
    "url": "js/e8dde20892ba30bc5db1.js",
    "revision": null
  }, {
    "url": "js/e9af213515a48055d0d9.js",
    "revision": null
  }, {
    "url": "js/eaf685b3c0a73438cd37.js",
    "revision": null
  }, {
    "url": "js/ef3dd787a594e188d1cc.js",
    "revision": null
  }, {
    "url": "js/f537a9f9fb49fac4be24.js",
    "revision": null
  }, {
    "url": "js/f972dd09676511318f5e.js",
    "revision": null
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }, {
    "url": "packages/analysers/index.js",
    "revision": "6fcc0de1154895861008927dd1d1e209"
  }, {
    "url": "packages/analysers/index.jspatpkg.js",
    "revision": "3203bcaee457508c93a30a52cab322f4"
  }, {
    "url": "packages/cac/index.js",
    "revision": "7ec52ba9573ad70301d290898ece61c1"
  }, {
    "url": "packages/cac/index.jspatpkg.js",
    "revision": "9f3f895ba1dab5a482e5ccb150c0a6e4"
  }, {
    "url": "packages/dsp/index.js",
    "revision": "7c39aec8b6a21c8ed37f5e0fe65ea10a"
  }, {
    "url": "packages/dsp/index.jspatpkg.js",
    "revision": "100c75105dd7cf252719df32109dfc2d"
  }, {
    "url": "packages/internal-packages.json",
    "revision": "9e8a27886c1337ab8451b486782171b0"
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
    "url": "packages/osc/index.js",
    "revision": "ba4e20207eaef2d9fadc788bcf6ac7a1"
  }, {
    "url": "packages/osc/index.jspatpkg.js",
    "revision": "955296225397a3c8b8625ab33db6da32"
  }, {
    "url": "packages/std/index.js",
    "revision": "4a6a9bebb4e18578535820250f356961"
  }, {
    "url": "packages/std/index.jsdsppkg.aw.js",
    "revision": "ac1e9a4b8c11141daf190f42a9cd6345"
  }, {
    "url": "packages/std/index.jsdsppkg.main.js",
    "revision": "7b54ee32013949301f452a248eaa763a"
  }, {
    "url": "packages/std/index.jspatpkg.js",
    "revision": "8b2563a360c25b2f93e136dd2a8e0c72"
  }, {
    "url": "packages/ui/index.js",
    "revision": "3be3214dae806ef054b35014344b6f7e"
  }, {
    "url": "packages/ui/index.jspatpkg.js",
    "revision": "8e31a703db86f6e764f7a5d5cdf78098"
  }, {
    "url": "packages/webaudio/index.js",
    "revision": "d09ab0b6eaf7e9027de37aa17bbc4108"
  }, {
    "url": "packages/webaudio/index.jspatpkg.js",
    "revision": "01193be29c15ac36f796f5af9c3f8485"
  }, {
    "url": "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_ImageEditor_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_PatcherImage_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_PatcherText_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_TextEditor_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_PatcherVideo_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_VideoEditor_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }, {
    "url": "src_core_worklets_PatcherNode_ts.js/16e5ef45fc47d2b4b4fe.worklet.js",
    "revision": null
  }], {});
  workbox.cleanupOutdatedCaches();

}));
//# sourceMappingURL=service-worker.js.map
