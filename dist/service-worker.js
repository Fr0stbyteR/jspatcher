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
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./service-worker.js",['./workbox-3d645aa3'], function (workbox) { 'use strict';

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
    prefix: "0.0.3.1629378858557"
  });
  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
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
    "url": "assets/68664da4962ed33db33e.ttf",
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
    "url": "deps/libfaust-wasm.data",
    "revision": "836e793b78757b60af64d91c5ee82c9a"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "3c35020c41314aa9bf9742f7550de5f7"
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
    "revision": "02193ad4d3be9b05992d05c2677ac026"
  }, {
    "url": "js/006e4183aec04d6b291c.worker.js",
    "revision": null
  }, {
    "url": "js/0357f57e115b5abb657b.worker.js",
    "revision": null
  }, {
    "url": "js/050af9cf174d44917415.js",
    "revision": null
  }, {
    "url": "js/0c3018b73d160e6c6afa.js",
    "revision": null
  }, {
    "url": "js/0f231b66ecd63691cefa.js",
    "revision": null
  }, {
    "url": "js/13e028bed85e025adaf6.js",
    "revision": null
  }, {
    "url": "js/1fa98b65059d4f73de9c.worker.js",
    "revision": null
  }, {
    "url": "js/2da973d99ed3f3263f1b.worklet.js",
    "revision": null
  }, {
    "url": "js/35ddcd64328b4a626501.js",
    "revision": null
  }, {
    "url": "js/3b38340aa3dca6efa0c6.js",
    "revision": null
  }, {
    "url": "js/3fcc4438c29811f44ac3.js",
    "revision": null
  }, {
    "url": "js/42c226ba879c96932fa0.js",
    "revision": null
  }, {
    "url": "js/455af92e7e1dc39fdbc8060f6680ab32.worker.js",
    "revision": "8c96644c873a4fec0ef7a30bea08671e"
  }, {
    "url": "js/520afea1add719af61b2.js",
    "revision": null
  }, {
    "url": "js/5925dbdaf131c02af594.worker.js",
    "revision": null
  }, {
    "url": "js/6b1ed1bedd96f08944b0e5a8b12c4739.worker.js",
    "revision": "73c8bdb14346f1b6d5668c26ec4dd1bb"
  }, {
    "url": "js/70ff708d07dec14b44c1.js",
    "revision": null
  }, {
    "url": "js/7ae8201faea4de318b7a.worklet.js",
    "revision": null
  }, {
    "url": "js/7b7c146764e4b3a77746.js",
    "revision": null
  }, {
    "url": "js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "js/81d0db20b0d487c9f6fc.worker.js",
    "revision": null
  }, {
    "url": "js/84dbda608f4a836c8ff3.js",
    "revision": null
  }, {
    "url": "js/a7acfcca6fb672f16df9.js",
    "revision": null
  }, {
    "url": "js/ad9e7c97d7b6324e8f0e.js",
    "revision": null
  }, {
    "url": "js/af13b36e21b5d6d8eeaa.js",
    "revision": null
  }, {
    "url": "js/b862f93c77ff2d6bfe33.worklet.js",
    "revision": null
  }, {
    "url": "js/cee72465ea474f1cd843.worker.js",
    "revision": null
  }, {
    "url": "js/d63c826e229c90273981bd45f77732ad.worker.js",
    "revision": "6ed5d287357e41f6c3c6e55d45215ef3"
  }, {
    "url": "js/ea41a0a95e25fbd11756.js",
    "revision": null
  }, {
    "url": "js/ed59606c427fb184edcb.js",
    "revision": null
  }, {
    "url": "js/f00f0a59e2855fa8eda5.worker.js",
    "revision": null
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }, {
    "url": "packages/op/index.js",
    "revision": "a3382b70a1ee9ebbd8fc2e8dccc5f5ee"
  }, {
    "url": "packages/op/index.jsdsppkg.aw.js",
    "revision": "9573c666bfe9b394a39f4fbfcd0599c0"
  }, {
    "url": "packages/op/index.jsdsppkg.main.js",
    "revision": "5a383cb0cd0ea53bd6db4ad5874ac71c"
  }, {
    "url": "packages/op/index.jspatpkg.js",
    "revision": "49fd8b56cd59b41b5d7853fe3cc8bb51"
  }, {
    "url": "packages/std/index.js",
    "revision": "a286adc1f16707c07fcce44765f8428c"
  }, {
    "url": "packages/std/index.jsdsppkg.aw.js",
    "revision": "5dbf513ba77875d135b9454d22c2f620"
  }, {
    "url": "packages/std/index.jsdsppkg.main.js",
    "revision": "3184fabc6c216ea18915261a8fcc65b9"
  }, {
    "url": "packages/std/index.jspatpkg.js",
    "revision": "d042a457b0a2b6de959ea8397cbba56c"
  }, {
    "url": "packages/webaudio/index.js",
    "revision": "3526c48be6c6d64efe2c6c000bee3db4"
  }, {
    "url": "packages/webaudio/index.jspatpkg.js",
    "revision": "21fdd0cf99fae8fae0aa7d4e285fadef"
  }, {
    "url": "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_ImageEditor_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_PatcherImage_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_PatcherText_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_TextEditor_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }, {
    "url": "src_core_worklets_PatcherNode_ts.js/7e971f7eda4062696834.worklet.js",
    "revision": null
  }], {});
  workbox.cleanupOutdatedCaches();

});
//# sourceMappingURL=service-worker.js.map
