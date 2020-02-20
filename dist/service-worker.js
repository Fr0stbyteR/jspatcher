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
  const singleRequire = async name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    if (!registry[name]) {
      
        await new Promise(async resolve => {
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
      

      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
    }
    return registry[name];
  };

  const require = async (names, resolve) => {
    const modules = await Promise.all(names.map(singleRequire));
    resolve(modules.length === 1 ? modules[0] : modules);
  };
  
  // FIXME: This is probably not generic, lol.
  require.toUrl = id => `./${id}`;

  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = new Promise(async resolve => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      const deps = await Promise.all(
        depsNames.map(depName => {
          if (depName === "exports") {
            return exports;
          }
          if (depName === "module") {
            return module;
          }
          return singleRequire(depName);
        })
      );
      const facValue = factory(...deps);
      if(!exports.default) {
        exports.default = facValue;
      }
      resolve(exports);
    });
  };
}
define("./service-worker.js",['./workbox-aa7ae16e'], function (workbox) { 'use strict';

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
    prefix: "1582215809963"
  });
  workbox.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/0996d39c4cf5d223a14559dfa37047fd.woff2",
    "revision": "0996d39c4cf5d223a14559dfa37047fd"
  }, {
    "url": "assets/0ab54153eeeca0ce03978cc463b257f7.woff2",
    "revision": "0ab54153eeeca0ce03978cc463b257f7"
  }, {
    "url": "assets/0b6bb6725576b072c5d0b02ecdd1900d.woff2",
    "revision": "0b6bb6725576b072c5d0b02ecdd1900d"
  }, {
    "url": "assets/0f4fa9755f480e75463e74b3dce5a3ee.woff2",
    "revision": "0f4fa9755f480e75463e74b3dce5a3ee"
  }, {
    "url": "assets/0faa1074c17a74a7f5e32cbe6f9d76f3.woff2",
    "revision": "0faa1074c17a74a7f5e32cbe6f9d76f3"
  }, {
    "url": "assets/13db00b7a34fee4d819ab7f9838cc428.eot",
    "revision": "13db00b7a34fee4d819ab7f9838cc428"
  }, {
    "url": "assets/13fa4c60e0ee7ea5fe2bd84059fb8cac.woff",
    "revision": "13fa4c60e0ee7ea5fe2bd84059fb8cac"
  }, {
    "url": "assets/16d14ad314296a4644d550c8f20bd407.woff",
    "revision": "16d14ad314296a4644d550c8f20bd407"
  }, {
    "url": "assets/27bd77b9162d388cb8d4c4217c7c5e2a.woff",
    "revision": "27bd77b9162d388cb8d4c4217c7c5e2a"
  }, {
    "url": "assets/2ce4d82354fdf1be1788c526d94eefc1.woff",
    "revision": "2ce4d82354fdf1be1788c526d94eefc1"
  }, {
    "url": "assets/314210a4825a7cc8ca7db893dfd9d283.woff2",
    "revision": "314210a4825a7cc8ca7db893dfd9d283"
  }, {
    "url": "assets/33d5f0d956f3fc30bc51f81047a2c47d.woff2",
    "revision": "33d5f0d956f3fc30bc51f81047a2c47d"
  }, {
    "url": "assets/38d2399f6c10d8ba1d8d45ba0c440ad5.woff",
    "revision": "38d2399f6c10d8ba1d8d45ba0c440ad5"
  }, {
    "url": "assets/46f0461b6e19880fe446f094bbe787f4.woff2",
    "revision": "46f0461b6e19880fe446f094bbe787f4"
  }, {
    "url": "assets/482fe0a9e92d9c5ff7fec117ca54c8ae.woff",
    "revision": "482fe0a9e92d9c5ff7fec117ca54c8ae"
  }, {
    "url": "assets/4d295621045bd774d4beed9d6d5796e4.woff2",
    "revision": "4d295621045bd774d4beed9d6d5796e4"
  }, {
    "url": "assets/4eb103b4d12be57cb1d040ed5e162e9d.woff2",
    "revision": "4eb103b4d12be57cb1d040ed5e162e9d"
  }, {
    "url": "assets/701ae6abd4719e9c2ada3535a497b341.eot",
    "revision": "701ae6abd4719e9c2ada3535a497b341"
  }, {
    "url": "assets/7244318390cc4d36aac4a613ff42d308.woff2",
    "revision": "7244318390cc4d36aac4a613ff42d308"
  }, {
    "url": "assets/798eafdd87dc8f3174f76164f0685e02.woff",
    "revision": "798eafdd87dc8f3174f76164f0685e02"
  }, {
    "url": "assets/80f6811f6c30735dab68a01372d8b78f.woff2",
    "revision": "80f6811f6c30735dab68a01372d8b78f"
  }, {
    "url": "assets/82f60bd0b94a1ed68b1e6e309ce2e8c3.svg",
    "revision": "82f60bd0b94a1ed68b1e6e309ce2e8c3"
  }, {
    "url": "assets/880cffe4febaa7476b6aee71db68b7e4.woff2",
    "revision": "880cffe4febaa7476b6aee71db68b7e4"
  }, {
    "url": "assets/8b4f872c5de19974857328d06d3fe48f.woff2",
    "revision": "8b4f872c5de19974857328d06d3fe48f"
  }, {
    "url": "assets/8e3c7f5520f5ae906c6cf6d7f3ddcd19.eot",
    "revision": "8e3c7f5520f5ae906c6cf6d7f3ddcd19"
  }, {
    "url": "assets/90301aa07d780a09812229d6375c3b28.woff",
    "revision": "90301aa07d780a09812229d6375c3b28"
  }, {
    "url": "assets/962a1bf31c081691065fe333d9fa8105.svg",
    "revision": "962a1bf31c081691065fe333d9fa8105"
  }, {
    "url": "assets/9c74e172f87984c48ddf5c8108cabe67.png",
    "revision": "9c74e172f87984c48ddf5c8108cabe67"
  }, {
    "url": "assets/9c7e4e9eb485b4a121c760e61bc3707c.woff",
    "revision": "9c7e4e9eb485b4a121c760e61bc3707c"
  }, {
    "url": "assets/9fcec04cdba9253e002e740a7cd743fe.woff",
    "revision": "9fcec04cdba9253e002e740a7cd743fe"
  }, {
    "url": "assets/a046592bac8f2fd96e994733faf3858c.woff",
    "revision": "a046592bac8f2fd96e994733faf3858c"
  }, {
    "url": "assets/a1a749e89f578a49306ec2b055c073da.svg",
    "revision": "a1a749e89f578a49306ec2b055c073da"
  }, {
    "url": "assets/a609dc0f334a7d4e64205247c4e8b97c.ttf",
    "revision": "a609dc0f334a7d4e64205247c4e8b97c"
  }, {
    "url": "assets/aa1a75124661b40a6770dc0d8274ddaa.woff",
    "revision": "aa1a75124661b40a6770dc0d8274ddaa"
  }, {
    "url": "assets/acbd6ecc97c80340e9bf00ea80063234.woff",
    "revision": "acbd6ecc97c80340e9bf00ea80063234"
  }, {
    "url": "assets/ad97afd3337e8cda302d10ff5a4026b8.ttf",
    "revision": "ad97afd3337e8cda302d10ff5a4026b8"
  }, {
    "url": "assets/ada4458b361d5e72bcbd19da105afdc5.woff2",
    "revision": "ada4458b361d5e72bcbd19da105afdc5"
  }, {
    "url": "assets/b4da0df63131b83ddeec1febb5b15374.woff",
    "revision": "b4da0df63131b83ddeec1febb5b15374"
  }, {
    "url": "assets/b55e385f24f0f9f724dac935fe292ecf.woff",
    "revision": "b55e385f24f0f9f724dac935fe292ecf"
  }, {
    "url": "assets/b87b9ba532ace76ae9f6edfe9f72ded2.ttf",
    "revision": "b87b9ba532ace76ae9f6edfe9f72ded2"
  }, {
    "url": "assets/bd03a2cc277bbbc338d464e679fe9942.woff2",
    "revision": "bd03a2cc277bbbc338d464e679fe9942"
  }, {
    "url": "assets/c2b50f4a7d908c8d06f5b05ec135e166.woff",
    "revision": "c2b50f4a7d908c8d06f5b05ec135e166"
  }, {
    "url": "assets/c5ebe0b32dc1b5cc449a76c4204d13bb.ttf",
    "revision": "c5ebe0b32dc1b5cc449a76c4204d13bb"
  }, {
    "url": "assets/c9cbbdc3762c340d5d37073a54971487.woff2",
    "revision": "c9cbbdc3762c340d5d37073a54971487"
  }, {
    "url": "assets/cccb897485813c7c256901dbca54ecf2.woff2",
    "revision": "cccb897485813c7c256901dbca54ecf2"
  }, {
    "url": "assets/cd6c777f1945164224dee082abaea03a.woff2",
    "revision": "cd6c777f1945164224dee082abaea03a"
  }, {
    "url": "assets/d878b6c29b10beca227e9eef4246111b.woff",
    "revision": "d878b6c29b10beca227e9eef4246111b"
  }, {
    "url": "assets/d9cf517802956cd88eadcb9158aa6dec.woff2",
    "revision": "d9cf517802956cd88eadcb9158aa6dec"
  }, {
    "url": "assets/e8c322de9658cbeb8a774b6624167c2c.woff2",
    "revision": "e8c322de9658cbeb8a774b6624167c2c"
  }, {
    "url": "assets/ef60a4f6c25ef7f39f2d25a748dbecfe.woff",
    "revision": "ef60a4f6c25ef7f39f2d25a748dbecfe"
  }, {
    "url": "assets/f28f2d6482446544ef1ea1ccc6dd5892.woff",
    "revision": "f28f2d6482446544ef1ea1ccc6dd5892"
  }, {
    "url": "assets/f80bda6afd19534368443a3d0323a140.woff",
    "revision": "f80bda6afd19534368443a3d0323a140"
  }, {
    "url": "assets/faff92145777a3cbaf8e7367b4807987.woff",
    "revision": "faff92145777a3cbaf8e7367b4807987"
  }, {
    "url": "deps/libfaust-wasm.data",
    "revision": "15de5ba5c9c575236a637238251bd84e"
  }, {
    "url": "deps/libfaust-wasm.wasm",
    "revision": "0afc6327ddebf4fcab02a2258abe1814"
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
    "revision": "4600a6c57b82131c6d4217bf2168f840"
  }, {
    "url": "js/395a3f25fb2dfdd94882.worklet.js",
    "revision": "d13cbc26d5d0a945f29142a2077e7699"
  }, {
    "url": "js/39678c5b6e9f8a9ad007.js",
    "revision": "ea3751618e88e9d34749ff79110b4f44"
  }, {
    "url": "js/3b9a60440fb842ed4cd1.js",
    "revision": "bb99efbc4a3933c82bce127006eac120"
  }, {
    "url": "js/8d6cf1de192a4d0521761f6e6aa2a82b.worker.js",
    "revision": "3ffcd4a66c91250c0a377a2432b22e4c"
  }, {
    "url": "js/b7f07d82e2bf7bf2fafe.js",
    "revision": "02a67e3639b670d39d9efbcfb5feed16"
  }, {
    "url": "js/eb1438eee5a8c21d5f1f.js",
    "revision": "ad4281edc1fb34e2c64ce77fadad1e9e"
  }, {
    "url": "js/f38bc9464452d76da8bb.js",
    "revision": "89801a95a4660d182d64d166ef51d5b3"
  }, {
    "url": "manifest.json",
    "revision": "1cbaa3cdd5ba147975aa27bb8a1914f4"
  }], {});

});
//# sourceMappingURL=service-worker.js.map
