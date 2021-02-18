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
define("./service-worker.js",['./workbox-6915de6f'], function (workbox) { 'use strict';

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
    prefix: "0.0.2.1613651953341"
  });
  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/08eb0932dc2145b3f6b23d1eeb9e22f4.woff",
    "revision": null
  }, {
    "url": "assets/0d0882bc6997a213dace5d0bbe174036.woff",
    "revision": null
  }, {
    "url": "assets/1d2ca94dfba6f8d87cfda33b32f0febc.woff",
    "revision": null
  }, {
    "url": "assets/1fd1d41f8c400da7af75c5c1821fd164.woff",
    "revision": null
  }, {
    "url": "assets/21b3848a32fce5b0f5014948186f6964.woff2",
    "revision": null
  }, {
    "url": "assets/278156e41e0ad908cf7f841b17130502.woff2",
    "revision": null
  }, {
    "url": "assets/34b49f334f41cea8e3655802530d4c67.woff2",
    "revision": null
  }, {
    "url": "assets/353a3bb93ba34c9b047610960d97fbb4.woff2",
    "revision": null
  }, {
    "url": "assets/38c6d8bab26db77d8c806813e1497763.woff2",
    "revision": null
  }, {
    "url": "assets/3e22a5367c2e68d6e4ba56d2a827141e.woff2",
    "revision": null
  }, {
    "url": "assets/3e6b99809852a8290c42c97dc1b66efb.woff",
    "revision": null
  }, {
    "url": "assets/3fdee263fe69b843601fc2a6eb5baf24.woff",
    "revision": null
  }, {
    "url": "assets/425399f81e4ce7cbd967685402ba0260.woff",
    "revision": null
  }, {
    "url": "assets/46957bf0a71db58833138e00cb6f4eb8.woff2",
    "revision": null
  }, {
    "url": "assets/5367103510b27b78482794590e1ce3b0.ttf",
    "revision": null
  }, {
    "url": "assets/546b4809e90728a64a4f91e399a1e6f4.woff",
    "revision": null
  }, {
    "url": "assets/598d09137818c7135a2483a669590a65.woff",
    "revision": null
  }, {
    "url": "assets/5b824a726edcf6642539e81a3534f3ad.woff",
    "revision": null
  }, {
    "url": "assets/62a9c838c99d073c7ba6ac08698de9a1.woff",
    "revision": null
  }, {
    "url": "assets/62d9dae4e0040e81c980950003df0e07.svg",
    "revision": null
  }, {
    "url": "assets/65a2fb6d9aaa164b41a039302093995b.ttf",
    "revision": null
  }, {
    "url": "assets/6729d29753e000c17489ed43135ba8d5.svg",
    "revision": null
  }, {
    "url": "assets/687a4990ea22bb1a49d469a5d9319790.woff2",
    "revision": null
  }, {
    "url": "assets/6ae7abff1b20614e4a70a75f8f64a8e8.woff2",
    "revision": null
  }, {
    "url": "assets/6cfa65c63939188f33ef0e3a68d09306.woff",
    "revision": null
  }, {
    "url": "assets/6d20cff5b3255dd0078f935c34e2b882.woff2",
    "revision": null
  }, {
    "url": "assets/73d2c04510d153b6da5291b538422faf.woff2",
    "revision": null
  }, {
    "url": "assets/752905fa5edf21fc52a10a0c1ca9c7a4.eot",
    "revision": null
  }, {
    "url": "assets/75614cfcfedd509b1f7ac1c26c53bb7f.woff2",
    "revision": null
  }, {
    "url": "assets/75f024ce11d1fb961e8c4602e54a17a6.woff2",
    "revision": null
  }, {
    "url": "assets/7d1b926dcecd9fd7425ea7a81a737391.woff",
    "revision": null
  }, {
    "url": "assets/848f3a6e80058194c450d0bc7e93080f.woff",
    "revision": null
  }, {
    "url": "assets/863985d67436f8342e2d913563648040.woff2",
    "revision": null
  }, {
    "url": "assets/89b618086a797a8be0f4549489bb2993.woff",
    "revision": null
  }, {
    "url": "assets/8ea310a0c29539324b47b89d3d371ff0.woff",
    "revision": null
  }, {
    "url": "assets/99f63ae7a743f21ab30847ed06a698d9.png",
    "revision": null
  }, {
    "url": "assets/9ba7233345056c919454146973e10ee2.woff",
    "revision": null
  }, {
    "url": "assets/9c4845b4b41ef40a22faee76144fa816.svg",
    "revision": null
  }, {
    "url": "assets/a01e3f2d6c83dc3aee175e2482b3f777.eot",
    "revision": null
  }, {
    "url": "assets/a071abba7e9bd90947f74e34f411dfbc.woff2",
    "revision": null
  }, {
    "url": "assets/a6069540692725c247f13984a9598a92.woff2",
    "revision": null
  }, {
    "url": "assets/b3726f0165bf67ac68494ee7a1b9f6ce.ttf",
    "revision": null
  }, {
    "url": "assets/b9c017a718cdeb8538b85b43da63bafc.woff2",
    "revision": null
  }, {
    "url": "assets/bb5de40edffdbd3ab519a2079528029b.woff2",
    "revision": null
  }, {
    "url": "assets/c656b8caa454ed19b9a2ef7f4f5b8fea.ttf",
    "revision": null
  }, {
    "url": "assets/c66465590541129e82d3d6f725c5658b.woff",
    "revision": null
  }, {
    "url": "assets/cac87dc00c87a5d74711d0276713808a.woff",
    "revision": null
  }, {
    "url": "assets/d68fa3e67dbb653a13cec44b1bcabcfe.eot",
    "revision": null
  }, {
    "url": "assets/dcb1947bf381a2824c71d3d56201be3d.woff2",
    "revision": null
  }, {
    "url": "assets/ddae9b1ba9b0b42f58809904b0b21349.woff",
    "revision": null
  }, {
    "url": "assets/ddf3ba7c143ea711126ca33713e335e6.woff2",
    "revision": null
  }, {
    "url": "assets/e014213d2c1456d5f1af91a9b0cdbc08.woff",
    "revision": null
  }, {
    "url": "assets/e244488c8cc2f53371535d542a499b57.woff2",
    "revision": null
  }, {
    "url": "assets/e48918f9c91871c0ce3ecf2a3ee0a416.woff2",
    "revision": null
  }, {
    "url": "assets/ed49088eb627c1c0155d8b711767f15c.woff",
    "revision": null
  }, {
    "url": "deps/ffmpeg.js-audio/ffmpeg-audio.js",
    "revision": "13b48111ac06afa7d52607a883de72b8"
  }, {
    "url": "deps/ffmpeg.js-audio/ffmpeg-worker-audio.js",
    "revision": "3a5dfa433edc561d9017cd6e6b18dec7"
  }, {
    "url": "deps/gen2faust.lib",
    "revision": "6024187832c1ad7af33a5103e57bcfc8"
  }, {
    "url": "deps/libGUIDOEngine.wasm",
    "revision": "0abd2158ffc1e076d0a176f909195080"
  }, {
    "url": "deps/libfaust-wasm.data",
    "revision": "c2c69cabe8df0cb7ecf0ff0f90484431"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "ada98ab25617bee35cf6c4aecb116f4a"
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
    "revision": "86c70f5a65e0365575cc213b939d78d9"
  }, {
    "url": "js/01125075dd5a77fcaf14.worklet.js",
    "revision": null
  }, {
    "url": "js/077af11455cd3c72e0fc.js",
    "revision": null
  }, {
    "url": "js/1f12c8171623f5ead837.js",
    "revision": null
  }, {
    "url": "js/1fcb895f339cb7a4a5ef.js",
    "revision": null
  }, {
    "url": "js/21f17b46a8377868ba51.js",
    "revision": null
  }, {
    "url": "js/25876a97140daefc9969.js",
    "revision": null
  }, {
    "url": "js/32314d427fdcf75df646.worker.js",
    "revision": null
  }, {
    "url": "js/344d033171639c102a64.js",
    "revision": null
  }, {
    "url": "js/455af92e7e1dc39fdbc8060f6680ab32.worker.js",
    "revision": "582b0ba08d850bff237a9eebde3cd704"
  }, {
    "url": "js/4c3849425ccb884bc452.worker.js",
    "revision": null
  }, {
    "url": "js/530cb7efe94a14501f0d.js",
    "revision": null
  }, {
    "url": "js/57adc54a85b1020609544ca7f331b0dc.worker.js",
    "revision": "6699adaa125cb2aed3554dc7b2b43275"
  }, {
    "url": "js/70e2229a91ef60124053.js",
    "revision": null
  }, {
    "url": "js/74a1a93cd3d9409ebb4d.js",
    "revision": null
  }, {
    "url": "js/74c62f8b3a024b17f492.js",
    "revision": null
  }, {
    "url": "js/761dd3072436a3661278.js",
    "revision": null
  }, {
    "url": "js/8f860db53d4b119a128e.worker.js",
    "revision": null
  }, {
    "url": "js/93f081b7994dc623d5af.js",
    "revision": null
  }, {
    "url": "js/9e2cc486e6c7af760125.js",
    "revision": null
  }, {
    "url": "js/a175c95f8a217ddc7718.js",
    "revision": null
  }, {
    "url": "js/a75af1dffaa1c0f6ebf5.worklet.js",
    "revision": null
  }, {
    "url": "js/a9e0b4da7c66a0111b79.worker.js",
    "revision": null
  }, {
    "url": "js/abf9711acd934061f5f4.worker.js",
    "revision": null
  }, {
    "url": "js/ad3807e007ccc437a924.js",
    "revision": null
  }, {
    "url": "js/b39a2bde93a2083f323b.js",
    "revision": null
  }, {
    "url": "js/b48e24c12d2496127b6583b54fc55dfe.worker.js",
    "revision": "30e4086acd83a43ce6c9b70444aa36dd"
  }, {
    "url": "js/c62ed09ff8c18bbd3f9d.js",
    "revision": null
  }, {
    "url": "js/d47797743077c3124ecb.js",
    "revision": null
  }, {
    "url": "js/dbc3ec8130ec01e8bc89.js",
    "revision": null
  }, {
    "url": "js/e14077e33139e9ad029b.worklet.js",
    "revision": null
  }, {
    "url": "js/e4799d489a12b35cf07b.js",
    "revision": null
  }, {
    "url": "js/e75308fe71c1b5bad8b2.js",
    "revision": null
  }, {
    "url": "js/e91db8b9cba697aa04a4.js",
    "revision": null
  }, {
    "url": "js/f0db1001acab084c7fd5.js",
    "revision": null
  }, {
    "url": "js/f144d5b5f05fa829b306.worker.js",
    "revision": null
  }, {
    "url": "js/f26b8c8404bd3ce9268a.js",
    "revision": null
  }, {
    "url": "js/fa55fc5f0b8dc70725d2.worker.js",
    "revision": null
  }, {
    "url": "js/ffac8f5baaa0b7efadcc.js",
    "revision": null
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }], {});
  workbox.cleanupOutdatedCaches();

});
//# sourceMappingURL=service-worker.js.map
