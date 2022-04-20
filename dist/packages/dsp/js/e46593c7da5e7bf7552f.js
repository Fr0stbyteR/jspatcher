(self["webpackChunk_jspatcher_package_dsp"] = self["webpackChunk_jspatcher_package_dsp"] || []).push([["dsps_phasor_dspMeta_json"],{

/***/ "./dsps/phasor/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/phasor/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"phasor\",\n    \"filename\": \"phasor\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/oscillators.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 24,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0.5]\"\n        },\n        {\n            \"description\": \"Simple sawtooth waveform oscillator between 0 and 1 with phase control\"\n        },\n        {\n            \"filename\": \"phasor\"\n        },\n        {\n            \"inputsDescription\": \"[`freq`, `phase`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"phasor\"\n        },\n        {\n            \"oscillators.lib/name\": \"Faust Oscillator Library\"\n        },\n        {\n            \"oscillators.lib/version\": \"0.1\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"phasor\",\n            \"items\": []\n        }\n    ]\n}";

/***/ })

}])