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
define(['./workbox-43d32f61'], (function (workbox) { 'use strict';

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
    "url": "_7062.js/WorkletEnv.worklet.js",
    "revision": "5193d9a0b82f2ec460c742b22274da81"
  }, {
    "url": "_a3cf.js/WorkletEnv.worklet.js",
    "revision": "2b6936f72ae906e5492bd2e0070796f0"
  }, {
    "url": "_ce66.js/WorkletEnv.worklet.js",
    "revision": "db0afe0ba6b337576bb1a8512e5771d5"
  }, {
    "url": "_fd2b.js/WorkletEnv.worklet.js",
    "revision": "82dd699a659c356c9df10ceafedbeeff"
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
    "url": "assets/2de34c4e54918508de9f.js",
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
    "url": "assets/b797181c93b3755f4fa1.ttf",
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
    "revision": "48798648dbf76e8bfadd33b3752339bb"
  }, {
    "url": "deps/ffmpeg-core.wasm",
    "revision": "165223f19100ac949b5bf4f86a833da1"
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
    "revision": "fb0a6711ddbf2d63caf13ced73065283"
  }, {
    "url": "deps/libfaust-wasm.data.d.ts",
    "revision": "efb8590a96d416771ef946b323008668"
  }, {
    "url": "deps/libfaust-wasm.js",
    "revision": "12e73b7731ac00cc3c44ece1dcc20e5f"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "1bdd4de149ebdd9dd1be204d1d101cb3"
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
    "revision": "e58bba91202db3962a930a7b11421b9a"
  }, {
    "url": "js/017d998140f1ad199103.worker.js",
    "revision": null
  }, {
    "url": "js/042d1738d1f2a8b4900d.js",
    "revision": null
  }, {
    "url": "js/11b718dbecf53fe8a951.worker.js",
    "revision": null
  }, {
    "url": "js/14f7a36899db782e01cddddc2ee88d1e.worker.js",
    "revision": "97eb516222a557c1313c615fc51a1d56"
  }, {
    "url": "js/28fd68abd7dec35262fb.worker.js",
    "revision": null
  }, {
    "url": "js/3288589836ea49a59264.js",
    "revision": null
  }, {
    "url": "js/34799dc78b11a16ba5a3.js",
    "revision": null
  }, {
    "url": "js/3bb9c29ea369e2af9d6e.js",
    "revision": null
  }, {
    "url": "js/3d2e0cd02f1062ad7c15.js",
    "revision": null
  }, {
    "url": "js/46e827fd44fe8ed8d2c4.js",
    "revision": null
  }, {
    "url": "js/4a0ce4f89d491560630c.js",
    "revision": null
  }, {
    "url": "js/528aec79268e9e0f0963.js",
    "revision": null
  }, {
    "url": "js/52967a0e448098dcc430.worker.js",
    "revision": null
  }, {
    "url": "js/531dee4f737941dccb25.js",
    "revision": null
  }, {
    "url": "js/6234888e88d62a572ea0.js",
    "revision": null
  }, {
    "url": "js/6353e5e1064ea9ddc33a.js",
    "revision": null
  }, {
    "url": "js/6503d301c5ace73cfe83.worker.js",
    "revision": null
  }, {
    "url": "js/68cf13e81eea4e5e2a33.js",
    "revision": null
  }, {
    "url": "js/6b2296d7726f0841c01f.worker.js",
    "revision": null
  }, {
    "url": "js/81aaf6b31ad18815b1d4d15867555522.worker.js",
    "revision": "e612a48f3c5e98129fd663eba4434dc1"
  }, {
    "url": "js/88ea8fbb0af230fbccf9.js",
    "revision": null
  }, {
    "url": "js/8afa4ab673b197275745ac5e5abcdd39.worker.js",
    "revision": "c1d6d6c5085bc52dcf4456864a1c8d59"
  }, {
    "url": "js/8bcd54f0b591729ef470.worker.js",
    "revision": null
  }, {
    "url": "js/8f6f9172ff10295cd667.js",
    "revision": null
  }, {
    "url": "js/8fa2586bde2598a52f05.worker.js",
    "revision": null
  }, {
    "url": "js/9d9d106fa7c33c72cedf.js",
    "revision": null
  }, {
    "url": "js/9e1522ceb3a0d28b3797.worker.js",
    "revision": null
  }, {
    "url": "js/Patcher.worklet.js",
    "revision": "d0a578704885d51e30fe9cc6ba19b3b1"
  }, {
    "url": "js/SpectralAnalyser.worklet.js",
    "revision": "b656c01770cb236719da49cfbaf59149"
  }, {
    "url": "js/TemporalAnalyser.worklet.js",
    "revision": "37739870c11b1e2215feba6277c5ad10"
  }, {
    "url": "js/Transmitter.worklet.js",
    "revision": "9f85701797e7a29fd7172e3b17384b5f"
  }, {
    "url": "js/WorkletEnv.worklet.js",
    "revision": "0ca7e72be2f43d9a4e205bec02eb9326"
  }, {
    "url": "js/a6b6f78b420b1f4bd98d.worker.js",
    "revision": null
  }, {
    "url": "js/a85ce25ec6767b7d9d2d3d88291dd6eb.worker.js",
    "revision": "dbe2b57bf2caefc7c2f3e956013900f6"
  }, {
    "url": "js/b481f420e442bb340d72.js",
    "revision": null
  }, {
    "url": "js/b8a36dae358d651e06d0.js",
    "revision": null
  }, {
    "url": "js/bc92b42113beb4749365.js",
    "revision": null
  }, {
    "url": "js/cce87706271257f7ff34.js",
    "revision": null
  }, {
    "url": "js/cecfbb715664b68e1396.js",
    "revision": null
  }, {
    "url": "js/d3841c07bfb3177ac6db.js",
    "revision": null
  }, {
    "url": "js/d928a6176edfbd1e6d7f.js",
    "revision": null
  }, {
    "url": "js/da08cf5323ff237518cf.js",
    "revision": null
  }, {
    "url": "js/e0813aac6a6c6e49c1c6.js",
    "revision": null
  }, {
    "url": "js/e9af213515a48055d0d9.js",
    "revision": null
  }, {
    "url": "js/f0ffc0bc5f23c4dccc06.js",
    "revision": null
  }, {
    "url": "js/f11b53023ba052b399c9.js",
    "revision": null
  }, {
    "url": "js/fd93e30ede5ae60bb24e.js",
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
    "revision": "3d6978017ac5fb8acb01456e34cd3d84"
  }, {
    "url": "packages/jitsi/index.js",
    "revision": "508576b4495cf91d456607d04da70688"
  }, {
    "url": "packages/jitsi/index.jspatpkg.js",
    "revision": "8af440cc9c3cf7924970a4ea1fe4801d"
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
    "revision": "5c03c2877946544a766d996629f5d2c5"
  }, {
    "url": "packages/ui/index.jspatpkg.js",
    "revision": "fac4a32a7e5323edf1bc7b433cde80ab"
  }, {
    "url": "packages/webaudio/index.js",
    "revision": "d09ab0b6eaf7e9027de37aa17bbc4108"
  }, {
    "url": "packages/webaudio/index.jspatpkg.js",
    "revision": "01193be29c15ac36f796f5af9c3f8485"
  }, {
    "url": "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts.js/WorkletEnv.worklet.js",
    "revision": "fbfbb9c7391d5950557d2f6ed374ec35"
  }, {
    "url": "src_core_image_ImageEditor_ts.js/WorkletEnv.worklet.js",
    "revision": "a7aabf3a526cd37a0d9f3e4c28418b57"
  }, {
    "url": "src_core_image_PatcherImage_ts.js/WorkletEnv.worklet.js",
    "revision": "1aa7e6029954a2dbdcd21862c8b21c12"
  }, {
    "url": "src_core_text_PatcherText_ts.js/WorkletEnv.worklet.js",
    "revision": "c5fecf183290083b3e74b8999d58cb34"
  }, {
    "url": "src_core_text_TextEditor_ts.js/WorkletEnv.worklet.js",
    "revision": "446bc8dcc8617e19e9c94dbd3d288541"
  }, {
    "url": "src_core_video_PatcherVideo_ts.js/WorkletEnv.worklet.js",
    "revision": "93c8297857e4675e7cd6078d06a5859f"
  }, {
    "url": "src_core_video_VideoEditor_ts.js/WorkletEnv.worklet.js",
    "revision": "f18e5b2600d10f2ebd9abc1e0c99a940"
  }, {
    "url": "src_core_worklets_PatcherNode_ts.js/WorkletEnv.worklet.js",
    "revision": "b719cdbcb86bb42dd8fd64f5a451d4fb"
  }, {
    "url": "version.json",
    "revision": "4f14cc99dc791d7c8c936c809eff3f72"
  }], {});
  workbox.cleanupOutdatedCaches();

}));
//# sourceMappingURL=service-worker.js.map
