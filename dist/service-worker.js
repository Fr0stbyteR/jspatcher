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
define("./service-worker.js",['./workbox-4f86b97f'], function (workbox) { 'use strict';

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
    prefix: "1586796834050"
  });
  workbox.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/08eb0932dc2145b3f6b23d1eeb9e22f4.woff",
    "revision": "acbd6ecc97c80340e9bf00ea80063234"
  }, {
    "url": "assets/0d0882bc6997a213dace5d0bbe174036.woff",
    "revision": "798eafdd87dc8f3174f76164f0685e02"
  }, {
    "url": "assets/1d2ca94dfba6f8d87cfda33b32f0febc.woff",
    "revision": "27bd77b9162d388cb8d4c4217c7c5e2a"
  }, {
    "url": "assets/1fd1d41f8c400da7af75c5c1821fd164.woff",
    "revision": "13fa4c60e0ee7ea5fe2bd84059fb8cac"
  }, {
    "url": "assets/21b3848a32fce5b0f5014948186f6964.woff2",
    "revision": "cccb897485813c7c256901dbca54ecf2"
  }, {
    "url": "assets/278156e41e0ad908cf7f841b17130502.woff2",
    "revision": "e8c322de9658cbeb8a774b6624167c2c"
  }, {
    "url": "assets/34b49f334f41cea8e3655802530d4c67.woff2",
    "revision": "80f6811f6c30735dab68a01372d8b78f"
  }, {
    "url": "assets/353a3bb93ba34c9b047610960d97fbb4.woff2",
    "revision": "46f0461b6e19880fe446f094bbe787f4"
  }, {
    "url": "assets/38c6d8bab26db77d8c806813e1497763.woff2",
    "revision": "0ab54153eeeca0ce03978cc463b257f7"
  }, {
    "url": "assets/3e22a5367c2e68d6e4ba56d2a827141e.woff2",
    "revision": "4d295621045bd774d4beed9d6d5796e4"
  }, {
    "url": "assets/3e6b99809852a8290c42c97dc1b66efb.woff",
    "revision": "9c7e4e9eb485b4a121c760e61bc3707c"
  }, {
    "url": "assets/3fdee263fe69b843601fc2a6eb5baf24.woff",
    "revision": "9fcec04cdba9253e002e740a7cd743fe"
  }, {
    "url": "assets/425399f81e4ce7cbd967685402ba0260.woff",
    "revision": "faff92145777a3cbaf8e7367b4807987"
  }, {
    "url": "assets/46957bf0a71db58833138e00cb6f4eb8.woff2",
    "revision": "880cffe4febaa7476b6aee71db68b7e4"
  }, {
    "url": "assets/5367103510b27b78482794590e1ce3b0.ttf",
    "revision": "ad97afd3337e8cda302d10ff5a4026b8"
  }, {
    "url": "assets/546b4809e90728a64a4f91e399a1e6f4.woff",
    "revision": "16d14ad314296a4644d550c8f20bd407"
  }, {
    "url": "assets/598d09137818c7135a2483a669590a65.woff",
    "revision": "b4da0df63131b83ddeec1febb5b15374"
  }, {
    "url": "assets/5b824a726edcf6642539e81a3534f3ad.woff",
    "revision": "2ce4d82354fdf1be1788c526d94eefc1"
  }, {
    "url": "assets/62a9c838c99d073c7ba6ac08698de9a1.woff",
    "revision": "f28f2d6482446544ef1ea1ccc6dd5892"
  }, {
    "url": "assets/62d9dae4e0040e81c980950003df0e07.svg",
    "revision": "962a1bf31c081691065fe333d9fa8105"
  }, {
    "url": "assets/65a2fb6d9aaa164b41a039302093995b.ttf",
    "revision": "c5ebe0b32dc1b5cc449a76c4204d13bb"
  }, {
    "url": "assets/6729d29753e000c17489ed43135ba8d5.svg",
    "revision": "a1a749e89f578a49306ec2b055c073da"
  }, {
    "url": "assets/687a4990ea22bb1a49d469a5d9319790.woff2",
    "revision": "cd6c777f1945164224dee082abaea03a"
  }, {
    "url": "assets/6ae7abff1b20614e4a70a75f8f64a8e8.woff2",
    "revision": "0faa1074c17a74a7f5e32cbe6f9d76f3"
  }, {
    "url": "assets/6cfa65c63939188f33ef0e3a68d09306.woff",
    "revision": "f80bda6afd19534368443a3d0323a140"
  }, {
    "url": "assets/6d20cff5b3255dd0078f935c34e2b882.woff2",
    "revision": "33d5f0d956f3fc30bc51f81047a2c47d"
  }, {
    "url": "assets/73d2c04510d153b6da5291b538422faf.woff2",
    "revision": "ada4458b361d5e72bcbd19da105afdc5"
  }, {
    "url": "assets/752905fa5edf21fc52a10a0c1ca9c7a4.eot",
    "revision": "701ae6abd4719e9c2ada3535a497b341"
  }, {
    "url": "assets/75614cfcfedd509b1f7ac1c26c53bb7f.woff2",
    "revision": "bd03a2cc277bbbc338d464e679fe9942"
  }, {
    "url": "assets/75f024ce11d1fb961e8c4602e54a17a6.woff2",
    "revision": "c9cbbdc3762c340d5d37073a54971487"
  }, {
    "url": "assets/7d1b926dcecd9fd7425ea7a81a737391.woff",
    "revision": "482fe0a9e92d9c5ff7fec117ca54c8ae"
  }, {
    "url": "assets/848f3a6e80058194c450d0bc7e93080f.woff",
    "revision": "90301aa07d780a09812229d6375c3b28"
  }, {
    "url": "assets/863985d67436f8342e2d913563648040.woff2",
    "revision": "d9cf517802956cd88eadcb9158aa6dec"
  }, {
    "url": "assets/89b618086a797a8be0f4549489bb2993.woff",
    "revision": "d878b6c29b10beca227e9eef4246111b"
  }, {
    "url": "assets/9242107df7da7c6ad3cadf3133abcd37.ttf",
    "revision": "a609dc0f334a7d4e64205247c4e8b97c"
  }, {
    "url": "assets/99f63ae7a743f21ab30847ed06a698d9.png",
    "revision": "9c74e172f87984c48ddf5c8108cabe67"
  }, {
    "url": "assets/9ba7233345056c919454146973e10ee2.woff",
    "revision": "aa1a75124661b40a6770dc0d8274ddaa"
  }, {
    "url": "assets/9c4845b4b41ef40a22faee76144fa816.svg",
    "revision": "82f60bd0b94a1ed68b1e6e309ce2e8c3"
  }, {
    "url": "assets/a01e3f2d6c83dc3aee175e2482b3f777.eot",
    "revision": "8e3c7f5520f5ae906c6cf6d7f3ddcd19"
  }, {
    "url": "assets/a071abba7e9bd90947f74e34f411dfbc.woff2",
    "revision": "0996d39c4cf5d223a14559dfa37047fd"
  }, {
    "url": "assets/a6069540692725c247f13984a9598a92.woff2",
    "revision": "8b4f872c5de19974857328d06d3fe48f"
  }, {
    "url": "assets/b9c017a718cdeb8538b85b43da63bafc.woff2",
    "revision": "0f4fa9755f480e75463e74b3dce5a3ee"
  }, {
    "url": "assets/bb5de40edffdbd3ab519a2079528029b.woff2",
    "revision": "4eb103b4d12be57cb1d040ed5e162e9d"
  }, {
    "url": "assets/c656b8caa454ed19b9a2ef7f4f5b8fea.ttf",
    "revision": "b87b9ba532ace76ae9f6edfe9f72ded2"
  }, {
    "url": "assets/c66465590541129e82d3d6f725c5658b.woff",
    "revision": "c2b50f4a7d908c8d06f5b05ec135e166"
  }, {
    "url": "assets/cac87dc00c87a5d74711d0276713808a.woff",
    "revision": "a046592bac8f2fd96e994733faf3858c"
  }, {
    "url": "assets/d68fa3e67dbb653a13cec44b1bcabcfe.eot",
    "revision": "13db00b7a34fee4d819ab7f9838cc428"
  }, {
    "url": "assets/dcb1947bf381a2824c71d3d56201be3d.woff2",
    "revision": "314210a4825a7cc8ca7db893dfd9d283"
  }, {
    "url": "assets/ddae9b1ba9b0b42f58809904b0b21349.woff",
    "revision": "ef60a4f6c25ef7f39f2d25a748dbecfe"
  }, {
    "url": "assets/e014213d2c1456d5f1af91a9b0cdbc08.woff",
    "revision": "38d2399f6c10d8ba1d8d45ba0c440ad5"
  }, {
    "url": "assets/e244488c8cc2f53371535d542a499b57.woff2",
    "revision": "7244318390cc4d36aac4a613ff42d308"
  }, {
    "url": "assets/e48918f9c91871c0ce3ecf2a3ee0a416.woff2",
    "revision": "0b6bb6725576b072c5d0b02ecdd1900d"
  }, {
    "url": "assets/ed49088eb627c1c0155d8b711767f15c.woff",
    "revision": "b55e385f24f0f9f724dac935fe292ecf"
  }, {
    "url": "deps/gen2faust.lib",
    "revision": "4a5caac2473413a16f30fef8e942e790"
  }, {
    "url": "deps/libfaust-wasm.data",
    "revision": "6bbb22efeae7a81b7b6252aa910241a2"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "48998b148de6684833aeabadd941b8e9"
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
    "revision": "90509a043949258c3c2d90e3e63740d2"
  }, {
    "url": "index.js",
    "revision": "fd7a55f271d75a3db30eaddfc569b8f8"
  }, {
    "url": "js/08564bf75e3bbc6f89ae.worklet.js",
    "revision": "f1bb859edecfe92f3d2e7043257b695d"
  }, {
    "url": "js/5efe0bfd958a7565be72.worklet.js",
    "revision": "91eb033646b6a0acce21638620db0506"
  }, {
    "url": "js/86485ddb6fbdf2c75d72.js",
    "revision": "42191b76554549990999b33d1ef8a6ec"
  }, {
    "url": "js/8d6cf1de192a4d0521761f6e6aa2a82b.worker.js",
    "revision": "3ffcd4a66c91250c0a377a2432b22e4c"
  }, {
    "url": "js/a32711bedf0de9ff4160.js",
    "revision": "2587f1c1b1e6ffad27f05da46f45e3c2"
  }, {
    "url": "js/a6c8479e408fc3ccbbea.js",
    "revision": "5027adc63e5ba6396df0ad8241b8340c"
  }, {
    "url": "js/b63726184b9d553897d6.js",
    "revision": "2ef1ef726176361e6b7bc92779fbbd60"
  }, {
    "url": "js/b71ec475ef3d0545b78f.js",
    "revision": "88cb0d026125a157fefa9edd9969a710"
  }, {
    "url": "js/dcc8ae2697e37702f2dd.js",
    "revision": "6549bd7b6bc5e8851b210b40764ef42a"
  }, {
    "url": "js/e0c066ebbc63eb8f2707.js",
    "revision": "69efb6d095062a18b32aa99fbac0c239"
  }, {
    "url": "js/f696421493ec74946f95c102e8f6a657.worker.js",
    "revision": "a7db7f55944311d08f9a7fcefcc9cee2"
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }], {});
  workbox.cleanupOutdatedCaches();

});
//# sourceMappingURL=service-worker.js.map
