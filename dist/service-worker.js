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
    prefix: "0.0.9.1643908113054"
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
    "revision": "61fc26ff19d5de91aa9b28055bd81a2f"
  }, {
    "url": "js/093f87cbe5f72924042e.worker.js",
    "revision": null
  }, {
    "url": "js/0c3018b73d160e6c6afa.js",
    "revision": null
  }, {
    "url": "js/1334f02b176eae39e00e.js",
    "revision": null
  }, {
    "url": "js/16b5c0b817f6f27b5d40.js",
    "revision": null
  }, {
    "url": "js/1e5ebab907071b4f0cc2.worklet.js",
    "revision": null
  }, {
    "url": "js/1fd48324ad978d8fa02c.js",
    "revision": null
  }, {
    "url": "js/213f141861767aab82ae.js",
    "revision": null
  }, {
    "url": "js/2bdcb578852f026716fb.js",
    "revision": null
  }, {
    "url": "js/3c4960751fc675b67818.worker.js",
    "revision": null
  }, {
    "url": "js/43ddb889df02629b0875.js",
    "revision": null
  }, {
    "url": "js/44379b2cd93add36e170.worklet.js",
    "revision": null
  }, {
    "url": "js/455af92e7e1dc39fdbc8060f6680ab32.worker.js",
    "revision": "6c96cb396f6c37b118e729c9b96fd18d"
  }, {
    "url": "js/56c7a09722913fd163af.js",
    "revision": null
  }, {
    "url": "js/57e4115a5ff45fae0108.js",
    "revision": null
  }, {
    "url": "js/6242e1368fbab61b9b8c.worklet.js",
    "revision": null
  }, {
    "url": "js/63e4abe53e0229caac74.js",
    "revision": null
  }, {
    "url": "js/6ac3da9c3c6c0150fe6f.js",
    "revision": null
  }, {
    "url": "js/6b1ed1bedd96f08944b0e5a8b12c4739.worker.js",
    "revision": "3cafc222030e049a264341e3d78032dc"
  }, {
    "url": "js/7729a259493c6169e19a.js",
    "revision": null
  }, {
    "url": "js/7b7c146764e4b3a77746.js",
    "revision": null
  }, {
    "url": "js/94dfd33fd323cd617f82.js",
    "revision": null
  }, {
    "url": "js/995e581fcc7ffde55cf1.js",
    "revision": null
  }, {
    "url": "js/a20423a665f33600a061.worklet.js",
    "revision": null
  }, {
    "url": "js/a7acfcca6fb672f16df9.js",
    "revision": null
  }, {
    "url": "js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "js/aed52dabaf8dcabb70a4.worklet.js",
    "revision": null
  }, {
    "url": "js/b48e24c12d2496127b6583b54fc55dfe.worker.js",
    "revision": "f2ef4a2f6a378fed0bf7bcfd3c1976e5"
  }, {
    "url": "js/b80b30576a69320284be.worker.js",
    "revision": null
  }, {
    "url": "js/bf6e4cbabd2e40803ea6.js",
    "revision": null
  }, {
    "url": "js/c905f55ecbc3a91ecbea.worker.js",
    "revision": null
  }, {
    "url": "js/d47aca3a982802bbd17c.worker.js",
    "revision": null
  }, {
    "url": "js/d6f036474c0c28ea8c9e.worker.js",
    "revision": null
  }, {
    "url": "js/da9b5ead4848cc2777299f9d18504d8c.worker.js",
    "revision": "c7dc4aca24aa192b4e10bd83dc1aa303"
  }, {
    "url": "js/e3032e0bf179781f2540.worker.js",
    "revision": null
  }, {
    "url": "js/e826857862f4c20d1c06.js",
    "revision": null
  }, {
    "url": "js/f32c38de61b637f5e10d.js",
    "revision": null
  }, {
    "url": "js/f3a506d28ebebe406101.js",
    "revision": null
  }, {
    "url": "js/fa70373fd253f3205e09.js",
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
    "revision": "7ec52ba9573ad70301d290898ece61c1"
  }, {
    "url": "packages/cac/index.jspatpkg.js",
    "revision": "7c92f7d1e924fcbde1c33b932edc6304"
  }, {
    "url": "packages/dsp/086a7c70fb5111167461.wasm",
    "revision": "74db830e11dc6c69511f5071718b89da"
  }, {
    "url": "packages/dsp/13b7507fa586e4a2f4ba.wasm",
    "revision": "c7599ed4f12984488b10a1792b1a0c0e"
  }, {
    "url": "packages/dsp/13c0c96d3374f9042ed2.wasm",
    "revision": "fae4d4d502eb1872b5cb684b2b0dbac0"
  }, {
    "url": "packages/dsp/13c562d958e5e0d9c176.wasm",
    "revision": "ef9736eceb3a4474aff3749f30aa44a7"
  }, {
    "url": "packages/dsp/15ce35168b06e8277da8.wasm",
    "revision": "d85418b948b02ab7818ad06742925a88"
  }, {
    "url": "packages/dsp/168a8e67430a7bfdc52e.wasm",
    "revision": "8fd7a3ae4d4d388bf9986ec8983119d1"
  }, {
    "url": "packages/dsp/181f6287c840f08ac1b7.wasm",
    "revision": "fd48b4ee604cded3e4cc00a7b2306e94"
  }, {
    "url": "packages/dsp/26b349000c310bfb1475.wasm",
    "revision": "8173bcf1fa99dfb574b566c2791330a1"
  }, {
    "url": "packages/dsp/2ab923058b4ab2733aa4.wasm",
    "revision": "d8f94ed0666e58f09fbc4d144d691670"
  }, {
    "url": "packages/dsp/2bef3cb0e7db60c2caef.wasm",
    "revision": "c46853fc606e90856d762f16ac0b35c6"
  }, {
    "url": "packages/dsp/32cd01ba5f80cda6c966.wasm",
    "revision": "709b15161db71166ebb1c527cdc1b9aa"
  }, {
    "url": "packages/dsp/340529f9dd5b35ae7636.wasm",
    "revision": "e17b46a7d5fa3542c35e5df98b7e7576"
  }, {
    "url": "packages/dsp/35c6b1ee3578955bce13.wasm",
    "revision": "f1c16afa35a72c6f59fcb4dd7907f574"
  }, {
    "url": "packages/dsp/3eabfebaf12d195b615b.wasm",
    "revision": "d82f098035492f2f0e52ffeb5533fe82"
  }, {
    "url": "packages/dsp/40c416565566a1d00428.wasm",
    "revision": "b1f96c2bb2b15bbab66cd13b546437aa"
  }, {
    "url": "packages/dsp/536fe9844311d8c23c3c.wasm",
    "revision": "cb964ab9707b0f2f5a34dccfc65fd4fd"
  }, {
    "url": "packages/dsp/5ee8d00d4ea71120c67d.wasm",
    "revision": "0b2bd11b3700dcd8496c8c776abb7906"
  }, {
    "url": "packages/dsp/7844e84ed58100bad250.wasm",
    "revision": "3e0fba98b82e96d292c1c0a94bc73192"
  }, {
    "url": "packages/dsp/7b8630a799aa72fc1d1b.wasm",
    "revision": "121f942db4a1738384d13ef63d6311ad"
  }, {
    "url": "packages/dsp/7c827accc47ba9cc6d99.wasm",
    "revision": "1da2488548c2d73a890432b02b3ec58e"
  }, {
    "url": "packages/dsp/8337c413994e264371d2.wasm",
    "revision": "e5263a03ac2227f8b30dd9ee4a634869"
  }, {
    "url": "packages/dsp/85e01f372374182d01e6.wasm",
    "revision": "e52f1014fa254cc2974e07b3eb6bab33"
  }, {
    "url": "packages/dsp/88725f7cfe7cb7494913.wasm",
    "revision": "da6b9114f399e9d7dcf1fdce169fa5db"
  }, {
    "url": "packages/dsp/8abe0476673413b70a5a.wasm",
    "revision": "28d9a982c933ef366b2b536a215d0b88"
  }, {
    "url": "packages/dsp/8e67cdb93c36596690a9.wasm",
    "revision": "487947fe6cdae18882600ea3caec4ab7"
  }, {
    "url": "packages/dsp/8fae341e3e9522397837.wasm",
    "revision": "58ce56ebe092f6a67fdb7226ed8c73cc"
  }, {
    "url": "packages/dsp/9c37f4e1fa4c77cd9600.wasm",
    "revision": "977c470d3c0a641ebfbd349e7201bf98"
  }, {
    "url": "packages/dsp/9c6361efd87e3a27ed41.wasm",
    "revision": "2fea14b2ce58b42c0a613770d9fce6c7"
  }, {
    "url": "packages/dsp/9d734a4aa2ba838aef6c.wasm",
    "revision": "211769c88a81380f0bba698c6b2ac9e8"
  }, {
    "url": "packages/dsp/9f425033d536c9cdfbfc.wasm",
    "revision": "b88461466434cf481a9090a0ea5aca65"
  }, {
    "url": "packages/dsp/a86f87b480d625e0b411.wasm",
    "revision": "941c6d6d7bad60d8790cbaf07d069dda"
  }, {
    "url": "packages/dsp/bc577e16bd932e72d92a.wasm",
    "revision": "5a80f5944caff18c31a7da641cffc599"
  }, {
    "url": "packages/dsp/ce7abd07cd8f0fd65158.wasm",
    "revision": "b58d87e57aee5f3f4a7610208638b4eb"
  }, {
    "url": "packages/dsp/dca6a5ad7b04b9e303d8.wasm",
    "revision": "e2e436aef4ceee667f3ebbf419bc0a6a"
  }, {
    "url": "packages/dsp/de8355caff087eb6af0f.wasm",
    "revision": "c44118b1708304220f8475d472aa8925"
  }, {
    "url": "packages/dsp/efb3416233ef0681d2f8.wasm",
    "revision": "bcb8ab0555a2bcc21eccea0a9d10dbd8"
  }, {
    "url": "packages/dsp/fbcb101d5e3cc923c500.wasm",
    "revision": "17198ebe0f6d8a26fe94ec9b0cff4e57"
  }, {
    "url": "packages/dsp/index.js",
    "revision": "574d8f2fca61fdcdd9cbc7ded0b27a26"
  }, {
    "url": "packages/dsp/index.jspatpkg.js",
    "revision": "58936c0afb41d739a54ba81000cc5ba9"
  }, {
    "url": "packages/dsp/js/0492285e4001b9bb35bf.js",
    "revision": "cebc53308d3250f7679593b6e6c997f5"
  }, {
    "url": "packages/dsp/js/0b9e94d6c6980b077adc.js",
    "revision": "c546745eb4f8d0a625a5a60dce1615cd"
  }, {
    "url": "packages/dsp/js/0c03c6de7ce275335b56.js",
    "revision": "f5590f02414fec6508cd36b693c64384"
  }, {
    "url": "packages/dsp/js/0d1387618bad1ae17ae1.js",
    "revision": "af49df817f97d843cf2c070fda9a1d13"
  }, {
    "url": "packages/dsp/js/0e895ee6791de50053bb.js",
    "revision": "3cb9c3220b1a0b4404ec14dabac0bbc9"
  }, {
    "url": "packages/dsp/js/0fe7a788b828c4f3b32c.js",
    "revision": "325e5be776dc3ba9991a755f1424ea2b"
  }, {
    "url": "packages/dsp/js/12133c48a2c05a2cce87.js",
    "revision": "66a1599dfbbe2878906564aa84ff3d0c"
  }, {
    "url": "packages/dsp/js/135a1b64bae9f9568679.js",
    "revision": "cdcb3eb25421475d2fe42f54a5da2086"
  }, {
    "url": "packages/dsp/js/1500841eee8536170e3f.js",
    "revision": "b8b42771ae4a3e4a9651cfc12ff47078"
  }, {
    "url": "packages/dsp/js/17811b5924fc4bcfa2d0.js",
    "revision": "accd25bdbf28f6512bf7c4346f551876"
  }, {
    "url": "packages/dsp/js/209c0a8f8152f67e5f23.js",
    "revision": "19c95e250fa8485c1705fc215ffd01df"
  }, {
    "url": "packages/dsp/js/2245f9469690321f7bc4.js",
    "revision": "ecc64182425d90a078c7e97d9c3a8af5"
  }, {
    "url": "packages/dsp/js/2711f4fa9a20a08f5fd1.js",
    "revision": "04bfe363e01f2eaa6f242567f095b05d"
  }, {
    "url": "packages/dsp/js/2754144d946786f4459d.js",
    "revision": "c1312cc5c7b12909dc3f55b3cf1e1920"
  }, {
    "url": "packages/dsp/js/28036c01195f9877c25e.js",
    "revision": "a80de4343019c396f3219388af81af3e"
  }, {
    "url": "packages/dsp/js/2a5f03f3c9b3dec25405.js",
    "revision": "f59fa08b499cc3fdebb6769103d120e0"
  }, {
    "url": "packages/dsp/js/3cb2431b0f63dd3d73fe.js",
    "revision": "3a5ed3d3918b165f4166d177d0e2afdb"
  }, {
    "url": "packages/dsp/js/40677f34330c17e708d6.js",
    "revision": "3e56d6dd2805ebfc59d60ceae3bc40b4"
  }, {
    "url": "packages/dsp/js/409f9326802bc1dc8615.js",
    "revision": "5a98a22f5131b60cf273e5e82f187944"
  }, {
    "url": "packages/dsp/js/42f19657f03936408587.js",
    "revision": "700ae004a52b0af6273d2a92eafeaacb"
  }, {
    "url": "packages/dsp/js/4368b0aac56a6bf5ac90.js",
    "revision": "00cbaf092627e05c66a74a928d211078"
  }, {
    "url": "packages/dsp/js/43be7dbe2410d2fff2f0.js",
    "revision": "012c3d982122531c5e2081bf43f7584c"
  }, {
    "url": "packages/dsp/js/46eefbd4bf523e0daada.js",
    "revision": "fd2f5a6af7ffb747a81d9ac873cfadc1"
  }, {
    "url": "packages/dsp/js/489240c018cf3f9993da.js",
    "revision": "809b2ced72b52dc853da0064ca2a1edd"
  }, {
    "url": "packages/dsp/js/4b669635bed770a4f84d.js",
    "revision": "9f9ac6055bbaa6993bb1bea307a8b020"
  }, {
    "url": "packages/dsp/js/4ce0f5b5615b165a0a6b.js",
    "revision": "13735920834704248ee621cb8c84cb10"
  }, {
    "url": "packages/dsp/js/502e84d5f3212e454632.js",
    "revision": "c8237ebaaf0d99a90c112e44824546bc"
  }, {
    "url": "packages/dsp/js/52bd0a1a7acf79006f68.js",
    "revision": "d4973d1f9b5c8219c3d06f04b684766f"
  }, {
    "url": "packages/dsp/js/537121f702a700f5eade.js",
    "revision": "a365dfe783ba4448ac169f68107bdf76"
  }, {
    "url": "packages/dsp/js/5d1f374404b85c1c1866.js",
    "revision": "ec1a4ebc230798a2f5b2fd359db096a3"
  }, {
    "url": "packages/dsp/js/656a3462f5b4865c39be.js",
    "revision": "da7ef085855468c8af7e6fd66a0ad6fd"
  }, {
    "url": "packages/dsp/js/66288eba2b16e46319c5.js",
    "revision": "cbb1bcfc6e931fb02b3cc320012b9acb"
  }, {
    "url": "packages/dsp/js/66fad1b0eaa76674e58e.js",
    "revision": "8eb21d11b72fb308774ad23fc6311820"
  }, {
    "url": "packages/dsp/js/69b5bc21a2aa08fff8ea.js",
    "revision": "ffe4973482b7651504b77ec266c69f37"
  }, {
    "url": "packages/dsp/js/6c3817caecba29c40ba9.js",
    "revision": "ac1996b978cb560028fbe79f43b8de7d"
  }, {
    "url": "packages/dsp/js/6da97aa4361554dd99e7.js",
    "revision": "1e69e2476c4380ebb2e108995a17739e"
  }, {
    "url": "packages/dsp/js/6f0aa6108ac31d9d293e.js",
    "revision": "e4d4c91f7c663017bbbb971721a2b710"
  }, {
    "url": "packages/dsp/js/757fa92aaed2a537a27d.js",
    "revision": "f83a4ad7369cd07641fa94b7b050e5d6"
  }, {
    "url": "packages/dsp/js/78bed74ab6c90673e1b6.js",
    "revision": "4d99d0ab36f6cd640d58fb92645759d4"
  }, {
    "url": "packages/dsp/js/7991feedbe5d7a307477.js",
    "revision": "f56a42eb02cf46dcb8e6e670482ebaff"
  }, {
    "url": "packages/dsp/js/7b13096f6480c9b64a41.js",
    "revision": "1d0a5a2578d6562797eda1e0c3e8a610"
  }, {
    "url": "packages/dsp/js/7f2e7c95d94bb7756967.js",
    "revision": "1cb3f31b46c6dd91872cb2862ff98262"
  }, {
    "url": "packages/dsp/js/8140f9f4a99b46a1bc5c.js",
    "revision": "fbfad7629280b80af768f3e3f99c7488"
  }, {
    "url": "packages/dsp/js/81f11dcb708ae890f8fc.js",
    "revision": "103b53ba2883bd9d46abc953dff48a56"
  }, {
    "url": "packages/dsp/js/86e1dda760e4f0723259.js",
    "revision": "404c421d1f72679e59004535ec9e223b"
  }, {
    "url": "packages/dsp/js/8bd957eb1e00368cc97e.js",
    "revision": "8282d712d5aa95d58fd1662441931943"
  }, {
    "url": "packages/dsp/js/8ce43441e8192f99c4a9.js",
    "revision": "bc3882941775c776180bb5aad58fd94b"
  }, {
    "url": "packages/dsp/js/91ac41da19a38f77c84e.js",
    "revision": "097968da03c9d3f0774f2f71e4208f87"
  }, {
    "url": "packages/dsp/js/93457af337c77b0e0bd3.js",
    "revision": "285e0bce0ead1c7968dd9ef8288df463"
  }, {
    "url": "packages/dsp/js/9353243215bc0de84983.js",
    "revision": "1f91e70afd1a3b8b4e689e74b9c4781c"
  }, {
    "url": "packages/dsp/js/96e8e77eb6fa3f2a7986.js",
    "revision": "4176b5fda440cfcadb824cda5159c23c"
  }, {
    "url": "packages/dsp/js/9b4f8b071da9f777f082.js",
    "revision": "a433c00a85980c63102f7848d7871a13"
  }, {
    "url": "packages/dsp/js/a3e83b249ba823cce546.js",
    "revision": "60861bd055087b54dcf920788ab621c1"
  }, {
    "url": "packages/dsp/js/ad3ead814821427e53ef.js",
    "revision": "603eba693c605fc859cc7882aac2432f"
  }, {
    "url": "packages/dsp/js/b2f14bc3000a1b641238.js",
    "revision": "1e3f97977ecd8a97fa62ef184146e430"
  }, {
    "url": "packages/dsp/js/b3bece826caa86450e9e.js",
    "revision": "85fb8e85bdc43e8566f99e4c1427870e"
  }, {
    "url": "packages/dsp/js/c106ea8e46f7c2f380b6.js",
    "revision": "087685eb59776f0b0b23bf54d1a11083"
  }, {
    "url": "packages/dsp/js/c860917339731b4ae8e6.js",
    "revision": "dad64805d403bd2c73fe2359d772cc5a"
  }, {
    "url": "packages/dsp/js/c873f5866950d927e2bb.js",
    "revision": "57cbd7319c1ef4634cc2a395caa102bf"
  }, {
    "url": "packages/dsp/js/c9230d79b2d04ae9ef52.js",
    "revision": "a152402d486a260ed2e11b10f4438576"
  }, {
    "url": "packages/dsp/js/ceb793c4c0589a21cab7.js",
    "revision": "cbaecff43553e8b4eed1a31b0e53c82f"
  }, {
    "url": "packages/dsp/js/cfe50ad6665653129c85.js",
    "revision": "ac4a0a7931e45661077f3064d347df16"
  }, {
    "url": "packages/dsp/js/d10f0d4270bcf7822fa0.js",
    "revision": "a835f06695dafa1537fc27931d5cb405"
  }, {
    "url": "packages/dsp/js/d8e31072f31be1422b08.js",
    "revision": "cd498f98ad42c36d0ccc88c7c4990dbb"
  }, {
    "url": "packages/dsp/js/dc2acf5598e3f9530b88.js",
    "revision": "108bf1bf7e0c4bdf2902a02203d174d8"
  }, {
    "url": "packages/dsp/js/e093628cc3e6ac1f5703.js",
    "revision": "c315f7554da2957286cac205f3a58c8c"
  }, {
    "url": "packages/dsp/js/e26672c503d40f2111d4.js",
    "revision": "e216a93daf70fca55ea2a88ef59be22b"
  }, {
    "url": "packages/dsp/js/e31ac747e32e12fbe13a.js",
    "revision": "10225284f92186b089392dbbb5a6b1a4"
  }, {
    "url": "packages/dsp/js/ee6f70983dc3eec249bd.js",
    "revision": "b02f7bf6aa54bd4a10da8061a738c0a4"
  }, {
    "url": "packages/dsp/js/efca265b74ffa2ad2cba.js",
    "revision": "3018f5b06c07f380548b58dd611e0f88"
  }, {
    "url": "packages/dsp/js/f2260894f0c9e561ad9e.js",
    "revision": "ff97d8dba5169cc2735fb2cc1d2fe903"
  }, {
    "url": "packages/dsp/js/f39523de16707d695fab.js",
    "revision": "c62738b8c0db415d163528c302347fb3"
  }, {
    "url": "packages/dsp/js/f8f8e1aaead815d05393.js",
    "revision": "3627e326df17e791b6645507e4c3a1da"
  }, {
    "url": "packages/dsp/js/facbf9ea77af396e0dd7.js",
    "revision": "0ab260623e6a91f78d2a6a1bb5b49887"
  }, {
    "url": "packages/dsp/js/fd5f4cf6c927abf10774.js",
    "revision": "52241e791a5b6c80ca5366e735692262"
  }, {
    "url": "packages/internal-packages.json",
    "revision": "95e8ad0b02143d69cb4c2fa71d8d14c9"
  }, {
    "url": "packages/live/index.js",
    "revision": "2cf494c91433e6bdda61a76510959c3d"
  }, {
    "url": "packages/live/index.jspatpkg.js",
    "revision": "f68cc52ba42096c1215e08c07e33fa0c"
  }, {
    "url": "packages/midi/index.js",
    "revision": "83bdb9f4d9c6ee2bb77d3a226d556c38"
  }, {
    "url": "packages/midi/index.jspatpkg.js",
    "revision": "74d3b60eb7a8c51efe3e837f1230a753"
  }, {
    "url": "packages/op/index.js",
    "revision": "549601486a7aef08ad83b657b6cdc2aa"
  }, {
    "url": "packages/op/index.jsdsppkg.aw.js",
    "revision": "427306e9943ceefd984a318b00ab00e5"
  }, {
    "url": "packages/op/index.jsdsppkg.main.js",
    "revision": "a20e81e449f208274a9a2522c2c588be"
  }, {
    "url": "packages/op/index.jspatpkg.js",
    "revision": "66b3372f0bc98fd8e498ae124e969be0"
  }, {
    "url": "packages/std/index.js",
    "revision": "30a0b4840c53ae78f87ef98780828834"
  }, {
    "url": "packages/std/index.jsdsppkg.aw.js",
    "revision": "712a75d23afda92c32bbba7456fe1f8c"
  }, {
    "url": "packages/std/index.jsdsppkg.main.js",
    "revision": "0d155c3116c2ebe12854a1e18a206b2c"
  }, {
    "url": "packages/std/index.jspatpkg.js",
    "revision": "232c9c33ea4ff48d48dfbded6b06fd4d"
  }, {
    "url": "packages/ui/index.js",
    "revision": "3259f485aa82a93c139f748ec0fa5cbc"
  }, {
    "url": "packages/ui/index.jspatpkg.js",
    "revision": "d342dbe8c5a93434afa1ad6d5a87141a"
  }, {
    "url": "packages/webaudio/index.js",
    "revision": "ff5c856e234c2a254c6a5534fbc8e2c4"
  }, {
    "url": "packages/webaudio/index.jspatpkg.js",
    "revision": "c558a6534055b02799dc0fbccc80a79b"
  }, {
    "url": "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_ImageEditor_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_image_PatcherImage_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_PatcherText_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_text_TextEditor_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_PatcherVideo_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_video_VideoEditor_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }, {
    "url": "src_core_worklets_PatcherNode_ts.js/aa41186d7a69c75e00e6.worklet.js",
    "revision": null
  }], {});
  workbox.cleanupOutdatedCaches();

}));
//# sourceMappingURL=service-worker.js.map
