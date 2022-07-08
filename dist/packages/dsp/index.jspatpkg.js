/******/ var __webpack_modules__ = ({

/***/ "./dsps/dsps.ts":
/*!**********************!*\
  !*** ./dsps/dsps.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _abs_dspModule_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abs/dspModule.wasm */ "./dsps/abs/dspModule.wasm");
/* harmony import */ var _abs_dspMeta_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abs/dspMeta.json */ "./dsps/abs/dspMeta.json");
/* harmony import */ var _acos_dspModule_wasm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./acos/dspModule.wasm */ "./dsps/acos/dspModule.wasm");
/* harmony import */ var _acos_dspMeta_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./acos/dspMeta.json */ "./dsps/acos/dspMeta.json");
/* harmony import */ var _acosh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./acosh/dspModule.wasm */ "./dsps/acosh/dspModule.wasm");
/* harmony import */ var _acosh_dspMeta_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./acosh/dspMeta.json */ "./dsps/acosh/dspMeta.json");
/* harmony import */ var _add_dspModule_wasm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./add/dspModule.wasm */ "./dsps/add/dspModule.wasm");
/* harmony import */ var _add_dspMeta_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./add/dspMeta.json */ "./dsps/add/dspMeta.json");
/* harmony import */ var _adsr_dspModule_wasm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./adsr/dspModule.wasm */ "./dsps/adsr/dspModule.wasm");
/* harmony import */ var _adsr_dspMeta_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./adsr/dspMeta.json */ "./dsps/adsr/dspMeta.json");
/* harmony import */ var _allpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./allpass/dspModule.wasm */ "./dsps/allpass/dspModule.wasm");
/* harmony import */ var _allpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./allpass/dspMeta.json */ "./dsps/allpass/dspMeta.json");
/* harmony import */ var _ar_dspModule_wasm__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ar/dspModule.wasm */ "./dsps/ar/dspModule.wasm");
/* harmony import */ var _ar_dspMeta_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ar/dspMeta.json */ "./dsps/ar/dspMeta.json");
/* harmony import */ var _asin_dspModule_wasm__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./asin/dspModule.wasm */ "./dsps/asin/dspModule.wasm");
/* harmony import */ var _asin_dspMeta_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./asin/dspMeta.json */ "./dsps/asin/dspMeta.json");
/* harmony import */ var _asinh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./asinh/dspModule.wasm */ "./dsps/asinh/dspModule.wasm");
/* harmony import */ var _asinh_dspMeta_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./asinh/dspMeta.json */ "./dsps/asinh/dspMeta.json");
/* harmony import */ var _atan_dspModule_wasm__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./atan/dspModule.wasm */ "./dsps/atan/dspModule.wasm");
/* harmony import */ var _atan_dspMeta_json__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./atan/dspMeta.json */ "./dsps/atan/dspMeta.json");
/* harmony import */ var _atan2_dspModule_wasm__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./atan2/dspModule.wasm */ "./dsps/atan2/dspModule.wasm");
/* harmony import */ var _atan2_dspMeta_json__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./atan2/dspMeta.json */ "./dsps/atan2/dspMeta.json");
/* harmony import */ var _atanh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./atanh/dspModule.wasm */ "./dsps/atanh/dspModule.wasm");
/* harmony import */ var _atanh_dspMeta_json__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./atanh/dspMeta.json */ "./dsps/atanh/dspMeta.json");
/* harmony import */ var _atodb_dspModule_wasm__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./atodb/dspModule.wasm */ "./dsps/atodb/dspModule.wasm");
/* harmony import */ var _atodb_dspMeta_json__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./atodb/dspMeta.json */ "./dsps/atodb/dspMeta.json");
/* harmony import */ var _bandpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./bandpass/dspModule.wasm */ "./dsps/bandpass/dspModule.wasm");
/* harmony import */ var _bandpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./bandpass/dspMeta.json */ "./dsps/bandpass/dspMeta.json");
/* harmony import */ var _biquad_dspModule_wasm__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./biquad/dspModule.wasm */ "./dsps/biquad/dspModule.wasm");
/* harmony import */ var _biquad_dspMeta_json__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./biquad/dspMeta.json */ "./dsps/biquad/dspMeta.json");
/* harmony import */ var _bitand_dspModule_wasm__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./bitand/dspModule.wasm */ "./dsps/bitand/dspModule.wasm");
/* harmony import */ var _bitand_dspMeta_json__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./bitand/dspMeta.json */ "./dsps/bitand/dspMeta.json");
/* harmony import */ var _bitor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./bitor/dspModule.wasm */ "./dsps/bitor/dspModule.wasm");
/* harmony import */ var _bitor_dspMeta_json__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./bitor/dspMeta.json */ "./dsps/bitor/dspMeta.json");
/* harmony import */ var _bitxor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./bitxor/dspModule.wasm */ "./dsps/bitxor/dspModule.wasm");
/* harmony import */ var _bitxor_dspMeta_json__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./bitxor/dspMeta.json */ "./dsps/bitxor/dspMeta.json");
/* harmony import */ var _change_dspModule_wasm__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./change/dspModule.wasm */ "./dsps/change/dspModule.wasm");
/* harmony import */ var _change_dspMeta_json__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./change/dspMeta.json */ "./dsps/change/dspMeta.json");
/* harmony import */ var _cycle_dspModule_wasm__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./cycle/dspModule.wasm */ "./dsps/cycle/dspModule.wasm");
/* harmony import */ var _cycle_dspMeta_json__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./cycle/dspMeta.json */ "./dsps/cycle/dspMeta.json");
/* harmony import */ var _dbtoa_dspModule_wasm__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./dbtoa/dspModule.wasm */ "./dsps/dbtoa/dspModule.wasm");
/* harmony import */ var _dbtoa_dspMeta_json__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./dbtoa/dspMeta.json */ "./dsps/dbtoa/dspMeta.json");
/* harmony import */ var _dcblocker_dspModule_wasm__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./dcblocker/dspModule.wasm */ "./dsps/dcblocker/dspModule.wasm");
/* harmony import */ var _dcblocker_dspMeta_json__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./dcblocker/dspMeta.json */ "./dsps/dcblocker/dspMeta.json");
/* harmony import */ var _distort_dspModule_wasm__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./distort/dspModule.wasm */ "./dsps/distort/dspModule.wasm");
/* harmony import */ var _distort_dspMeta_json__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./distort/dspMeta.json */ "./dsps/distort/dspMeta.json");
/* harmony import */ var _div_dspModule_wasm__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./div/dspModule.wasm */ "./dsps/div/dspModule.wasm");
/* harmony import */ var _div_dspMeta_json__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./div/dspMeta.json */ "./dsps/div/dspMeta.json");
/* harmony import */ var _eq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./eq/dspModule.wasm */ "./dsps/eq/dspModule.wasm");
/* harmony import */ var _eq_dspMeta_json__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./eq/dspMeta.json */ "./dsps/eq/dspMeta.json");
/* harmony import */ var _filtercoeff_dspModule_wasm__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./filtercoeff/dspModule.wasm */ "./dsps/filtercoeff/dspModule.wasm");
/* harmony import */ var _filtercoeff_dspMeta_json__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./filtercoeff/dspMeta.json */ "./dsps/filtercoeff/dspMeta.json");
/* harmony import */ var _ftom_dspModule_wasm__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./ftom/dspModule.wasm */ "./dsps/ftom/dspModule.wasm");
/* harmony import */ var _ftom_dspMeta_json__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./ftom/dspMeta.json */ "./dsps/ftom/dspMeta.json");
/* harmony import */ var _geq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./geq/dspModule.wasm */ "./dsps/geq/dspModule.wasm");
/* harmony import */ var _geq_dspMeta_json__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./geq/dspMeta.json */ "./dsps/geq/dspMeta.json");
/* harmony import */ var _gtr_dspModule_wasm__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./gtr/dspModule.wasm */ "./dsps/gtr/dspModule.wasm");
/* harmony import */ var _gtr_dspMeta_json__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./gtr/dspMeta.json */ "./dsps/gtr/dspMeta.json");
/* harmony import */ var _highpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./highpass/dspModule.wasm */ "./dsps/highpass/dspModule.wasm");
/* harmony import */ var _highpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./highpass/dspMeta.json */ "./dsps/highpass/dspMeta.json");
/* harmony import */ var _highshelf_dspModule_wasm__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./highshelf/dspModule.wasm */ "./dsps/highshelf/dspModule.wasm");
/* harmony import */ var _highshelf_dspMeta_json__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./highshelf/dspMeta.json */ "./dsps/highshelf/dspMeta.json");
/* harmony import */ var _leq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./leq/dspModule.wasm */ "./dsps/leq/dspModule.wasm");
/* harmony import */ var _leq_dspMeta_json__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./leq/dspMeta.json */ "./dsps/leq/dspMeta.json");
/* harmony import */ var _log_dspModule_wasm__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./log/dspModule.wasm */ "./dsps/log/dspModule.wasm");
/* harmony import */ var _log_dspMeta_json__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./log/dspMeta.json */ "./dsps/log/dspMeta.json");
/* harmony import */ var _lowpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./lowpass/dspModule.wasm */ "./dsps/lowpass/dspModule.wasm");
/* harmony import */ var _lowpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./lowpass/dspMeta.json */ "./dsps/lowpass/dspMeta.json");
/* harmony import */ var _lowshelf_dspModule_wasm__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./lowshelf/dspModule.wasm */ "./dsps/lowshelf/dspModule.wasm");
/* harmony import */ var _lowshelf_dspMeta_json__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./lowshelf/dspMeta.json */ "./dsps/lowshelf/dspMeta.json");
/* harmony import */ var _lss_dspModule_wasm__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./lss/dspModule.wasm */ "./dsps/lss/dspModule.wasm");
/* harmony import */ var _lss_dspMeta_json__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./lss/dspMeta.json */ "./dsps/lss/dspMeta.json");
/* harmony import */ var _max_dspModule_wasm__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./max/dspModule.wasm */ "./dsps/max/dspModule.wasm");
/* harmony import */ var _max_dspMeta_json__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ./max/dspMeta.json */ "./dsps/max/dspMeta.json");
/* harmony import */ var _min_dspModule_wasm__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ./min/dspModule.wasm */ "./dsps/min/dspModule.wasm");
/* harmony import */ var _min_dspMeta_json__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ./min/dspMeta.json */ "./dsps/min/dspMeta.json");
/* harmony import */ var _mod_dspModule_wasm__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ./mod/dspModule.wasm */ "./dsps/mod/dspModule.wasm");
/* harmony import */ var _mod_dspMeta_json__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(/*! ./mod/dspMeta.json */ "./dsps/mod/dspMeta.json");
/* harmony import */ var _mtof_dspModule_wasm__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(/*! ./mtof/dspModule.wasm */ "./dsps/mtof/dspModule.wasm");
/* harmony import */ var _mtof_dspMeta_json__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(/*! ./mtof/dspMeta.json */ "./dsps/mtof/dspMeta.json");
/* harmony import */ var _mul_dspModule_wasm__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(/*! ./mul/dspModule.wasm */ "./dsps/mul/dspModule.wasm");
/* harmony import */ var _mul_dspMeta_json__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(/*! ./mul/dspMeta.json */ "./dsps/mul/dspMeta.json");
/* harmony import */ var _neq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(/*! ./neq/dspModule.wasm */ "./dsps/neq/dspModule.wasm");
/* harmony import */ var _neq_dspMeta_json__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(/*! ./neq/dspMeta.json */ "./dsps/neq/dspMeta.json");
/* harmony import */ var _noise_dspModule_wasm__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(/*! ./noise/dspModule.wasm */ "./dsps/noise/dspModule.wasm");
/* harmony import */ var _noise_dspMeta_json__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(/*! ./noise/dspMeta.json */ "./dsps/noise/dspMeta.json");
/* harmony import */ var _notch_dspModule_wasm__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(/*! ./notch/dspModule.wasm */ "./dsps/notch/dspModule.wasm");
/* harmony import */ var _notch_dspMeta_json__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(/*! ./notch/dspMeta.json */ "./dsps/notch/dspMeta.json");
/* harmony import */ var _peaknotch_dspModule_wasm__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(/*! ./peaknotch/dspModule.wasm */ "./dsps/peaknotch/dspModule.wasm");
/* harmony import */ var _peaknotch_dspMeta_json__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(/*! ./peaknotch/dspMeta.json */ "./dsps/peaknotch/dspMeta.json");
/* harmony import */ var _phasor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(/*! ./phasor/dspModule.wasm */ "./dsps/phasor/dspModule.wasm");
/* harmony import */ var _phasor_dspMeta_json__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(/*! ./phasor/dspMeta.json */ "./dsps/phasor/dspMeta.json");
/* harmony import */ var _pink_dspModule_wasm__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(/*! ./pink/dspModule.wasm */ "./dsps/pink/dspModule.wasm");
/* harmony import */ var _pink_dspMeta_json__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(/*! ./pink/dspMeta.json */ "./dsps/pink/dspMeta.json");
/* harmony import */ var _rdiv_dspModule_wasm__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(/*! ./rdiv/dspModule.wasm */ "./dsps/rdiv/dspModule.wasm");
/* harmony import */ var _rdiv_dspMeta_json__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(/*! ./rdiv/dspMeta.json */ "./dsps/rdiv/dspMeta.json");
/* harmony import */ var _rect_dspModule_wasm__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(/*! ./rect/dspModule.wasm */ "./dsps/rect/dspModule.wasm");
/* harmony import */ var _rect_dspMeta_json__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(/*! ./rect/dspMeta.json */ "./dsps/rect/dspMeta.json");
/* harmony import */ var _rsub_dspModule_wasm__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(/*! ./rsub/dspModule.wasm */ "./dsps/rsub/dspModule.wasm");
/* harmony import */ var _rsub_dspMeta_json__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(/*! ./rsub/dspMeta.json */ "./dsps/rsub/dspMeta.json");
/* harmony import */ var _sah_dspModule_wasm__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(/*! ./sah/dspModule.wasm */ "./dsps/sah/dspModule.wasm");
/* harmony import */ var _sah_dspMeta_json__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(/*! ./sah/dspMeta.json */ "./dsps/sah/dspMeta.json");
/* harmony import */ var _slide_dspModule_wasm__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(/*! ./slide/dspModule.wasm */ "./dsps/slide/dspModule.wasm");
/* harmony import */ var _slide_dspMeta_json__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(/*! ./slide/dspMeta.json */ "./dsps/slide/dspMeta.json");
/* harmony import */ var _smooth_dspModule_wasm__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(/*! ./smooth/dspModule.wasm */ "./dsps/smooth/dspModule.wasm");
/* harmony import */ var _smooth_dspMeta_json__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(/*! ./smooth/dspMeta.json */ "./dsps/smooth/dspMeta.json");
/* harmony import */ var _sub_dspModule_wasm__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(/*! ./sub/dspModule.wasm */ "./dsps/sub/dspModule.wasm");
/* harmony import */ var _sub_dspMeta_json__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(/*! ./sub/dspMeta.json */ "./dsps/sub/dspMeta.json");
/* harmony import */ var _tri_dspModule_wasm__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(/*! ./tri/dspModule.wasm */ "./dsps/tri/dspModule.wasm");
/* harmony import */ var _tri_dspMeta_json__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(/*! ./tri/dspMeta.json */ "./dsps/tri/dspMeta.json");
/* harmony import */ var _dspModule_wasm__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(/*! ./_/dspModule.wasm */ "./dsps/_/dspModule.wasm");
/* harmony import */ var _dspMeta_json__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(/*! ./_/dspMeta.json */ "./dsps/_/dspMeta.json");
















































































































const map = {
  abs: {
    module: _abs_dspModule_wasm__WEBPACK_IMPORTED_MODULE_0__,
    json: _abs_dspMeta_json__WEBPACK_IMPORTED_MODULE_1__
  },
  acos: {
    module: _acos_dspModule_wasm__WEBPACK_IMPORTED_MODULE_2__,
    json: _acos_dspMeta_json__WEBPACK_IMPORTED_MODULE_3__
  },
  acosh: {
    module: _acosh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_4__,
    json: _acosh_dspMeta_json__WEBPACK_IMPORTED_MODULE_5__
  },
  add: {
    module: _add_dspModule_wasm__WEBPACK_IMPORTED_MODULE_6__,
    json: _add_dspMeta_json__WEBPACK_IMPORTED_MODULE_7__
  },
  adsr: {
    module: _adsr_dspModule_wasm__WEBPACK_IMPORTED_MODULE_8__,
    json: _adsr_dspMeta_json__WEBPACK_IMPORTED_MODULE_9__
  },
  allpass: {
    module: _allpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_10__,
    json: _allpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_11__
  },
  ar: {
    module: _ar_dspModule_wasm__WEBPACK_IMPORTED_MODULE_12__,
    json: _ar_dspMeta_json__WEBPACK_IMPORTED_MODULE_13__
  },
  asin: {
    module: _asin_dspModule_wasm__WEBPACK_IMPORTED_MODULE_14__,
    json: _asin_dspMeta_json__WEBPACK_IMPORTED_MODULE_15__
  },
  asinh: {
    module: _asinh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_16__,
    json: _asinh_dspMeta_json__WEBPACK_IMPORTED_MODULE_17__
  },
  atan: {
    module: _atan_dspModule_wasm__WEBPACK_IMPORTED_MODULE_18__,
    json: _atan_dspMeta_json__WEBPACK_IMPORTED_MODULE_19__
  },
  atan2: {
    module: _atan2_dspModule_wasm__WEBPACK_IMPORTED_MODULE_20__,
    json: _atan2_dspMeta_json__WEBPACK_IMPORTED_MODULE_21__
  },
  atanh: {
    module: _atanh_dspModule_wasm__WEBPACK_IMPORTED_MODULE_22__,
    json: _atanh_dspMeta_json__WEBPACK_IMPORTED_MODULE_23__
  },
  atodb: {
    module: _atodb_dspModule_wasm__WEBPACK_IMPORTED_MODULE_24__,
    json: _atodb_dspMeta_json__WEBPACK_IMPORTED_MODULE_25__
  },
  bandpass: {
    module: _bandpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_26__,
    json: _bandpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_27__
  },
  biquad: {
    module: _biquad_dspModule_wasm__WEBPACK_IMPORTED_MODULE_28__,
    json: _biquad_dspMeta_json__WEBPACK_IMPORTED_MODULE_29__
  },
  bitand: {
    module: _bitand_dspModule_wasm__WEBPACK_IMPORTED_MODULE_30__,
    json: _bitand_dspMeta_json__WEBPACK_IMPORTED_MODULE_31__
  },
  bitor: {
    module: _bitor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_32__,
    json: _bitor_dspMeta_json__WEBPACK_IMPORTED_MODULE_33__
  },
  bitxor: {
    module: _bitxor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_34__,
    json: _bitxor_dspMeta_json__WEBPACK_IMPORTED_MODULE_35__
  },
  change: {
    module: _change_dspModule_wasm__WEBPACK_IMPORTED_MODULE_36__,
    json: _change_dspMeta_json__WEBPACK_IMPORTED_MODULE_37__
  },
  cycle: {
    module: _cycle_dspModule_wasm__WEBPACK_IMPORTED_MODULE_38__,
    json: _cycle_dspMeta_json__WEBPACK_IMPORTED_MODULE_39__
  },
  dbtoa: {
    module: _dbtoa_dspModule_wasm__WEBPACK_IMPORTED_MODULE_40__,
    json: _dbtoa_dspMeta_json__WEBPACK_IMPORTED_MODULE_41__
  },
  dcblocker: {
    module: _dcblocker_dspModule_wasm__WEBPACK_IMPORTED_MODULE_42__,
    json: _dcblocker_dspMeta_json__WEBPACK_IMPORTED_MODULE_43__
  },
  distort: {
    module: _distort_dspModule_wasm__WEBPACK_IMPORTED_MODULE_44__,
    json: _distort_dspMeta_json__WEBPACK_IMPORTED_MODULE_45__
  },
  div: {
    module: _div_dspModule_wasm__WEBPACK_IMPORTED_MODULE_46__,
    json: _div_dspMeta_json__WEBPACK_IMPORTED_MODULE_47__
  },
  eq: {
    module: _eq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_48__,
    json: _eq_dspMeta_json__WEBPACK_IMPORTED_MODULE_49__
  },
  filtercoeff: {
    module: _filtercoeff_dspModule_wasm__WEBPACK_IMPORTED_MODULE_50__,
    json: _filtercoeff_dspMeta_json__WEBPACK_IMPORTED_MODULE_51__
  },
  ftom: {
    module: _ftom_dspModule_wasm__WEBPACK_IMPORTED_MODULE_52__,
    json: _ftom_dspMeta_json__WEBPACK_IMPORTED_MODULE_53__
  },
  geq: {
    module: _geq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_54__,
    json: _geq_dspMeta_json__WEBPACK_IMPORTED_MODULE_55__
  },
  gtr: {
    module: _gtr_dspModule_wasm__WEBPACK_IMPORTED_MODULE_56__,
    json: _gtr_dspMeta_json__WEBPACK_IMPORTED_MODULE_57__
  },
  highpass: {
    module: _highpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_58__,
    json: _highpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_59__
  },
  highshelf: {
    module: _highshelf_dspModule_wasm__WEBPACK_IMPORTED_MODULE_60__,
    json: _highshelf_dspMeta_json__WEBPACK_IMPORTED_MODULE_61__
  },
  leq: {
    module: _leq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_62__,
    json: _leq_dspMeta_json__WEBPACK_IMPORTED_MODULE_63__
  },
  log: {
    module: _log_dspModule_wasm__WEBPACK_IMPORTED_MODULE_64__,
    json: _log_dspMeta_json__WEBPACK_IMPORTED_MODULE_65__
  },
  lowpass: {
    module: _lowpass_dspModule_wasm__WEBPACK_IMPORTED_MODULE_66__,
    json: _lowpass_dspMeta_json__WEBPACK_IMPORTED_MODULE_67__
  },
  lowshelf: {
    module: _lowshelf_dspModule_wasm__WEBPACK_IMPORTED_MODULE_68__,
    json: _lowshelf_dspMeta_json__WEBPACK_IMPORTED_MODULE_69__
  },
  lss: {
    module: _lss_dspModule_wasm__WEBPACK_IMPORTED_MODULE_70__,
    json: _lss_dspMeta_json__WEBPACK_IMPORTED_MODULE_71__
  },
  max: {
    module: _max_dspModule_wasm__WEBPACK_IMPORTED_MODULE_72__,
    json: _max_dspMeta_json__WEBPACK_IMPORTED_MODULE_73__
  },
  min: {
    module: _min_dspModule_wasm__WEBPACK_IMPORTED_MODULE_74__,
    json: _min_dspMeta_json__WEBPACK_IMPORTED_MODULE_75__
  },
  mod: {
    module: _mod_dspModule_wasm__WEBPACK_IMPORTED_MODULE_76__,
    json: _mod_dspMeta_json__WEBPACK_IMPORTED_MODULE_77__
  },
  mtof: {
    module: _mtof_dspModule_wasm__WEBPACK_IMPORTED_MODULE_78__,
    json: _mtof_dspMeta_json__WEBPACK_IMPORTED_MODULE_79__
  },
  mul: {
    module: _mul_dspModule_wasm__WEBPACK_IMPORTED_MODULE_80__,
    json: _mul_dspMeta_json__WEBPACK_IMPORTED_MODULE_81__
  },
  neq: {
    module: _neq_dspModule_wasm__WEBPACK_IMPORTED_MODULE_82__,
    json: _neq_dspMeta_json__WEBPACK_IMPORTED_MODULE_83__
  },
  noise: {
    module: _noise_dspModule_wasm__WEBPACK_IMPORTED_MODULE_84__,
    json: _noise_dspMeta_json__WEBPACK_IMPORTED_MODULE_85__
  },
  notch: {
    module: _notch_dspModule_wasm__WEBPACK_IMPORTED_MODULE_86__,
    json: _notch_dspMeta_json__WEBPACK_IMPORTED_MODULE_87__
  },
  peaknotch: {
    module: _peaknotch_dspModule_wasm__WEBPACK_IMPORTED_MODULE_88__,
    json: _peaknotch_dspMeta_json__WEBPACK_IMPORTED_MODULE_89__
  },
  phasor: {
    module: _phasor_dspModule_wasm__WEBPACK_IMPORTED_MODULE_90__,
    json: _phasor_dspMeta_json__WEBPACK_IMPORTED_MODULE_91__
  },
  pink: {
    module: _pink_dspModule_wasm__WEBPACK_IMPORTED_MODULE_92__,
    json: _pink_dspMeta_json__WEBPACK_IMPORTED_MODULE_93__
  },
  rdiv: {
    module: _rdiv_dspModule_wasm__WEBPACK_IMPORTED_MODULE_94__,
    json: _rdiv_dspMeta_json__WEBPACK_IMPORTED_MODULE_95__
  },
  rect: {
    module: _rect_dspModule_wasm__WEBPACK_IMPORTED_MODULE_96__,
    json: _rect_dspMeta_json__WEBPACK_IMPORTED_MODULE_97__
  },
  rsub: {
    module: _rsub_dspModule_wasm__WEBPACK_IMPORTED_MODULE_98__,
    json: _rsub_dspMeta_json__WEBPACK_IMPORTED_MODULE_99__
  },
  sah: {
    module: _sah_dspModule_wasm__WEBPACK_IMPORTED_MODULE_100__,
    json: _sah_dspMeta_json__WEBPACK_IMPORTED_MODULE_101__
  },
  slide: {
    module: _slide_dspModule_wasm__WEBPACK_IMPORTED_MODULE_102__,
    json: _slide_dspMeta_json__WEBPACK_IMPORTED_MODULE_103__
  },
  smooth: {
    module: _smooth_dspModule_wasm__WEBPACK_IMPORTED_MODULE_104__,
    json: _smooth_dspMeta_json__WEBPACK_IMPORTED_MODULE_105__
  },
  sub: {
    module: _sub_dspModule_wasm__WEBPACK_IMPORTED_MODULE_106__,
    json: _sub_dspMeta_json__WEBPACK_IMPORTED_MODULE_107__
  },
  tri: {
    module: _tri_dspModule_wasm__WEBPACK_IMPORTED_MODULE_108__,
    json: _tri_dspMeta_json__WEBPACK_IMPORTED_MODULE_109__
  },
  _: {
    module: _dspModule_wasm__WEBPACK_IMPORTED_MODULE_110__,
    json: _dspMeta_json__WEBPACK_IMPORTED_MODULE_111__
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (map);


/***/ }),

/***/ "./src/FaustDspObject.ts":
/*!*******************************!*\
  !*** ./src/FaustDspObject.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FaustDspObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sdk */ "./src/sdk.ts");


class FaustDspObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
  constructor() {
    super(...arguments);
    this._ = {
      defaultInputs: [],
      constants: [],
      constantsConnected: [],
      argsOffset: 0
    };
  }
  get audioConnections() {
    return this.inletLines.map((set) => [...set].find((l) => !l.disabled && l.isConnectableByAudio)).map((l) => !!l);
  }
  checkAndFillUnconnected() {
    const { audioConnections } = this;
    const { constants, constantsConnected } = this._;
    if (!this.inlets)
      return;
    for (let i = 0; i < this.inlets; i++) {
      if (audioConnections[i] === constantsConnected[i])
        continue;
      const constant = constants[i];
      if (audioConnections[i]) {
        constant.offset.value = 0;
      } else if (!audioConnections[i] && !constantsConnected[i]) {
        constant.offset.value = this._.defaultInputs[i] || 0;
      }
      constantsConnected[i] = audioConnections[i];
    }
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      const meta = JSON.parse(this._.dspFactory.json);
      const { inputs, outputs } = meta;
      if (inputs) {
        const merger = this.audioCtx.createChannelMerger(inputs);
        this._.merger = merger;
        for (let i = 0; i < inputs; i++) {
          const constant = this.audioCtx.createConstantSource();
          this._.constants[i] = constant;
          constant.connect(merger, 0, i);
          this._.constantsConnected[i] = false;
        }
      }
      const splitter = this.audioCtx.createChannelSplitter(outputs);
      this._.splitter = splitter;
      this.inlets = inputs;
      this.outlets = outputs;
      this.disconnectAudio();
      this.inletAudioConnections = this._.constants.map((node) => ({ node: node.offset, index: 0 }));
      this.outletAudioConnections = new Array(outputs).fill(null).map((v, i) => ({ node: splitter, index: i }));
      this.connectAudio();
    });
    this.on("postInit", async () => {
      const { dspFactory, faustDspGenerator, dspId, constants, merger, splitter, argsOffset } = this._;
      const node = await faustDspGenerator.createNode(this.audioCtx, dspId, dspFactory);
      this._.node = node;
      this.checkAndFillUnconnected();
      merger == null ? void 0 : merger.connect(node);
      node.connect(splitter);
      constants.forEach((constant, i) => {
        var _a;
        const argValue = this.args[i - argsOffset];
        if (!this._.constantsConnected[i])
          constant.offset.value = typeof argValue === "number" ? +argValue : (_a = this._.defaultInputs[i]) != null ? _a : 0;
        constant.start();
      });
    });
    this.on("argsUpdated", () => {
      this._.constants.forEach((constant, i) => {
        var _a;
        const argValue = this.args[i - this._.argsOffset];
        if (!this._.constantsConnected[i])
          constant.offset.value = typeof argValue === "number" ? +argValue : (_a = this._.defaultInputs[i]) != null ? _a : 0;
      });
    });
    this.on("inlet", ({ inlet, data }) => {
      if (typeof data === "number") {
        if (this._.constants[inlet] && !this._.constantsConnected[inlet]) {
          const constant = this._.constants[inlet];
          constant.offset.value = constant.offset.value;
          constant.offset.linearRampToValueAtTime(data, this.audioCtx.currentTime + this.getProp("smoothInput"));
        }
      }
    });
    this.on("connectedInlet", () => this.checkAndFillUnconnected());
    this.on("disconnectedInlet", () => this.checkAndFillUnconnected());
    this.on("destroy", () => {
      const { constants, merger, splitter, node } = this._;
      constants.forEach((constant) => constant == null ? void 0 : constant.disconnect());
      merger == null ? void 0 : merger.disconnect();
      splitter == null ? void 0 : splitter.disconnect();
      node == null ? void 0 : node.disconnect();
      node == null ? void 0 : node.destroy();
    });
  }
}
FaustDspObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
FaustDspObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
FaustDspObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
FaustDspObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;
FaustDspObject.inlets = [{
  isHot: true,
  type: "signal",
  description: "audio input connection",
  varLength: true
}];
FaustDspObject.outlets = [{
  type: "signal",
  description: "audio output connection",
  varLength: true
}];
FaustDspObject.args = [{
  type: "number",
  optional: true,
  varLength: true,
  description: "Initial inputs",
  default: 0
}];
FaustDspObject.props = {
  smoothInput: {
    type: "number",
    description: "Linear interpolate to input values within a duration in seconds",
    default: 0
  }
};
FaustDspObject.UI = _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultUI;


/***/ }),

/***/ "./src/getDsps.ts":
/*!************************!*\
  !*** ./src/getDsps.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dsps_dsps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dsps/dsps */ "./dsps/dsps.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  const dsps = {};
  for (const dspId in _dsps_dsps__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    const { module: moduleUri, json } = _dsps_dsps__WEBPACK_IMPORTED_MODULE_0__["default"][dspId];
    const moduleRes = await fetch(moduleUri);
    const module = await WebAssembly.compileStreaming(moduleRes);
    dsps[dspId] = {
      module,
      json
    };
  }
  return dsps;
});


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "author": () => (/* binding */ author),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "description": () => (/* binding */ description),
/* harmony export */   "jspatcher": () => (/* binding */ jspatcher),
/* harmony export */   "keywords": () => (/* binding */ keywords),
/* harmony export */   "license": () => (/* binding */ license),
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
/* harmony import */ var _package_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./package-info */ "./src/package-info.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

const name = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"].name.split("/").pop().replace(/^package-/, "");
const { author, license, keywords, version, description, jspatcher } = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__spreadValues({ name, author, license, keywords, version, description }, jspatcher));


/***/ }),

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const json = __webpack_require__(/*! ../package.json */ "./package.json");
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSON.parse(json));


/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "PatcherAudio": () => (/* binding */ PatcherAudio),
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "isBang": () => (/* binding */ isBang)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  PatcherAudio,
  Patcher,
  Box,
  Line,
  BaseObject,
  BaseUI,
  DefaultObject,
  DefaultUI,
  generateRemotedObject,
  generateDefaultObject,
  generateRemoteObject,
  Bang,
  isBang
} = sdk;


/***/ }),

/***/ "./dsps/_/dspModule.wasm":
/*!*******************************!*\
  !*** ./dsps/_/dspModule.wasm ***!
  \*******************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACpGCgIAADoKAgIAAAAvUgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGaiAEIAZqKgIAOAIAIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6qDgIAAAQBBAAujA3sibmFtZSI6ICJfIiwiZmlsZW5hbWUiOiAiXyIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDEsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlc2NyaXB0aW9uIjogIkJ5cGFzcyBzaWduYWwiIH0seyAiZmlsZW5hbWUiOiAiXyIgfSx7ICJuYW1lIjogIl8iIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIl8iLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/abs/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/abs/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACpKCgIAADoKAgIAAAAvVgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGaiAEIAZqKgIAizgCACAGQQRqIQYgBkEEIAFsSARADAIMAQsLCwuFgICAAABBAQ8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARAAIAAgARAJC4KAgIAAAAuJgICAAABBACABNgIAC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuRg4CAAAEAQQALigN7Im5hbWUiOiAiYWJzIiwiZmlsZW5hbWUiOiAiYWJzIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYWJzIiB9LHsgIm5hbWUiOiAiYWJzIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJhYnMiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/acos/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/acos/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKOgICAAAEDZW52Bl9hY29zZgAAA4+AgIAADgECAwQFBgcICQoLDA0OBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACpOCgIAADoKAgIAAAAvWgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGaiAEIAZqKgIAEAA4AgAgBkEEaiEGIAZBBCABbEgEQAwCDAELCwsLhYCAgAAAQQEPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQASAAIAEQCguCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAkgABALIAAQCAuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLloOAgAABAEEAC48DeyJuYW1lIjogImFjb3MiLCJmaWxlbmFtZSI6ICJhY29zIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYWNvcyIgfSx7ICJuYW1lIjogImFjb3MiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImFjb3MiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/acosh/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/acosh/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKPgICAAAEDZW52B19hY29zaGYAAAOPgICAAA4BAgMEBQYHCAkKCwwNDgWMgICAAAEBgoCAgADqh4CAAAe6gYCAAAwHY29tcHV0ZQACDGdldE51bUlucHV0cwADDWdldE51bU91dHB1dHMABA1nZXRQYXJhbVZhbHVlAAUNZ2V0U2FtcGxlUmF0ZQAGBGluaXQABw1pbnN0YW5jZUNsZWFyAAgRaW5zdGFuY2VDb25zdGFudHMACQxpbnN0YW5jZUluaXQAChppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQALDXNldFBhcmFtVmFsdWUADgZtZW1vcnkCAAqTgoCAAA6CgICAAAAL1oCAgAABA39BACEEQQAhBUEAIQYgAkEAaigCACEEIANBAGooAgAhBUEAIQYDQAJAIAUgBmogBCAGaioCABAAOAIAIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAEgACABEAoLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAJIAAQCyAAEAgLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC/SFgIAAAQBBAAvtBXsibmFtZSI6ICJhY29zaCIsImZpbGVuYW1lIjogImFjb3NoIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21hdGgubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDEsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImFjb3NoIiB9LHsgIm1hdGgubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRoLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aC5saWIvZGVwcmVjYXRlZCI6ICJUaGlzIGxpYnJhcnkgaXMgZGVwcmVjYXRlZCBhbmQgaXMgbm90IG1haW50YWluZWQgYW55bW9yZS4gSXQgd2lsbCBiZSByZW1vdmVkIGluIEF1Z3VzdCAyMDE3LiIgfSx7ICJtYXRoLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aC5saWIvbmFtZSI6ICJNYXRoIExpYnJhcnkiIH0seyAibWF0aC5saWIvdmVyc2lvbiI6ICIxLjAiIH0seyAibmFtZSI6ICJhY29zaCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiYWNvc2giLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/add/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/add/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJI4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogImFkZCIsImZpbGVuYW1lIjogImFkZCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJhZGQiIH0seyAibmFtZSI6ICJhZGQiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImFkZCIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/adsr/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/adsr/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACteFgIAADoKAgIAAAAv0goCAAAIHfwN9QQAhBEEAIQVBACEGQQAhB0EAIQhBACEJQQAhCkMAAAAAIQtDAAAAACEMQwAAAAAhDSACQQBqKAIAIQQgAkEEaigCACEFIAJBCGooAgAhBiACQQxqKAIAIQcgAkEQaigCACEIIANBAGooAgAhCUEAIQoDQAJAIAQgCmoqAgAhC0EAIAs4AgBBACALQQAqAgxBACoCBCALYLKUkjgCCEMAAIA/QQAqAhQgBSAKaioCAJSXIQwgByAKaioCACENQQAgC0MAAAAAW0EAKAIcQQFqbDYCGCAJIApqQwAAAABBACoCCCAMlUMAAIA/IA2TIAxBACoCCJOUQwAAgD9BACoCFCAGIApqKgIAlJeVQwAAgD+SIA2XliANQQAoAhiylEMAAIA/QQAqAhQgCCAKaioCAJSXlZOXOAIAQQBBACoCADgCBEEAQQAqAgg4AgxBAEEAKAIYNgIcIApBBGohCiAKQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEFDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIQDwuOgICAAAAgACABEAAgACABEAkLkYGAgAABA39BACEBQQAhAkEAIQNBACEBA0ACQCABQQJ0QwAAAAA4AgAgAUEBaiEBIAFBAkgEQAwCDAELCwtBACECA0ACQEEIIAJBAnRqQwAAAAA4AgAgAkEBaiECIAJBAkgEQAwCDAELCwtBACEDA0ACQEEYIANBAnRqQQA2AgAgA0EBaiEDIANBAkgEQAwCDAELCwsLoICAgAAAQQAgATYCEEEAQwCAO0hDAACAP0EAKAIQspeWOAIUC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwu/ioCAAAEAQQALuAp7Im5hbWUiOiAiYWRzciIsImZpbGVuYW1lIjogImFkc3IiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9lbnZlbG9wZXMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAzMiwiY29kZSI6ICJnQT09IiwiaW5wdXRzIjogNSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlZmF1bHRJbnB1dHMiOiAiWzAsIDAsIDAsIDAuNzUsIDBdIiB9LHsgImRlc2NyaXB0aW9uIjogIkFEU1IgZW52ZWxvcGUgZ2VuZXJhdG9yIiB9LHsgImVudmVsb3Blcy5saWIvYWRzcjphdXRob3IiOiAiWWFubiBPcmxhcmV5IiB9LHsgImVudmVsb3Blcy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgImVudmVsb3Blcy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgImVudmVsb3Blcy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgImVudmVsb3Blcy5saWIvbmFtZSI6ICJGYXVzdCBFbnZlbG9wZSBMaWJyYXJ5IiB9LHsgImVudmVsb3Blcy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAiZmlsZW5hbWUiOiAiYWRzciIgfSx7ICJpbnB1dHNEZXNjcmlwdGlvbiI6ICJbYHRyaWdnZXJgLCBgYXR0YWNrIHRpbWUgKHNlYylgLCBgZGVjYXkgdGltZSAoc2VjKWAsIGBzdXN0YWluIGxldmVsIChiZXR3ZWVuIDAuLjEpYCwgYHJlbGVhc2UgdGltZSAoc2VjKWBdIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibmFtZSI6ICJhZHNyIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImFkc3IiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/allpass/dspModule.wasm":
/*!*************************************!*\
  !*** ./dsps/allpass/dspModule.wasm ***!
  \*************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAArJhICAAA6CgICAAAALvIKAgAACBn8FfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByADQQBqKAIAIQhBACEJA0ACQEEAKgIEQwAAAAAgBSAJaioCAJeUIQpDAAAAAEMAAABAIAoQAJSTQQAqAgyUIQtDAAAAPyAKEAFDbxKDOiAHIAlqKgIAl5WUIQxDAACAPyAMkyENIAxDAACAP5IhDkEAIAQgCWoqAgAgCyANQQAqAhCUkiAOlZM4AgggCCAJakEAKgIQIAtBACoCCCANlJIgDpWSOAIAQQBBACoCDDgCEEEAQQAqAgg4AgwgCUEEaiEJIAlBBCABbEgEQAwCDAELCwsLhYCAgAAAQQQPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQAiAAIAEQCwu1gICAAAEBf0EAIQFBACEBA0ACQEEIIAFBAnRqQwAAAAA4AgAgAUEBaiEBIAFBA0gEQAwCDAELCwsLpoCAgAAAQQAgATYCAEEAQ9sPyUBDAIA7SEMAAIA/QQAoAgCyl5aVOAIEC5CAgIAAACAAIAEQCiAAEAwgABAJC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvkiICAAAEAQQAL3Qh7Im5hbWUiOiAiYWxscGFzcyIsImZpbGVuYW1lIjogImFsbHBhc3MiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3QvbWF4bXNwLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvbWF0aHMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9wbGF0Zm9ybS5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMjAsImlucHV0cyI6IDQsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJBbGwgUGFzcyBGaWx0ZXIiIH0seyAiZmlsZW5hbWUiOiAiYWxscGFzcyIgfSx7ICJpbnB1dHNEZXNjcmlwdGlvbiI6ICJbYGAsIGBmMGAsIGBnYWluIGluIGRCYCwgYFFgXSIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi4zIiB9LHsgIm1heG1zcC5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1heG1zcC5saWIvbmFtZSI6ICJNYXhNU1AgY29tcGF0aWJpbGl0eSBMaWJyYXJ5IiB9LHsgIm1heG1zcC5saWIvdmVyc2lvbiI6ICIxLjEiIH0seyAibmFtZSI6ICJhbGxwYXNzIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImFsbHBhc3MiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/ar/dspModule.wasm":
/*!********************************!*\
  !*** ./dsps/ar/dspModule.wasm ***!
  \********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACsWEgIAADoKAgIAAAAuTgoCAAAIFfwN9QQAhBEEAIQVBACEGQQAhB0EAIQhDAAAAACEJQwAAAAAhCkMAAAAAIQsgAkEAaigCACEEIAJBBGooAgAhBSACQQhqKAIAIQYgA0EAaigCACEHQQAhCANAAkAgBCAIaioCACEJQQAgCTgCAEEAQQAoAgxBACgCDEEASmogCUEAKgIEX2wgCUEAKgIEXmo2AghBACgCCLIhCkMAAIA/QQAqAhQgBSAIaioCAJSXIQsgByAIakMAAAAAIAogC5UgCyAKk0MAAIA/QQAqAhQgBiAIaioCAJSXlUMAAIA/kpaXOAIAQQBBACoCADgCBEEAQQAoAgg2AgwgCEEEaiEIIAhBBCABbEgEQAwCDAELCwsLhYCAgAAAQQMPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAhAPC46AgIAAACAAIAEQACAAIAEQCQvggICAAAECf0EAIQFBACECQQAhAQNAAkAgAUECdEMAAAAAOAIAIAFBAWohASABQQJIBEAMAgwBCwsLQQAhAgNAAkBBCCACQQJ0akEANgIAIAJBAWohAiACQQJIBEAMAgwBCwsLC6CAgIAAAEEAIAE2AhBBAEMAgDtIQwAAgD9BACgCELKXljgCFAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLgYqAgAABAEEAC/oJeyJuYW1lIjogImFyIiwiZmlsZW5hbWUiOiAiYXIiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9lbnZlbG9wZXMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAyNCwiaW5wdXRzIjogMywib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlZmF1bHRJbnB1dHMiOiAiWzAsIDAuNzVdIiB9LHsgImRlc2NyaXB0aW9uIjogIkF0dGFjay1SZWxlYXNlIGVudmVsb3BlIGdlbmVyYXRvciIgfSx7ICJlbnZlbG9wZXMubGliL2FyOmF1dGhvciI6ICJZYW5uIE9ybGFyZXksIFN0w6lwaGFuZSBMZXR6IiB9LHsgImVudmVsb3Blcy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgImVudmVsb3Blcy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgImVudmVsb3Blcy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgImVudmVsb3Blcy5saWIvbmFtZSI6ICJGYXVzdCBFbnZlbG9wZSBMaWJyYXJ5IiB9LHsgImVudmVsb3Blcy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAiZmlsZW5hbWUiOiAiYXIiIH0seyAiaW5wdXRzRGVzY3JpcHRpb24iOiAiW2B0cmlnZ2VyYCwgYGF0dGFjayB0aW1lIChzZWMpYCwgYHJlbGVhc2UgdGltZSAoc2VjKWBdIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibmFtZSI6ICJhciIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJhciIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/asin/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/asin/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKOgICAAAEDZW52Bl9hc2luZgAAA4+AgIAADgECAwQFBgcICQoLDA0OBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACpOCgIAADoKAgIAAAAvWgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGaiAEIAZqKgIAEAA4AgAgBkEEaiEGIAZBBCABbEgEQAwCDAELCwsLhYCAgAAAQQEPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQASAAIAEQCguCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAkgABALIAAQCAuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLloOAgAABAEEAC48DeyJuYW1lIjogImFzaW4iLCJmaWxlbmFtZSI6ICJhc2luIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYXNpbiIgfSx7ICJuYW1lIjogImFzaW4iIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImFzaW4iLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/asinh/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/asinh/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKPgICAAAEDZW52B19hc2luaGYAAAOPgICAAA4BAgMEBQYHCAkKCwwNDgWMgICAAAEBgoCAgADqh4CAAAe6gYCAAAwHY29tcHV0ZQACDGdldE51bUlucHV0cwADDWdldE51bU91dHB1dHMABA1nZXRQYXJhbVZhbHVlAAUNZ2V0U2FtcGxlUmF0ZQAGBGluaXQABw1pbnN0YW5jZUNsZWFyAAgRaW5zdGFuY2VDb25zdGFudHMACQxpbnN0YW5jZUluaXQAChppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQALDXNldFBhcmFtVmFsdWUADgZtZW1vcnkCAAqTgoCAAA6CgICAAAAL1oCAgAABA39BACEEQQAhBUEAIQYgAkEAaigCACEEIANBAGooAgAhBUEAIQYDQAJAIAUgBmogBCAGaioCABAAOAIAIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAEgACABEAoLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAJIAAQCyAAEAgLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC/SFgIAAAQBBAAvtBXsibmFtZSI6ICJhc2luaCIsImZpbGVuYW1lIjogImFzaW5oIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21hdGgubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDEsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImFzaW5oIiB9LHsgIm1hdGgubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRoLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aC5saWIvZGVwcmVjYXRlZCI6ICJUaGlzIGxpYnJhcnkgaXMgZGVwcmVjYXRlZCBhbmQgaXMgbm90IG1haW50YWluZWQgYW55bW9yZS4gSXQgd2lsbCBiZSByZW1vdmVkIGluIEF1Z3VzdCAyMDE3LiIgfSx7ICJtYXRoLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aC5saWIvbmFtZSI6ICJNYXRoIExpYnJhcnkiIH0seyAibWF0aC5saWIvdmVyc2lvbiI6ICIxLjAiIH0seyAibmFtZSI6ICJhc2luaCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiYXNpbmgiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/atan2/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/atan2/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ9fQF9YAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACj4CAgAABA2VudgdfYXRhbjJmAAADj4CAgAAOAQIDBAUGBwgJCgsMDQ4FjICAgAABAYKAgIAA6oeAgAAHuoGAgAAMB2NvbXB1dGUAAgxnZXROdW1JbnB1dHMAAw1nZXROdW1PdXRwdXRzAAQNZ2V0UGFyYW1WYWx1ZQAFDWdldFNhbXBsZVJhdGUABgRpbml0AAcNaW5zdGFuY2VDbGVhcgAIEWluc3RhbmNlQ29uc3RhbnRzAAkMaW5zdGFuY2VJbml0AAoaaW5zdGFuY2VSZXNldFVzZXJJbnRlcmZhY2UACw1zZXRQYXJhbVZhbHVlAA4GbWVtb3J5AgAKqYKAgAAOgoCAgAAAC+yAgIAAAQR/QQAhBEEAIQVBACEGQQAhByACQQBqKAIAIQQgAkEEaigCACEFIANBAGooAgAhBkEAIQcDQAJAIAYgB2ogBCAHaioCACAFIAdqKgIAEAA4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQASAAIAEQCguCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAkgABALIAAQCAuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLm4OAgAABAEEAC5QDeyJuYW1lIjogImF0YW4yIiwiZmlsZW5hbWUiOiAiYXRhbjIiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJhdGFuMiIgfSx7ICJuYW1lIjogImF0YW4yIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJhdGFuMiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/atan/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/atan/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKOgICAAAEDZW52Bl9hdGFuZgAAA4+AgIAADgECAwQFBgcICQoLDA0OBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACpOCgIAADoKAgIAAAAvWgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGaiAEIAZqKgIAEAA4AgAgBkEEaiEGIAZBBCABbEgEQAwCDAELCwsLhYCAgAAAQQEPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQASAAIAEQCguCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAkgABALIAAQCAuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLloOAgAABAEEAC48DeyJuYW1lIjogImF0YW4iLCJmaWxlbmFtZSI6ICJhdGFuIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYXRhbiIgfSx7ICJuYW1lIjogImF0YW4iIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImF0YW4iLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/atanh/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/atanh/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAF9AX1gAn9/AGAEf39/fwBgAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AAKPgICAAAEDZW52B19hdGFuaGYAAAOPgICAAA4BAgMEBQYHCAkKCwwNDgWMgICAAAEBgoCAgADqh4CAAAe6gYCAAAwHY29tcHV0ZQACDGdldE51bUlucHV0cwADDWdldE51bU91dHB1dHMABA1nZXRQYXJhbVZhbHVlAAUNZ2V0U2FtcGxlUmF0ZQAGBGluaXQABw1pbnN0YW5jZUNsZWFyAAgRaW5zdGFuY2VDb25zdGFudHMACQxpbnN0YW5jZUluaXQAChppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQALDXNldFBhcmFtVmFsdWUADgZtZW1vcnkCAAqTgoCAAA6CgICAAAAL1oCAgAABA39BACEEQQAhBUEAIQYgAkEAaigCACEEIANBAGooAgAhBUEAIQYDQAJAIAUgBmogBCAGaioCABAAOAIAIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAEgACABEAoLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAJIAAQCyAAEAgLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC/SFgIAAAQBBAAvtBXsibmFtZSI6ICJhdGFuaCIsImZpbGVuYW1lIjogImF0YW5oIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21hdGgubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDEsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImF0YW5oIiB9LHsgIm1hdGgubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRoLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aC5saWIvZGVwcmVjYXRlZCI6ICJUaGlzIGxpYnJhcnkgaXMgZGVwcmVjYXRlZCBhbmQgaXMgbm90IG1haW50YWluZWQgYW55bW9yZS4gSXQgd2lsbCBiZSByZW1vdmVkIGluIEF1Z3VzdCAyMDE3LiIgfSx7ICJtYXRoLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aC5saWIvbmFtZSI6ICJNYXRoIExpYnJhcnkiIH0seyAibWF0aC5saWIvdmVyc2lvbiI6ICIxLjAiIH0seyAibmFtZSI6ICJhdGFuaCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiYXRhbmgiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/atodb/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/atodb/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAX0BfWACf38Bf2ACf38Bf2ADf399AAKPgICAAAEDZW52B19sb2cxMGYACwOPgICAAA4AAQIDBAUGBwgJCgwNDgWMgICAAAEBgoCAgADqh4CAAAe6gYCAAAwHY29tcHV0ZQACDGdldE51bUlucHV0cwADDWdldE51bU91dHB1dHMABA1nZXRQYXJhbVZhbHVlAAUNZ2V0U2FtcGxlUmF0ZQAGBGluaXQABw1pbnN0YW5jZUNsZWFyAAgRaW5zdGFuY2VDb25zdGFudHMACQxpbnN0YW5jZUluaXQAChppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQALDXNldFBhcmFtVmFsdWUADgZtZW1vcnkCAAqZgoCAAA6CgICAAAAL3ICAgAABA39BACEEQQAhBUEAIQYgAkEAaigCACEEIANBAGooAgAhBUEAIQYDQAJAIAUgBmpDAACgQSAEIAZqKgIAEACUOAIAIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAEgACABEAoLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAJIAAQCyAAEAgLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC8CEgIAAAQBBAAu5BHsibmFtZSI6ICJhdG9kYiIsImZpbGVuYW1lIjogImF0b2RiIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L3N0ZGZhdXN0LmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvYmFzaWNzLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAxLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYmFzaWNzLmxpYi9uYW1lIjogIkZhdXN0IEJhc2ljIEVsZW1lbnQgTGlicmFyeSIgfSx7ICJiYXNpY3MubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYXRvZGIiIH0seyAibmFtZSI6ICJhdG9kYiIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiYXRvZGIiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/bandpass/dspModule.wasm":
/*!**************************************!*\
  !*** ./dsps/bandpass/dspModule.wasm ***!
  \**************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAArshICAAA6CgICAAAAL34KAgAACBn8GfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOQwAAAAAhDyACQQBqKAIAIQQgAkEEaigCACEFIAJBCGooAgAhBiACQQxqKAIAIQcgA0EAaigCACEIQQAhCQNAAkBBACoCBEMAAAAAIAUgCWoqAgCXlCEKIAoQASELQ28SgzogByAJaioCAJchDEMAAAA/IAsgDJWUIQ0gDUMAAIA/kiEOQQAgBCAJaioCAEMAAAAAQwAAAEAgChAAlJNBACoCDJRDAACAPyANk0EAKgIQlJIgDpWTOAIIIAwgDpQhDyAIIAlqQwAAAD9BACoCCCALlCAPlZRBACoCEEMAAAAAQwAAAD8gCyAPlZSTlJI4AgBBAEEAKgIMOAIQQQBBACoCCDgCDCAJQQRqIQkgCUEEIAFsSARADAIMAQsLCwuFgICAAABBBA8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARACIAAgARALC7WAgIAAAQF/QQAhAUEAIQEDQAJAQQggAUECdGpDAAAAADgCACABQQFqIQEgAUEDSARADAIMAQsLCwumgICAAABBACABNgIAQQBD2w/JQEMAgDtIQwAAgD9BACgCALKXlpU4AgQLkICAgAAAIAAgARAKIAAQDCAAEAkLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC+qIgIAAAQBBAAvjCHsibmFtZSI6ICJiYW5kcGFzcyIsImZpbGVuYW1lIjogImJhbmRwYXNzIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21heG1zcC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDIwLCJpbnB1dHMiOiA0LCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZGVzY3JpcHRpb24iOiAiQmFuZCBQYXNzIEZpbHRlciIgfSx7ICJmaWxlbmFtZSI6ICJiYW5kcGFzcyIgfSx7ICJpbnB1dHNEZXNjcmlwdGlvbiI6ICJbYGAsIGBmMGAsIGBnYWluIGluIGRCYCwgYFFgXSIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi4zIiB9LHsgIm1heG1zcC5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1heG1zcC5saWIvbmFtZSI6ICJNYXhNU1AgY29tcGF0aWJpbGl0eSBMaWJyYXJ5IiB9LHsgIm1heG1zcC5saWIvdmVyc2lvbiI6ICIxLjEiIH0seyAibmFtZSI6ICJiYW5kcGFzcyIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJiYW5kcGFzcyIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/biquad/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/biquad/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACuqDgIAADoKAgIAAAAv9gYCAAAEIf0EAIQRBACEFQQAhBkEAIQdBACEIQQAhCUEAIQpBACELIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByACQRBqKAIAIQggAkEUaigCACEJIANBAGooAgAhCkEAIQsDQAJAQQAgBCALaioCACAIIAtqKgIAQQAqAgSUIAkgC2oqAgBBACoCCJSSkzgCACAKIAtqIAUgC2oqAgBBACoCAJQgBiALaioCAEEAKgIElJIgByALaioCAEEAKgIIlJI4AgBBAEEAKgIEOAIIQQBBACoCADgCBCALQQRqIQsgC0EEIAFsSARADAIMAQsLCwuFgICAAABBBg8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCDA8LjoCAgAAAIAAgARAAIAAgARAJC7KAgIAAAQF/QQAhAUEAIQEDQAJAIAFBAnRDAAAAADgCACABQQFqIQEgAUEDSARADAIMAQsLCwuJgICAAABBACABNgIMC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuThoCAAAEAQQALjAZ7Im5hbWUiOiAiYmlxdWFkIiwiZmlsZW5hbWUiOiAiYmlxdWFkIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21heG1zcC5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMTYsImlucHV0cyI6IDYsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJCaXF1YWQgRmlsdGVyIiB9LHsgImZpbGVuYW1lIjogImJpcXVhZCIgfSx7ICJpbnB1dHNEZXNjcmlwdGlvbiI6ICJbYGAsIGBhMGAsIGBhMWAsIGBhMmAsIGBiMWAsIGBiMmBdIiB9LHsgIm1heG1zcC5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1heG1zcC5saWIvbmFtZSI6ICJNYXhNU1AgY29tcGF0aWJpbGl0eSBMaWJyYXJ5IiB9LHsgIm1heG1zcC5saWIvdmVyc2lvbiI6ICIxLjEiIH0seyAibmFtZSI6ICJiaXF1YWQiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImJpcXVhZCIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/bitand/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/bitand/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACquCgIAADoKAgIAAAAvugICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgCoIAUgB2oqAgCocbI4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLtoOAgAABAEEAC68DeyJuYW1lIjogImJpdGFuZCIsImZpbGVuYW1lIjogImJpdGFuZCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJiaXRhbmQiIH0seyAibmFtZSI6ICJiaXRhbmQiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImJpdGFuZCIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/bitor/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/bitor/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACquCgIAADoKAgIAAAAvugICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgCoIAUgB2oqAgCocrI4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLsYOAgAABAEEAC6oDeyJuYW1lIjogImJpdG9yIiwiZmlsZW5hbWUiOiAiYml0b3IiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiYml0b3IiIH0seyAibmFtZSI6ICJiaXRvciIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiYml0b3IiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/bitxor/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/bitxor/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACquCgIAADoKAgIAAAAvugICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgCoIAUgB2oqAgCoc7I4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLtoOAgAABAEEAC68DeyJuYW1lIjogImJpdHhvciIsImZpbGVuYW1lIjogImJpdHhvciIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJiaXR4b3IiIH0seyAibmFtZSI6ICJiaXR4b3IiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImJpdHhvciIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/change/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/change/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACoCDgIAADoKAgIAAAAuTgYCAAAIDfwJ9QQAhBEEAIQVBACEGQwAAAAAhB0MAAAAAIQggAkEAaigCACEEIANBAGooAgAhBUEAIQYDQAJAIAQgBmoqAgAhB0EAIAc4AgAgB0EAKgIEkyEIIAUgBmogCEMAAAAAXiAIQwAAAABda7I4AgBBAEEAKgIAOAIEIAZBBGohBiAGQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEBDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIIDwuOgICAAAAgACABEAAgACABEAkLsoCAgAABAX9BACEBQQAhAQNAAkAgAUECdEMAAAAAOAIAIAFBAWohASABQQJIBEAMAgwBCwsLC4mAgIAAAEEAIAE2AggLkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6GDgIAAAQBBAAuaA3sibmFtZSI6ICJjaGFuZ2UiLCJmaWxlbmFtZSI6ICJjaGFuZ2UiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAxMiwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiY2hhbmdlIiB9LHsgIm5hbWUiOiAiY2hhbmdlIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJjaGFuZ2UiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/cycle/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/cycle/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBkICAgAD4h4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAAqVhoCAAA6jgoCAAAEEf0EAIQNBACEFQQAhAkEAIQIDQAJAQZCAICACQQJ0akEANgIAIAJBAWohAiACQQJIBEAMAgwBCwsLQQAhAwNAAkBBAEEAKAKUgCBBAWo2ApCAICADQQJ0Q9sPyThBACgCkIAgQX9qspQQATgCAEEAQQAoApCAIDYClIAgIANBAWohAyADQYCABEgEQAwCDAELCwtBACEEQQAhBANAAkBBmIAgIARBAnRqQQA2AgAgBEEBaiEEIARBAkgEQAwCDAELCwtBACEFA0ACQEEAQQAoApyAIEEBajYCmIAgQYCAECAFQQJ0akPbD8k4QQAoApiAIEF/arKUEAA4AgBBAEEAKAKYgCA2ApyAICAFQQFqIQUgBUGAgARIBEAMAgwBCwsLC92BgIAAAgV/An1BACEEQQAhBUEAIQZBACEHQwAAAAAhCUMAAAAAIQpBACEIIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkAgBSAHaioCACEJQQAqAoyAIEEAKgKEgCAgBCAHaioCAJSSIQpBACAKIAqOkzgCiIAgQwAAgEdBACoCiIAglKghCCAGIAdqIAkQACAIQQJ0KgIAlCAJEAFBgIAQIAhBAnRqKgIAlJI4AgBBAEEAKgKIgCA4AoyAICAHQQRqIQcgB0EEIAFsSARADAIMAQsLCwuFgICAAABBAg8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuKgICAAABBACgCgIAgDwuOgICAAAAgACABEAIgACABEAsLt4CAgAABAX9BACEBQQAhAQNAAkBBiIAgIAFBAnRqQwAAAAA4AgAgAUEBaiEBIAFBAkgEQAwCDAELCwsLrICAgAAAQQAgATYCgIAgQQBDAACAP0MAgDtIQwAAgD9BACgCgIAgspeWlTgChIAgC5CAgIAAACAAIAEQCiAAEAwgABAJC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuDiYCAAAEAQQAL/Ah7Im5hbWUiOiAiY3ljbGUiLCJmaWxlbmFtZSI6ICJjeWNsZSIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9zdGRmYXVzdC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L29zY2lsbGF0b3JzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L2Jhc2ljcy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNTI0MzIwLCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYmFzaWNzLmxpYi9uYW1lIjogIkZhdXN0IEJhc2ljIEVsZW1lbnQgTGlicmFyeSIgfSx7ICJiYXNpY3MubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZGVzY3JpcHRpb24iOiAiQSBzaW5lIHdhdmUgZ2VuZXJhdG9yIHdpdGggY29udHJvbGxhYmxlIHBoYXNlIiB9LHsgImZpbGVuYW1lIjogImN5Y2xlIiB9LHsgImlucHV0c0Rlc2NyaXB0aW9uIjogIltgZnJlcWAsIGBwaGFzZWBdIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibmFtZSI6ICJjeWNsZSIgfSx7ICJvc2NpbGxhdG9ycy5saWIvbmFtZSI6ICJGYXVzdCBPc2NpbGxhdG9yIExpYnJhcnkiIH0seyAib3NjaWxsYXRvcnMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImN5Y2xlIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/dbtoa/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/dbtoa/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gAn19AX1gA39/fQACjYCAgAABA2VudgVfcG93ZgANA4+AgIAADgABAgMEBQYHCAkKCwwOBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACp6CgIAADoKAgIAAAAvhgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGakMAACBBQ83MTD0gBCAGaioCAJQQADgCACAGQQRqIQYgBkEEIAFsSARADAIMAQsLCwuFgICAAABBAQ8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARABIAAgARAKC4KAgIAAAAuJgICAAABBACABNgIAC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvAhICAAAEAQQALuQR7Im5hbWUiOiAiZGJ0b2EiLCJmaWxlbmFtZSI6ICJkYnRvYSIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9zdGRmYXVzdC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L2Jhc2ljcy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImJhc2ljcy5saWIvbmFtZSI6ICJGYXVzdCBCYXNpYyBFbGVtZW50IExpYnJhcnkiIH0seyAiYmFzaWNzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImRidG9hIiB9LHsgIm5hbWUiOiAiZGJ0b2EiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImRidG9hIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/dcblocker/dspModule.wasm":
/*!***************************************!*\
  !*** ./dsps/dcblocker/dspModule.wasm ***!
  \***************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACraDgIAADoKAgIAAAAuYgYCAAAIDfwF9QQAhBEEAIQVBACEGQwAAAAAhByACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBCAGaioCACEHQQAgBzgCAEEAIAdDUrh+P0EAKgIMlJJBACoCBJM4AgggBSAGakEAKgIIOAIAQQBBACoCADgCBEEAQQAqAgg4AgwgBkEEaiEGIAZBBCABbEgEQAwCDAELCwsLhYCAgAAAQQEPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAhAPC46AgIAAACAAIAEQACAAIAEQCQvjgICAAAECf0EAIQFBACECQQAhAQNAAkAgAUECdEMAAAAAOAIAIAFBAWohASABQQJIBEAMAgwBCwsLQQAhAgNAAkBBCCACQQJ0akMAAAAAOAIAIAJBAWohAiACQQJIBEAMAgwBCwsLC4mAgIAAAEEAIAE2AhALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC/2LgIAAAQBBAAv2C3sibmFtZSI6ICJkY2Jsb2NrZXIiLCJmaWxlbmFtZSI6ICJkY2Jsb2NrZXIiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9maWx0ZXJzLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAyMCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZGVzY3JpcHRpb24iOiAiREMgYmxvY2tlci4gRGVmYXVsdCBkYyBibG9ja2VyIGhhcyAtM2RCIHBvaW50IG5lYXIgMzUgSHogKGF0IDQ0LjEga0h6KSBhbmQgaGlnaC1mcmVxdWVuY3kgZ2FpbiBuZWFyIDEuMDAyNSAoZHVlIHRvIG5vIHNjYWxpbmcpLiIgfSx7ICJmaWxlbmFtZSI6ICJkY2Jsb2NrZXIiIH0seyAiZmlsdGVycy5saWIvZGNibG9ja2VyOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL2RjYmxvY2tlcjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvZGNibG9ja2VyOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi9sb3dwYXNzMF9oaWdocGFzczEiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvbmFtZSI6ICJGYXVzdCBGaWx0ZXJzIExpYnJhcnkiIH0seyAiZmlsdGVycy5saWIvcG9sZTphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJmaWx0ZXJzLmxpYi9wb2xlOmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9wb2xlOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi92ZXJzaW9uIjogIjAuMyIgfSx7ICJmaWx0ZXJzLmxpYi96ZXJvOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL3plcm86Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL3plcm86bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgIm5hbWUiOiAiZGNibG9ja2VyIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJkY2Jsb2NrZXIiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/distort/dspModule.wasm":
/*!*************************************!*\
  !*** ./dsps/distort/dspModule.wasm ***!
  \*************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACtmCgIAADoKAgIAAAAucgYCAAAIEfwJ9QQAhBEEAIQVBACEGQQAhB0MAAAAAIQhDAAAAACEJIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkAgBCAHaioCACEIIAUgB2oqAgBDAACAv5chCSAGIAdqIAggCUMAAIA/kpQgCSAIi5RDAACAP5KVOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC7eEgIAAAQBBAAuwBHsibmFtZSI6ICJkaXN0b3J0IiwiZmlsZW5hbWUiOiAiZGlzdG9ydCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJTaW1wbGUgc29mdCBkaXN0b3J0aW9uICgoMSArIGEpICogeCkgLyAoMSArIGEgKiB8eHwpIiB9LHsgImZpbGVuYW1lIjogImRpc3RvcnQiIH0seyAiaW5wdXRzRGVzY3JpcHRpb24iOiAiW2BgLCBgRmFjdG9yICg+PSAtMSlgXSIgfSx7ICJuYW1lIjogImRpc3RvcnQiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImRpc3RvcnQiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/div/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/div/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJU4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogImRpdiIsImZpbGVuYW1lIjogImRpdiIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJkaXYiIH0seyAibmFtZSI6ICJkaXYiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImRpdiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/eq/dspModule.wasm":
/*!********************************!*\
  !*** ./dsps/eq/dspModule.wasm ***!
  \********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAFuyOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6KDgIAAAQBBAAubA3sibmFtZSI6ICJlcSIsImZpbGVuYW1lIjogImVxIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImVxIiB9LHsgIm5hbWUiOiAiZXEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImVxIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/filtercoeff/dspModule.wasm":
/*!*****************************************!*\
  !*** ./dsps/filtercoeff/dspModule.wasm ***!
  \*****************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACu+BgIAADoKAgIAAAAuygICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSACQQhqKAIAIQYLhYCAgAAAQQMPC4WAgIAAAEEADwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLtIWAgAABAEEAC60FeyJuYW1lIjogImZpbHRlcmNvZWZmIiwiZmlsZW5hbWUiOiAiZmlsdGVyY29lZmYiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3QvbWF4bXNwLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAzLCJvdXRwdXRzIjogMCwibWV0YSI6IFsgeyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJmaWx0ZXJjb2VmZiIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAiZmlsdGVyY29lZmYiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImZpbHRlcmNvZWZmIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/ftom/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/ftom/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAX0BfWACf38Bf2ACf38Bf2ADf399AAKNgICAAAEDZW52BV9sb2dmAAsDj4CAgAAOAAECAwQFBgcICQoMDQ4FjICAgAABAYKAgIAA6oeAgAAHuoGAgAAMB2NvbXB1dGUAAgxnZXROdW1JbnB1dHMAAw1nZXROdW1PdXRwdXRzAAQNZ2V0UGFyYW1WYWx1ZQAFDWdldFNhbXBsZVJhdGUABgRpbml0AAcNaW5zdGFuY2VDbGVhcgAIEWluc3RhbmNlQ29uc3RhbnRzAAkMaW5zdGFuY2VJbml0AAoaaW5zdGFuY2VSZXNldFVzZXJJbnRlcmZhY2UACw1zZXRQYXJhbVZhbHVlAA4GbWVtb3J5AgAKpYKAgAAOgoCAgAAAC+iAgIAAAQN/QQAhBEEAIQVBACEGIAJBAGooAgAhBCADQQBqKAIAIQVBACEGA0ACQCAFIAZqQ6x/ikFDCfIUOyAEIAZqKgIAlBAAlEMAAIpCkjgCACAGQQRqIQYgBkEEIAFsSARADAIMAQsLCwuFgICAAABBAQ8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARABIAAgARAKC4KAgIAAAAuJgICAAABBACABNgIAC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuUhoCAAAEAQQALjQZ7Im5hbWUiOiAiZnRvbSIsImZpbGVuYW1lIjogImZ0b20iLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9iYXNpY3MubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMSwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImJhc2ljcy5saWIvbmFtZSI6ICJGYXVzdCBCYXNpYyBFbGVtZW50IExpYnJhcnkiIH0seyAiYmFzaWNzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogImZ0b20iIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJuYW1lIjogImZ0b20iIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImZ0b20iLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/geq/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/geq/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAGCyOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6eDgIAAAQBBAAugA3sibmFtZSI6ICJnZXEiLCJmaWxlbmFtZSI6ICJnZXEiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiZ2VxIiB9LHsgIm5hbWUiOiAiZ2VxIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJnZXEiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/gtr/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/gtr/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAF6yOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6eDgIAAAQBBAAugA3sibmFtZSI6ICJndHIiLCJmaWxlbmFtZSI6ICJndHIiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAiZ3RyIiB9LHsgIm5hbWUiOiAiZ3RyIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJndHIiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/highpass/dspModule.wasm":
/*!**************************************!*\
  !*** ./dsps/highpass/dspModule.wasm ***!
  \**************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAArqhICAAA6CgICAAAAL3YKAgAACBn8FfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByADQQBqKAIAIQhBACEJA0ACQEEAKgIEQwAAAAAgBSAJaioCAJeUIQogChAAIQtDAAAAPyAKEAFDbxKDOiAHIAlqKgIAl5WUIQwgDEMAAIA/kiENQQAgBCAJaioCAEMAAAAAQwAAAEAgC5STQQAqAgyUQwAAgD8gDJNBACoCEJSSIA2VkzgCCCALQwAAgD+SIQ4gCCAJakEAKgIMQwAAgL8gC5OUQwAAAD9BACoCCCAOlJSSQwAAAD8gDkEAKgIQlJSSIA2VOAIAQQBBACoCDDgCEEEAQQAqAgg4AgwgCUEEaiEJIAlBBCABbEgEQAwCDAELCwsLhYCAgAAAQQQPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQAiAAIAEQCwu1gICAAAEBf0EAIQFBACEBA0ACQEEIIAFBAnRqQwAAAAA4AgAgAUEBaiEBIAFBA0gEQAwCDAELCwsLpoCAgAAAQQAgATYCAEEAQ9sPyUBDAIA7SEMAAIA/QQAoAgCyl5aVOAIEC5CAgIAAACAAIAEQCiAAEAwgABAJC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvqiICAAAEAQQAL4wh7Im5hbWUiOiAiaGlnaHBhc3MiLCJmaWxlbmFtZSI6ICJoaWdocGFzcyIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9tYXhtc3AubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAyMCwiaW5wdXRzIjogNCwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlc2NyaXB0aW9uIjogIkhpZ2ggUGFzcyBGaWx0ZXIiIH0seyAiZmlsZW5hbWUiOiAiaGlnaHBhc3MiIH0seyAiaW5wdXRzRGVzY3JpcHRpb24iOiAiW2BgLCBgZjBgLCBgZ2FpbiBpbiBkQmAsIGBRYF0iIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAiaGlnaHBhc3MiIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMSIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiaGlnaHBhc3MiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/highshelf/dspModule.wasm":
/*!***************************************!*\
  !*** ./dsps/highshelf/dspModule.wasm ***!
  \***************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB24CAgAARYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ACfX0BfWADf399AGABfQF9AqWAgIAAAwNlbnYFX2Nvc2YAAgNlbnYFX3Bvd2YADgNlbnYFX3NpbmYAEAOPgICAAA4AAQMEBQYHCAkKCwwNDwWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQAEDGdldE51bUlucHV0cwAFDWdldE51bU91dHB1dHMABg1nZXRQYXJhbVZhbHVlAAcNZ2V0U2FtcGxlUmF0ZQAIBGluaXQACQ1pbnN0YW5jZUNsZWFyAAoRaW5zdGFuY2VDb25zdGFudHMACwxpbnN0YW5jZUluaXQADBppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQANDXNldFBhcmFtVmFsdWUAEAZtZW1vcnkCAArYhYCAAA6CgICAAAALy4OAgAACBn8IfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOQwAAAAAhD0MAAAAAIRBDAAAAACERIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByADQQBqKAIAIQhBACEJA0ACQEMAACBBQ83MzDwgBiAJaioCAJQQASEKQQAqAgRDAAAAACAFIAlqKgIAl5QhCyALEAAhDCAKQwAAgL+SIAyUIQ0gCpEgCxAClENvEoM6IAcgCWoqAgCXlSEOIApDAACAP5IgDJQhDyAKIA6SQwAAgD8gDZOSIRBBACAEIAlqKgIAIApDAACAPyANIA6Sk5JBACoCEJRDAAAAQCAKQwAAgL8gD5OSQQAqAgyUlJIgEJWTOAIIIAogDZIhESAIIAlqQQAqAgggCpQgESAOkkMAAIA/kpRBACoCDEMAAAAAQwAAAEAgCpSTlCAKIA+SQwAAgL+SlJIgCkEAKgIQlCARQwAAgD8gDpOSlJIgEJU4AgBBAEEAKgIMOAIQQQBBACoCCDgCDCAJQQRqIQkgCUEEIAFsSARADAIMAQsLCwuFgICAAABBBA8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARADIAAgARAMC7WAgIAAAQF/QQAhAUEAIQEDQAJAQQggAUECdGpDAAAAADgCACABQQFqIQEgAUEDSARADAIMAQsLCwumgICAAABBACABNgIAQQBD2w/JQEMAgDtIQwAAgD9BACgCALKXlpU4AgQLkICAgAAAIAAgARALIAAQDSAAEAoLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC5CIgIAAAQBBAAuJCHsibmFtZSI6ICJoaWdoc2hlbGYiLCJmaWxlbmFtZSI6ICJoaWdoc2hlbGYiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3QvbWF4bXNwLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvbWF0aHMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9wbGF0Zm9ybS5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMjAsImlucHV0cyI6IDQsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJoaWdoc2hlbGYiIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAiaGlnaHNoZWxmIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImhpZ2hzaGVsZiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/leq/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/leq/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAF+yOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6eDgIAAAQBBAAugA3sibmFtZSI6ICJsZXEiLCJmaWxlbmFtZSI6ICJsZXEiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAibGVxIiB9LHsgIm5hbWUiOiAibGVxIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJsZXEiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/log/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/log/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0ICAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAX0BfWACf38Bf2ACf38Bf2ADf399AAKNgICAAAEDZW52BV9sb2dmAAsDj4CAgAAOAAECAwQFBgcICQoMDQ4FjICAgAABAYKAgIAA6oeAgAAHuoGAgAAMB2NvbXB1dGUAAgxnZXROdW1JbnB1dHMAAw1nZXROdW1PdXRwdXRzAAQNZ2V0UGFyYW1WYWx1ZQAFDWdldFNhbXBsZVJhdGUABgRpbml0AAcNaW5zdGFuY2VDbGVhcgAIEWluc3RhbmNlQ29uc3RhbnRzAAkMaW5zdGFuY2VJbml0AAoaaW5zdGFuY2VSZXNldFVzZXJJbnRlcmZhY2UACw1zZXRQYXJhbVZhbHVlAA4GbWVtb3J5AgAK04KAgAAOgoCAgAAAC5aBgIAAAgR/AX1BACEEQQAhBUEAIQZBACEHQwAAAAAhCCACQQBqKAIAIQQgAkEEaigCACEFIANBAGooAgAhBkEAIQcDQAJAIAUgB2oqAgAhCCAGIAdqIAQgB2oqAgAQAENU+C1AIAhDAAAAAFuylCAIIAhDAAAAAFyylJIQAJU4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQASAAIAEQCguCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAkgABALIAAQCAuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLsoWAgAABAEEAC6sFeyJuYW1lIjogImxvZyIsImZpbGVuYW1lIjogImxvZyIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9zdGRmYXVzdC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAibG9nIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibmFtZSI6ICJsb2ciIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogImxvZyIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/lowpass/dspModule.wasm":
/*!*************************************!*\
  !*** ./dsps/lowpass/dspModule.wasm ***!
  \*************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAArThICAAA6CgICAAAALxoKAgAACBn8EfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ0gAkEAaigCACEEIAJBBGooAgAhBSACQQhqKAIAIQYgAkEMaigCACEHIANBAGooAgAhCEEAIQkDQAJAQQAqAgRDAAAAACAFIAlqKgIAl5QhCiAKEAAhC0MAAAA/IAoQAUNvEoM6IAcgCWoqAgCXlZQhDCAMQwAAgD+SIQ1BACAEIAlqKgIAQwAAAABDAAAAQCALlJNBACoCDJRDAACAPyAMk0EAKgIQlJIgDZWTOAIIIAggCWpDAACAPyALk0EAKgIMQwAAAD9BACoCCJSSQwAAAD9BACoCEJSSlCANlTgCAEEAQQAqAgw4AhBBAEEAKgIIOAIMIAlBBGohCSAJQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEEDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAIgACABEAsLtYCAgAABAX9BACEBQQAhAQNAAkBBCCABQQJ0akMAAAAAOAIAIAFBAWohASABQQNIBEAMAgwBCwsLC6aAgIAAAEEAIAE2AgBBAEPbD8lAQwCAO0hDAACAP0EAKAIAspeWlTgCBAuQgICAAAAgACABEAogABAMIAAQCQuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsL5IiAgAABAEEAC90IeyJuYW1lIjogImxvd3Bhc3MiLCJmaWxlbmFtZSI6ICJsb3dwYXNzIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21heG1zcC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDIwLCJpbnB1dHMiOiA0LCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZGVzY3JpcHRpb24iOiAiTG93IFBhc3MgRmlsdGVyIiB9LHsgImZpbGVuYW1lIjogImxvd3Bhc3MiIH0seyAiaW5wdXRzRGVzY3JpcHRpb24iOiAiW2BgLCBgZjBgLCBgZ2FpbiBpbiBkQmAsIGBRYF0iIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAibG93cGFzcyIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJsb3dwYXNzIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/lowshelf/dspModule.wasm":
/*!**************************************!*\
  !*** ./dsps/lowshelf/dspModule.wasm ***!
  \**************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB24CAgAARYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ACfX0BfWADf399AGABfQF9AqWAgIAAAwNlbnYFX2Nvc2YAAgNlbnYFX3Bvd2YADgNlbnYFX3NpbmYAEAOPgICAAA4AAQMEBQYHCAkKCwwNDwWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQAEDGdldE51bUlucHV0cwAFDWdldE51bU91dHB1dHMABg1nZXRQYXJhbVZhbHVlAAcNZ2V0U2FtcGxlUmF0ZQAIBGluaXQACQ1pbnN0YW5jZUNsZWFyAAoRaW5zdGFuY2VDb25zdGFudHMACwxpbnN0YW5jZUluaXQADBppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQANDXNldFBhcmFtVmFsdWUAEAZtZW1vcnkCAArShYCAAA6CgICAAAALxYOAgAACBn8IfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOQwAAAAAhD0MAAAAAIRBDAAAAACERIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByADQQBqKAIAIQhBACEJA0ACQEMAACBBQ83MzDwgBiAJaioCAJQQASEKQQAqAgRDAAAAACAFIAlqKgIAl5QhCyALEAAhDCAKQwAAgD+SIAyUIQ0gCkMAAIC/kiAMlCEOIAogDpIhDyAKkSALEAKUQ28SgzogByAJaioCAJeVIRAgECAPkkMAAIA/kiERQQAgBCAJaioCAEMAAAAAQwAAAEAgCiANkkMAAIC/kpSTQQAqAgyUIA9DAACAPyAQk5JBACoCEJSSIBGVkzgCCCAIIAlqIApBACoCCCAKIBCSQwAAgD8gDpOSlEMAAABAQQAqAgwgCkMAAIC/IA2TkpSUkkEAKgIQIApDAACAPyAOIBCSk5KUkpQgEZU4AgBBAEEAKgIMOAIQQQBBACoCCDgCDCAJQQRqIQkgCUEEIAFsSARADAIMAQsLCwuFgICAAABBBA8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARADIAAgARAMC7WAgIAAAQF/QQAhAUEAIQEDQAJAQQggAUECdGpDAAAAADgCACABQQFqIQEgAUEDSARADAIMAQsLCwumgICAAABBACABNgIAQQBD2w/JQEMAgDtIQwAAgD9BACgCALKXlpU4AgQLkICAgAAAIAAgARALIAAQDSAAEAoLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC4uIgIAAAQBBAAuECHsibmFtZSI6ICJsb3dzaGVsZiIsImZpbGVuYW1lIjogImxvd3NoZWxmIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21heG1zcC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDIwLCJpbnB1dHMiOiA0LCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAibG93c2hlbGYiIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAibG93c2hlbGYiIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMSIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAibG93c2hlbGYiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/lss/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/lss/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAF2yOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6eDgIAAAQBBAAugA3sibmFtZSI6ICJsc3MiLCJmaWxlbmFtZSI6ICJsc3MiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAibHNzIiB9LHsgIm5hbWUiOiAibHNzIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJsc3MiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/max/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/max/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJc4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogIm1heCIsImZpbGVuYW1lIjogIm1heCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJtYXgiIH0seyAibmFtZSI6ICJtYXgiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIm1heCIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/min/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/min/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJY4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogIm1pbiIsImZpbGVuYW1lIjogIm1pbiIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJtaW4iIH0seyAibmFtZSI6ICJtaW4iIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIm1pbiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/mod/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/mod/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ/fwBgBH9/f38AYAJ9fQF9YAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACjoCAgAABA2VudgZfZm1vZGYAAgOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBgoCAgADqh4CAAAe6gYCAAAwHY29tcHV0ZQACDGdldE51bUlucHV0cwADDWdldE51bU91dHB1dHMABA1nZXRQYXJhbVZhbHVlAAUNZ2V0U2FtcGxlUmF0ZQAGBGluaXQABw1pbnN0YW5jZUNsZWFyAAgRaW5zdGFuY2VDb25zdGFudHMACQxpbnN0YW5jZUluaXQAChppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQALDXNldFBhcmFtVmFsdWUADgZtZW1vcnkCAAqpgoCAAA6CgICAAAAL7ICAgAABBH9BACEEQQAhBUEAIQZBACEHIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkAgBiAHaiAEIAdqKgIAIAUgB2oqAgAQADgCACAHQQRqIQcgB0EEIAFsSARADAIMAQsLCwuFgICAAABBAg8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARABIAAgARAKC4KAgIAAAAuJgICAAABBACABNgIAC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwung4CAAAEAQQALoAN7Im5hbWUiOiAibW9kIiwiZmlsZW5hbWUiOiAibW9kIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogIm1vZCIgfSx7ICJuYW1lIjogIm1vZCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAibW9kIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/mtof/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/mtof/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gAn19AX1gA39/fQACjYCAgAABA2VudgVfcG93ZgANA4+AgIAADgABAgMEBQYHCAkKCwwOBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACqqCgIAADoKAgIAAAAvtgICAAAEDf0EAIQRBACEFQQAhBiACQQBqKAIAIQQgA0EAaigCACEFQQAhBgNAAkAgBSAGakMAANxDQwAAAEBDq6qqPSAEIAZqKgIAQwAAisKSlBAAlDgCACAGQQRqIQYgBkEEIAFsSARADAIMAQsLCwuFgICAAABBAQ8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARABIAAgARAKC4KAgIAAAAuJgICAAABBACABNgIAC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwu7hICAAAEAQQALtAR7Im5hbWUiOiAibXRvZiIsImZpbGVuYW1lIjogIm10b2YiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9iYXNpY3MubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDEsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJiYXNpY3MubGliL25hbWUiOiAiRmF1c3QgQmFzaWMgRWxlbWVudCBMaWJyYXJ5IiB9LHsgImJhc2ljcy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJtdG9mIiB9LHsgIm5hbWUiOiAibXRvZiIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAibXRvZiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/mul/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/mul/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJQ4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogIm11bCIsImZpbGVuYW1lIjogIm11bCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJtdWwiIH0seyAibmFtZSI6ICJtdWwiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIm11bCIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/neq/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/neq/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqmCgIAADoKAgIAAAAvsgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAFyyOAIAIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAAgACABEAkLgoCAgAAAC4mAgIAAAEEAIAE2AgALkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC6eDgIAAAQBBAAugA3sibmFtZSI6ICJuZXEiLCJmaWxlbmFtZSI6ICJuZXEiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiA0LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZmlsZW5hbWUiOiAibmVxIiB9LHsgIm5hbWUiOiAibmVxIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJuZXEiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/noise/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/noise/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGBgICAAOmHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACtSCgIAADoKAgIAAAAvqgICAAAECf0EAIQRBACEFIANBAGooAgAhBEEAIQUDQAJAQQBB7ZyZjgRBACgCBGxBueAAajYCACAEIAVqQwAAADBBACgCALKUOAIAQQBBACgCADYCBCAFQQRqIQUgBUEEIAFsSARADAIMAQsLCwuFgICAAABBAA8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCCA8LjoCAgAAAIAAgARAAIAAgARAJC6+AgIAAAQF/QQAhAUEAIQEDQAJAIAFBAnRBADYCACABQQFqIQEgAUECSARADAIMAQsLCwuJgICAAABBACABNgIIC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvDhICAAAEAQQALvAR7Im5hbWUiOiAibm9pc2UiLCJmaWxlbmFtZSI6ICJub2lzZSIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9zdGRmYXVzdC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L25vaXNlcy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMTIsImlucHV0cyI6IDAsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogIm5vaXNlIiB9LHsgIm5hbWUiOiAibm9pc2UiIH0seyAibm9pc2VzLmxpYi9uYW1lIjogIkZhdXN0IE5vaXNlIEdlbmVyYXRvciBMaWJyYXJ5IiB9LHsgIm5vaXNlcy5saWIvdmVyc2lvbiI6ICIwLjAiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIm5vaXNlIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/notch/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/notch/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAAq7hICAAA6CgICAAAALroKAgAACBn8EfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ0gAkEAaigCACEEIAJBBGooAgAhBSACQQhqKAIAIQYgAkEMaigCACEHIANBAGooAgAhCEEAIQkDQAJAQQAqAgRDAAAAACAFIAlqKgIAl5QhCkMAAAAAQwAAAEAgChAAlJNBACoCDJQhC0MAAAA/IAoQAUNvEoM6IAcgCWoqAgCXlZQhDCAMQwAAgD+SIQ1BACAEIAlqKgIAIAtDAACAPyAMk0EAKgIQlJIgDZWTOAIIIAggCWpBACoCEEEAKgIIIAuSkiANlTgCAEEAQQAqAgw4AhBBAEEAKgIIOAIMIAlBBGohCSAJQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEEDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAIgACABEAsLtYCAgAABAX9BACEBQQAhAQNAAkBBCCABQQJ0akMAAAAAOAIAIAFBAWohASABQQNIBEAMAgwBCwsLC6aAgIAAAEEAIAE2AgBBAEPbD8lAQwCAO0hDAACAP0EAKAIAspeWlTgCBAuQgICAAAAgACABEAogABAMIAAQCQuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsL14iAgAABAEEAC9AIeyJuYW1lIjogIm5vdGNoIiwiZmlsZW5hbWUiOiAibm90Y2giLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3QvbWF4bXNwLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvbWF0aHMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9wbGF0Zm9ybS5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMjAsImlucHV0cyI6IDQsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJOb3RjaCBGaWx0ZXIiIH0seyAiZmlsZW5hbWUiOiAibm90Y2giIH0seyAiaW5wdXRzRGVzY3JpcHRpb24iOiAiW2BgLCBgZjBgLCBgZ2FpbiBpbiBkQmAsIGBRYF0iIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJtYXhtc3AubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXhtc3AubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXhtc3AubGliL25hbWUiOiAiTWF4TVNQIGNvbXBhdGliaWxpdHkgTGlicmFyeSIgfSx7ICJtYXhtc3AubGliL3ZlcnNpb24iOiAiMS4xIiB9LHsgIm5hbWUiOiAibm90Y2giIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMSIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAibm90Y2giLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/peaknotch/dspModule.wasm":
/*!***************************************!*\
  !*** ./dsps/peaknotch/dspModule.wasm ***!
  \***************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB1YCAgAAQYAJ/fwBgBH9/f38AYAF9AX1gAX8Bf2ABfwF/YAJ/fwF9YAF/AX9gAn9/AGABfwBgAn9/AGACf38AYAF/AGACf38Bf2ACf38Bf2ADf399AGABfQF9ApmAgIAAAgNlbnYFX2Nvc2YAAgNlbnYFX3NpbmYADwOPgICAAA4AAQMEBQYHCAkKCwwNDgWMgICAAAEBhICAgADsh4CAAAe6gYCAAAwHY29tcHV0ZQADDGdldE51bUlucHV0cwAEDWdldE51bU91dHB1dHMABQ1nZXRQYXJhbVZhbHVlAAYNZ2V0U2FtcGxlUmF0ZQAHBGluaXQACA1pbnN0YW5jZUNsZWFyAAkRaW5zdGFuY2VDb25zdGFudHMACgxpbnN0YW5jZUluaXQACxppbnN0YW5jZVJlc2V0VXNlckludGVyZmFjZQAMDXNldFBhcmFtVmFsdWUADwZtZW1vcnkCAAqVhYCAAA6CgICAAAALiIOAgAACBn8IfUEAIQRBACEFQQAhBkEAIQdBACEIQQAhCUMAAAAAIQpDAAAAACELQwAAAAAhDEMAAAAAIQ1DAAAAACEOQwAAAAAhD0MAAAAAIRBDAAAAACERIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIAJBDGooAgAhByADQQBqKAIAIQhBACEJA0ACQEEAKgIEQwAAAAAgBSAJaioCAJeUIQpDAAAAAEMAAABAIAoQAJSTQQAqAgyUIQsgChABIQxDbxKDOiAHIAlqKgIAlyENQ6zFJzcgBiAJaioCAJeRIQ5DAAAAPyAMIA0gDpSVlCEPIA9DAACAP5IhEEEAIAQgCWoqAgAgC0MAAIA/IA+TQQAqAhCUkiAQlZM4AghDAAAAPyAOIAyUIA2VlCERIAggCWogC0EAKgIIIBFDAACAP5KUkkEAKgIQQwAAgD8gEZOUkiAQlTgCAEEAQQAqAgw4AhBBAEEAKgIIOAIMIAlBBGohCSAJQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEEDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAIgACABEAsLtYCAgAABAX9BACEBQQAhAQNAAkBBCCABQQJ0akMAAAAAOAIAIAFBAWohASABQQNIBEAMAgwBCwsLC6aAgIAAAEEAIAE2AgBBAEPbD8lAQwCAO0hDAACAP0EAKAIAspeWlTgCBAuQgICAAAAgACABEAogABAMIAAQCQuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLkIiAgAABAEEAC4kIeyJuYW1lIjogInBlYWtub3RjaCIsImZpbGVuYW1lIjogInBlYWtub3RjaCIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9zaGFyZS9mYXVzdC9tYXhtc3AubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAyMCwiaW5wdXRzIjogNCwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogInBlYWtub3RjaCIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi4zIiB9LHsgIm1heG1zcC5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1heG1zcC5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1heG1zcC5saWIvbmFtZSI6ICJNYXhNU1AgY29tcGF0aWJpbGl0eSBMaWJyYXJ5IiB9LHsgIm1heG1zcC5saWIvdmVyc2lvbiI6ICIxLjEiIH0seyAibmFtZSI6ICJwZWFrbm90Y2giIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMSIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAicGVha25vdGNoIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/phasor/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/phasor/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACoKEgIAADoKAgIAAAAvEgYCAAAIEfwJ9QQAhBEEAIQVBACEGQQAhB0MAAAAAIQhDAAAAACEJIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkAgBSAHaioCACEIQQAgCDgCCEEAKgIEIAQgB2oqAgCUIAhBACoCFJKSIQlBACAJQQAqAgwgCUEAKgIMk46SkzgCECAGIAdqQQAqAhA4AgBBAEEAKgIIOAIMQQBBACoCEDgCFCAHQQRqIQcgB0EEIAFsSARADAIMAQsLCwuFgICAAABBAg8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARAAIAAgARAJC+aAgIAAAQJ/QQAhAUEAIQJBACEBA0ACQEEIIAFBAnRqQwAAAAA4AgAgAUEBaiEBIAFBAkgEQAwCDAELCwtBACECA0ACQEEQIAJBAnRqQwAAAAA4AgAgAkEBaiECIAJBAkgEQAwCDAELCwsLpoCAgAAAQQAgATYCAEEAQwAAgD9DAIA7SEMAAIA/QQAoAgCyl5aVOAIEC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvKiICAAAEAQQALwwh7Im5hbWUiOiAicGhhc29yIiwiZmlsZW5hbWUiOiAicGhhc29yIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L3N0ZGZhdXN0LmxpYiIsIi91c3Ivc2hhcmUvZmF1c3Qvb3NjaWxsYXRvcnMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIl0sInNpemUiOiAyNCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiIH0seyAiZGVmYXVsdElucHV0cyI6ICJbMCwgMC41XSIgfSx7ICJkZXNjcmlwdGlvbiI6ICJTaW1wbGUgc2F3dG9vdGggd2F2ZWZvcm0gb3NjaWxsYXRvciBiZXR3ZWVuIDAgYW5kIDEgd2l0aCBwaGFzZSBjb250cm9sIiB9LHsgImZpbGVuYW1lIjogInBoYXNvciIgfSx7ICJpbnB1dHNEZXNjcmlwdGlvbiI6ICJbYGZyZXFgLCBgcGhhc2VgXSIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi4zIiB9LHsgIm5hbWUiOiAicGhhc29yIiB9LHsgIm9zY2lsbGF0b3JzLmxpYi9uYW1lIjogIkZhdXN0IE9zY2lsbGF0b3IgTGlicmFyeSIgfSx7ICJvc2NpbGxhdG9ycy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMSIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAicGhhc29yIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/pink/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/pink/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGBgICAAOmHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACpeEgIAADoKAgIAAAAv8gYCAAAEDf0EAIQRBACEFQQMhBiADQQBqKAIAIQRBACEFA0ACQEEAQe2cmY4EQQAoAgRsQbngAGo2AgBBAEM0rgU/QQAqAhSUQwAAADBBACgCALKUQ1ytH0BBACoCDJSSkkPiGgFAQQAqAhCUkzgCCCAEIAVqQwx7TD1BACoCCJRDQ09PPUEAKgIQlJJDQpjEPUEAKgIMlEOUd5A7QQAqAhSUkpM4AgBBAEEAKAIANgIEQQMhBgNAAkBBCCAGQQJ0akEIIAZBAWtBAnRqKgIAOAIAIAZBAWshBiAGQQBKBEAMAgwBCwsLIAVBBGohBSAFQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEADwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIYDwuOgICAAAAgACABEAAgACABEAkL4ICAgAABAn9BACEBQQAhAkEAIQEDQAJAIAFBAnRBADYCACABQQFqIQEgAUECSARADAIMAQsLC0EAIQIDQAJAQQggAkECdGpDAAAAADgCACACQQFqIQIgAkEESARADAIMAQsLCwuJgICAAABBACABNgIYC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuri4CAAAEAQQALpAt7Im5hbWUiOiAicGluayIsImZpbGVuYW1lIjogInBpbmsiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9ub2lzZXMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9maWx0ZXJzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvbWF0aHMubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDI4LCJpbnB1dHMiOiAwLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJwaW5rIiB9LHsgImZpbHRlcnMubGliL2ZpcjphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJmaWx0ZXJzLmxpYi9maXI6Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL2ZpcjpsaWNlbnNlIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvaWlyOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL2lpcjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvaWlyOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi9sb3dwYXNzMF9oaWdocGFzczEiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvbmFtZSI6ICJGYXVzdCBGaWx0ZXJzIExpYnJhcnkiIH0seyAiZmlsdGVycy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJuYW1lIjogInBpbmsiIH0seyAibm9pc2VzLmxpYi9uYW1lIjogIkZhdXN0IE5vaXNlIEdlbmVyYXRvciBMaWJyYXJ5IiB9LHsgIm5vaXNlcy5saWIvdmVyc2lvbiI6ICIwLjAiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogInBpbmsiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/rdiv/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/rdiv/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAUgB2oqAgAgBCAHaioCAJU4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLrIOAgAABAEEAC6UDeyJuYW1lIjogInJkaXYiLCJmaWxlbmFtZSI6ICJyZGl2IiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogInJkaXYiIH0seyAibmFtZSI6ICJyZGl2IiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJyZGl2IiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/rect/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/rect/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gAn19AX1gA39/fQACjYCAgAABA2VudgVfcG93ZgANA4+AgIAADgABAgMEBQYHCAkKCwwOBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACvOGgIAADoKAgIAAAAu0g4CAAAIFfwd9QQAhBEEAIQVBACEGQQAhB0MAAAAAIQlDAAAAACEKQwAAAAAhC0MAAAAAIQxDAAAAACENQwAAAAAhDkEAIQhDAAAAACEPIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkBBAEEBNgIMIAQgB2oqAgBDc5e7QZchCUMAAKBBIAmLlyEKQQAqAhxBACoCFCAKlJIhC0EAIAsgC46TOAIYQwAAAEBBACoCGJRDAACAv5JDAAAAQBAAIQxBACAMOAIgQQAoAhCyIAxBACoCJJOUIAqVIQ1BLEEAKAIoQf8fcUECdGogDTgCAEMAAAAAQwDg/0RBACoCBCAFIAdqKgIAIAmVlJaXIQ4gDqghCCAOjiEPIAYgB2pBACoCCCANQSxBACgCKCAIa0H/H3FBAnRqKgIAIA9DAACAPyAOk5KUkyAOIA+TQSxBACgCKCAIQQFqa0H/H3FBAnRqKgIAlJOUOAIAQQBBACgCDDYCEEEAQQAqAhg4AhxBAEEAKgIgOAIkQQBBACgCKEEBajYCKCAHQQRqIQcgB0EEIAFsSARADAIMAQsLCwuFgICAAABBAg8LhYCAgAAAQQEPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCAA8LjoCAgAAAIAAgARABIAAgARAKC82BgIAAAQR/QQAhAUEAIQJBACEDQQAhBEEAIQEDQAJAQQwgAUECdGpBADYCACABQQFqIQEgAUECSARADAIMAQsLC0EAIQIDQAJAQRggAkECdGpDAAAAADgCACACQQFqIQIgAkECSARADAIMAQsLC0EAIQMDQAJAQSAgA0ECdGpDAAAAADgCACADQQFqIQMgA0ECSARADAIMAQsLC0EAQQA2AihBACEEA0ACQEEsIARBAnRqQwAAAAA4AgAgBEEBaiEEIARBgCBIBEAMAgwBCwsLC8CAgIAAAEEAIAE2AgBBAEMAgDtIQwAAgD9BACgCALKXljgCBEEAQwAAgD5BACoCBJQ4AghBAEMAAIA/QQAqAgSVOAIUC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwu6h4CAAAEAQQALswd7Im5hbWUiOiAicmVjdCIsImZpbGVuYW1lIjogInJlY3QiLCJ2ZXJzaW9uIjogIjIuMzIuNiIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWkgLWVzIDEgLXNpbmdsZSAtZnR6IDAiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3Ivc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9vc2NpbGxhdG9ycy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDE2NDI4LCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZWZhdWx0SW5wdXRzIjogIlswLCAwLjVdIiB9LHsgImZpbGVuYW1lIjogInJlY3QiIH0seyAibWF0aHMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvY29weXJpZ2h0IjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF0aHMubGliL25hbWUiOiAiRmF1c3QgTWF0aCBMaWJyYXJ5IiB9LHsgIm1hdGhzLmxpYi92ZXJzaW9uIjogIjIuMyIgfSx7ICJuYW1lIjogInJlY3QiIH0seyAib3NjaWxsYXRvcnMubGliL25hbWUiOiAiRmF1c3QgT3NjaWxsYXRvciBMaWJyYXJ5IiB9LHsgIm9zY2lsbGF0b3JzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJyZWN0IiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/rsub/dspModule.wasm":
/*!**********************************!*\
  !*** ./dsps/rsub/dspModule.wasm ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAUgB2oqAgAgBCAHaioCAJM4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLrIOAgAABAEEAC6UDeyJuYW1lIjogInJzdWIiLCJmaWxlbmFtZSI6ICJyc3ViIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogNCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDEsIm1ldGEiOiBbIHsgImFyZ3NPZmZzZXQiOiAiMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImZpbGVuYW1lIjogInJzdWIiIH0seyAibmFtZSI6ICJyc3ViIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJyc3ViIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/sah/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/sah/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACvyDgIAADoKAgIAAAAvegYCAAAIGfwJ9QQAhBEEAIQVBACEGQQAhB0EAIQhDAAAAACEKQwAAAAAhC0EAIQkgAkEAaigCACEEIAJBBGooAgAhBSACQQhqKAIAIQYgA0EAaigCACEHQQAhCANAAkAgBSAIaioCACEKQQAgCjgCACAGIAhqKgIAIQtBACoCBCALXyAKIAtecSEJQQBBACoCDEEBIAlrspQgBCAIaioCACAJspSSOAIIIAcgCGpBACoCCDgCAEEAQQAqAgA4AgRBAEEAKgIIOAIMIAhBBGohCCAIQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEDDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIQDwuOgICAAAAgACABEAAgACABEAkL44CAgAABAn9BACEBQQAhAkEAIQEDQAJAIAFBAnRDAAAAADgCACABQQFqIQEgAUECSARADAIMAQsLC0EAIQIDQAJAQQggAkECdGpDAAAAADgCACACQQFqIQIgAkECSARADAIMAQsLCwuJgICAAABBACABNgIQC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwuihICAAAEAQQALmwR7Im5hbWUiOiAic2FoIiwiZmlsZW5hbWUiOiAic2FoIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMjAsImlucHV0cyI6IDMsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjIiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJTYW1wbGUgYW5kIGhvbGQiIH0seyAiZmlsZW5hbWUiOiAic2FoIiB9LHsgImlucHV0c0Rlc2NyaXB0aW9uIjogIltgVmFsdWUgdG8gc2FtcGxlYCwgYFRyaWdnZXIgSW5wdXRgLCBgVHJpZ2dlciB0aHJlc2hvbGRgXSIgfSx7ICJuYW1lIjogInNhaCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAic2FoIiwiaXRlbXMiOiBbXX1dfQ==";

/***/ }),

/***/ "./dsps/slide/dspModule.wasm":
/*!***********************************!*\
  !*** ./dsps/slide/dspModule.wasm ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACrCDgIAADoKAgIAAAAvDgYCAAAIFfwF9QQAhBEEAIQVBACEGQQAhB0EAIQhDAAAAACEJIAJBAGooAgAhBCACQQRqKAIAIQUgAkEIaigCACEGIANBAGooAgAhB0EAIQgDQAJAIAQgCGoqAgAhCUEAQQAqAgQgCUEAKgIEkyAFIAhqKgIAIAlBACoCBGCylCAGIAhqKgIAIAlBACoCBF2ylJKVkjgCACAHIAhqQQAqAgA4AgBBAEEAKgIAOAIEIAhBBGohCCAIQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEEDDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIIDwuOgICAAAAgACABEAAgACABEAkLsoCAgAABAX9BACEBQQAhAQNAAkAgAUECdEMAAAAAOAIAIAFBAWohASABQQJIBEAMAgwBCwsLC4mAgIAAAEEAIAE2AggLkICAgAAAIAAgARAIIAAQCiAAEAcLgoCAgAAAC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC7+EgIAAAQBBAAu4BHsibmFtZSI6ICJzbGlkZSIsImZpbGVuYW1lIjogInNsaWRlIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMTIsImlucHV0cyI6IDMsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJkZXNjcmlwdGlvbiI6ICJGaWx0ZXIgYSBzaWduYWwgbG9nYXJpdGhtaWNhbGx5IiB9LHsgImZpbGVuYW1lIjogInNsaWRlIiB9LHsgImlucHV0c0Rlc2NyaXB0aW9uIjogIltgYCwgYHNsaWRlIHVwIHRpbWUgKHNhbXBsZXMpYCwgYHNsaWRlIGRvd24gdGltZSAoc2FtcGxlcylgXSIgfSx7ICJuYW1lIjogInNsaWRlIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJzbGlkZSIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/smooth/dspModule.wasm":
/*!************************************!*\
  !*** ./dsps/smooth/dspModule.wasm ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACtyEgIAADoKAgIAAAAvwgYCAAAIEfwJ9QQAhBEEAIQVBACEGQQAhB0MAAAAAIQhDAAAAACEJIAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGQQAhBwNAAkAgBCAHaioCACEIQQAgCDgCACAIQQAqAgRcBH1BACoCDCAFIAdqKgIAlAVBACoCFEMAAIC/kgshCUEAIAk4AhBBACAJQwAAAABfBH0gCAVBACoCHCAIQQAqAhyTIAmVkgs4AhggBiAHakEAKgIYOAIAQQBBACoCADgCBEEAQQAqAhA4AhRBAEEAKgIYOAIcIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIIDwuOgICAAAAgACABEAAgACABEAkLlIGAgAABA39BACEBQQAhAkEAIQNBACEBA0ACQCABQQJ0QwAAAAA4AgAgAUEBaiEBIAFBAkgEQAwCDAELCwtBACECA0ACQEEQIAJBAnRqQwAAAAA4AgAgAkEBaiECIAJBAkgEQAwCDAELCwtBACEDA0ACQEEYIANBAnRqQwAAAAA4AgAgA0EBaiEDIANBAkgEQAwCDAELCwsLpoCAgAAAQQAgATYCCEEAQ28SgzpDAIA7SEMAAIA/QQAoAgiyl5aUOAIMC5CAgIAAACAAIAEQCCAAEAogABAHC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvciYCAAAEAQQAL1Ql7Im5hbWUiOiAic21vb3RoIiwiZmlsZW5hbWUiOiAic21vb3RoIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L21heG1zcC5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L2Jhc2ljcy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDMyLCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMSwibWV0YSI6IFsgeyAiYXJnc09mZnNldCI6ICIxIiB9LHsgImJhc2ljcy5saWIvbmFtZSI6ICJGYXVzdCBCYXNpYyBFbGVtZW50IExpYnJhcnkiIH0seyAiYmFzaWNzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlc2NyaXB0aW9uIjogIkdlbmVyYXRlIHNpZ25hbCByYW1wIG9yIGVudmVsb3AiIH0seyAiZmlsZW5hbWUiOiAic21vb3RoIiB9LHsgImlucHV0c0Rlc2NyaXB0aW9uIjogIltgdmFsdWVgLCBgdGltZSBpbiBtc2BdIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibWF4bXNwLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF4bXNwLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF4bXNwLmxpYi9saWNlbnNlIjogIkxHUEwgd2l0aCBleGNlcHRpb24iIH0seyAibWF4bXNwLmxpYi9uYW1lIjogIk1heE1TUCBjb21wYXRpYmlsaXR5IExpYnJhcnkiIH0seyAibWF4bXNwLmxpYi92ZXJzaW9uIjogIjEuMSIgfSx7ICJuYW1lIjogInNtb290aCIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJzbW9vdGgiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/sub/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/sub/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAABy4CAgAAOYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gA39/fQACgYCAgAAAA4+AgIAADgABAgMEBQYHCAkKCwwNBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAEMZ2V0TnVtSW5wdXRzAAINZ2V0TnVtT3V0cHV0cwADDWdldFBhcmFtVmFsdWUABA1nZXRTYW1wbGVSYXRlAAUEaW5pdAAGDWluc3RhbmNlQ2xlYXIABxFpbnN0YW5jZUNvbnN0YW50cwAIDGluc3RhbmNlSW5pdAAJGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAoNc2V0UGFyYW1WYWx1ZQANBm1lbW9yeQIACqiCgIAADoKAgIAAAAvrgICAAAEEf0EAIQRBACEFQQAhBkEAIQcgAkEAaigCACEEIAJBBGooAgAhBSADQQBqKAIAIQZBACEHA0ACQCAGIAdqIAQgB2oqAgAgBSAHaioCAJM4AgAgB0EEaiEHIAdBBCABbEgEQAwCDAELCwsLhYCAgAAAQQIPC4WAgIAAAEEBDwuLgICAAAAgACABaioCAA8LiICAgAAAQQAoAgAPC46AgIAAACAAIAEQACAAIAEQCQuCgICAAAALiYCAgAAAQQAgATYCAAuQgICAAAAgACABEAggABAKIAAQBwuCgICAAAALkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLp4OAgAABAEEAC6ADeyJuYW1lIjogInN1YiIsImZpbGVuYW1lIjogInN1YiIsInZlcnNpb24iOiAiMi4zMi42IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIsImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iXSwic2l6ZSI6IDQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJhcmdzT2Zmc2V0IjogIjEiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taSAtZXMgMSAtc2luZ2xlIC1mdHogMCIgfSx7ICJmaWxlbmFtZSI6ICJzdWIiIH0seyAibmFtZSI6ICJzdWIiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogInN1YiIsIml0ZW1zIjogW119XX0=";

/***/ }),

/***/ "./dsps/tri/dspModule.wasm":
/*!*********************************!*\
  !*** ./dsps/tri/dspModule.wasm ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:application/wasm;base64,AGFzbQEAAAAB0YCAgAAPYAJ/fwBgBH9/f38AYAF/AX9gAX8Bf2ACf38BfWABfwF/YAJ/fwBgAX8AYAJ/fwBgAn9/AGABfwBgAn9/AX9gAn9/AX9gAn19AX1gA39/fQACjYCAgAABA2VudgVfcG93ZgANA4+AgIAADgABAgMEBQYHCAkKCwwOBYyAgIAAAQGCgICAAOqHgIAAB7qBgIAADAdjb21wdXRlAAIMZ2V0TnVtSW5wdXRzAAMNZ2V0TnVtT3V0cHV0cwAEDWdldFBhcmFtVmFsdWUABQ1nZXRTYW1wbGVSYXRlAAYEaW5pdAAHDWluc3RhbmNlQ2xlYXIACBFpbnN0YW5jZUNvbnN0YW50cwAJDGluc3RhbmNlSW5pdAAKGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAAsNc2V0UGFyYW1WYWx1ZQAOBm1lbW9yeQIACvSHgIAADoKAgIAAAAvyg4CAAAIFfwh9QQAhBEEAIQVBACEGQQAhB0MAAAAAIQlDAAAAACEKQwAAAAAhC0MAAAAAIQxDAAAAACENQwAAAAAhDkMAAAAAIQ9BACEIQwAAAAAhECACQQBqKAIAIQQgAkEEaigCACEFIANBAGooAgAhBkEAIQcDQAJAIAQgB2oqAgAhCUEAQQE2AgwgCUNzl7tBlyEKQwAAoEEgCouXIQtBACoCIEEAKgIYIAuUkiEMQQAgDCAMjpM4AhxDAAAAQEEAKgIclEMAAIC/kkMAAABAEAAhDUEAIA04AiRBACgCELIgDUEAKgIok5QgC5UhDkEwQQAoAixB/x9xQQJ0aiAOOAIAQwAAAABDAOD/REEAKgIEIAUgB2oqAgAgCpWUlpchDyAPqCEIIA+OIRBBAEN3vn8/QQAqArSAAZRBACoCFCAOQTBBACgCLCAIa0H/H3FBAnRqKgIAIBBDAACAPyAPk5KUkyAPIBCTQTBBACgCLCAIQQFqa0H/H3FBAnRqKgIAlJOUkjgCsIABIAYgB2pBACoCCCAJQQAqArCAAZSUOAIAQQBBACgCDDYCEEEAQQAqAhw4AiBBAEEAKgIkOAIoQQBBACgCLEEBajYCLEEAQQAqArCAATgCtIABIAdBBGohByAHQQQgAWxIBEAMAgwBCwsLC4WAgIAAAEECDwuFgICAAABBAQ8Li4CAgAAAIAAgAWoqAgAPC4iAgIAAAEEAKAIADwuOgICAAAAgACABEAEgACABEAoLgIKAgAABBX9BACEBQQAhAkEAIQNBACEEQQAhBUEAIQEDQAJAQQwgAUECdGpBADYCACABQQFqIQEgAUECSARADAIMAQsLC0EAIQIDQAJAQRwgAkECdGpDAAAAADgCACACQQFqIQIgAkECSARADAIMAQsLC0EAIQMDQAJAQSQgA0ECdGpDAAAAADgCACADQQFqIQMgA0ECSARADAIMAQsLC0EAQQA2AixBACEEA0ACQEEwIARBAnRqQwAAAAA4AgAgBEEBaiEEIARBgCBIBEAMAgwBCwsLQQAhBQNAAkBBsIABIAVBAnRqQwAAAAA4AgAgBUEBaiEFIAVBAkgEQAwCDAELCwsL0ICAgAAAQQAgATYCAEEAQwCAO0hDAACAP0EAKAIAspeWOAIEQQBDAACAQEEAKgIElTgCCEEAQwAAgD5BACoCBJQ4AhRBAEMAAIA/QQAqAgSVOAIYC5CAgIAAACAAIAEQCSAAEAsgABAIC4KAgIAAAAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvyioCAAAEAQQAL6wp7Im5hbWUiOiAidHJpIiwiZmlsZW5hbWUiOiAidHJpIiwidmVyc2lvbiI6ICIyLjMyLjYiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiwibGlicmFyeV9saXN0IjogWyIvdXNyL3NoYXJlL2ZhdXN0L3N0ZGZhdXN0LmxpYiIsIi91c3Ivc2hhcmUvZmF1c3Qvb3NjaWxsYXRvcnMubGliIiwiL3Vzci9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiIsIi91c3Ivc2hhcmUvZmF1c3QvZmlsdGVycy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiJdLCJzaXplIjogMTY0NDAsImlucHV0cyI6IDIsIm91dHB1dHMiOiAxLCJtZXRhIjogWyB7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pIC1lcyAxIC1zaW5nbGUgLWZ0eiAwIiB9LHsgImRlZmF1bHRJbnB1dHMiOiAiWzAsIDAuNV0iIH0seyAiZmlsZW5hbWUiOiAidHJpIiB9LHsgImZpbHRlcnMubGliL2xvd3Bhc3MwX2hpZ2hwYXNzMSI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9uYW1lIjogIkZhdXN0IEZpbHRlcnMgTGlicmFyeSIgfSx7ICJmaWx0ZXJzLmxpYi9wb2xlOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL3BvbGU6Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL3BvbGU6bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgImZpbHRlcnMubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjMiIH0seyAibmFtZSI6ICJ0cmkiIH0seyAib3NjaWxsYXRvcnMubGliL25hbWUiOiAiRmF1c3QgT3NjaWxsYXRvciBMaWJyYXJ5IiB9LHsgIm9zY2lsbGF0b3JzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJ0cmkiLCJpdGVtcyI6IFtdfV19";

/***/ }),

/***/ "./dsps/_/dspMeta.json":
/*!*****************************!*\
  !*** ./dsps/_/dspMeta.json ***!
  \*****************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"_\",\n    \"filename\": \"_\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Bypass signal\"\n        },\n        {\n            \"filename\": \"_\"\n        },\n        {\n            \"name\": \"_\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"_\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/abs/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/abs/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"abs\",\n    \"filename\": \"abs\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"abs\"\n        },\n        {\n            \"name\": \"abs\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"abs\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/acos/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/acos/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"acos\",\n    \"filename\": \"acos\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"acos\"\n        },\n        {\n            \"name\": \"acos\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"acos\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/acosh/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/acosh/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"acosh\",\n    \"filename\": \"acosh\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/math.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"acosh\"\n        },\n        {\n            \"math.lib/author\": \"GRAME\"\n        },\n        {\n            \"math.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"math.lib/deprecated\": \"This library is deprecated and is not maintained anymore. It will be removed in August 2017.\"\n        },\n        {\n            \"math.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"math.lib/name\": \"Math Library\"\n        },\n        {\n            \"math.lib/version\": \"1.0\"\n        },\n        {\n            \"name\": \"acosh\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"acosh\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/add/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/add/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"add\",\n    \"filename\": \"add\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"add\"\n        },\n        {\n            \"name\": \"add\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"add\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/adsr/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/adsr/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"adsr\",\n    \"filename\": \"adsr\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/envelopes.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 32,\n    \"code\": \"gA==\",\n    \"inputs\": 5,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0, 0, 0.75, 0]\"\n        },\n        {\n            \"description\": \"ADSR envelope generator\"\n        },\n        {\n            \"envelopes.lib/adsr:author\": \"Yann Orlarey\"\n        },\n        {\n            \"envelopes.lib/author\": \"GRAME\"\n        },\n        {\n            \"envelopes.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"envelopes.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"envelopes.lib/name\": \"Faust Envelope Library\"\n        },\n        {\n            \"envelopes.lib/version\": \"0.1\"\n        },\n        {\n            \"filename\": \"adsr\"\n        },\n        {\n            \"inputsDescription\": \"[`trigger`, `attack time (sec)`, `decay time (sec)`, `sustain level (between 0..1)`, `release time (sec)`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"adsr\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"adsr\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/allpass/dspMeta.json":
/*!***********************************!*\
  !*** ./dsps/allpass/dspMeta.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"allpass\",\n    \"filename\": \"allpass\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"All Pass Filter\"\n        },\n        {\n            \"filename\": \"allpass\"\n        },\n        {\n            \"inputsDescription\": \"[``, `f0`, `gain in dB`, `Q`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"allpass\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"allpass\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/ar/dspMeta.json":
/*!******************************!*\
  !*** ./dsps/ar/dspMeta.json ***!
  \******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"ar\",\n    \"filename\": \"ar\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/envelopes.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 24,\n    \"inputs\": 3,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0.75]\"\n        },\n        {\n            \"description\": \"Attack-Release envelope generator\"\n        },\n        {\n            \"envelopes.lib/ar:author\": \"Yann Orlarey, Stéphane Letz\"\n        },\n        {\n            \"envelopes.lib/author\": \"GRAME\"\n        },\n        {\n            \"envelopes.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"envelopes.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"envelopes.lib/name\": \"Faust Envelope Library\"\n        },\n        {\n            \"envelopes.lib/version\": \"0.1\"\n        },\n        {\n            \"filename\": \"ar\"\n        },\n        {\n            \"inputsDescription\": \"[`trigger`, `attack time (sec)`, `release time (sec)`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"ar\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"ar\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/asin/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/asin/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"asin\",\n    \"filename\": \"asin\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"asin\"\n        },\n        {\n            \"name\": \"asin\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"asin\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/asinh/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/asinh/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"asinh\",\n    \"filename\": \"asinh\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/math.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"asinh\"\n        },\n        {\n            \"math.lib/author\": \"GRAME\"\n        },\n        {\n            \"math.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"math.lib/deprecated\": \"This library is deprecated and is not maintained anymore. It will be removed in August 2017.\"\n        },\n        {\n            \"math.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"math.lib/name\": \"Math Library\"\n        },\n        {\n            \"math.lib/version\": \"1.0\"\n        },\n        {\n            \"name\": \"asinh\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"asinh\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/atan2/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/atan2/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"atan2\",\n    \"filename\": \"atan2\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"atan2\"\n        },\n        {\n            \"name\": \"atan2\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"atan2\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/atan/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/atan/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"atan\",\n    \"filename\": \"atan\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"atan\"\n        },\n        {\n            \"name\": \"atan\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"atan\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/atanh/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/atanh/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"atanh\",\n    \"filename\": \"atanh\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/math.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"atanh\"\n        },\n        {\n            \"math.lib/author\": \"GRAME\"\n        },\n        {\n            \"math.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"math.lib/deprecated\": \"This library is deprecated and is not maintained anymore. It will be removed in August 2017.\"\n        },\n        {\n            \"math.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"math.lib/name\": \"Math Library\"\n        },\n        {\n            \"math.lib/version\": \"1.0\"\n        },\n        {\n            \"name\": \"atanh\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"atanh\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/atodb/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/atodb/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"atodb\",\n    \"filename\": \"atodb\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/basics.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"atodb\"\n        },\n        {\n            \"name\": \"atodb\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"atodb\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/bandpass/dspMeta.json":
/*!************************************!*\
  !*** ./dsps/bandpass/dspMeta.json ***!
  \************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"bandpass\",\n    \"filename\": \"bandpass\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Band Pass Filter\"\n        },\n        {\n            \"filename\": \"bandpass\"\n        },\n        {\n            \"inputsDescription\": \"[``, `f0`, `gain in dB`, `Q`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"bandpass\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"bandpass\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/biquad/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/biquad/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"biquad\",\n    \"filename\": \"biquad\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 16,\n    \"inputs\": 6,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Biquad Filter\"\n        },\n        {\n            \"filename\": \"biquad\"\n        },\n        {\n            \"inputsDescription\": \"[``, `a0`, `a1`, `a2`, `b1`, `b2`]\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"biquad\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"biquad\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/bitand/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/bitand/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"bitand\",\n    \"filename\": \"bitand\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"bitand\"\n        },\n        {\n            \"name\": \"bitand\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"bitand\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/bitor/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/bitor/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"bitor\",\n    \"filename\": \"bitor\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"bitor\"\n        },\n        {\n            \"name\": \"bitor\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"bitor\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/bitxor/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/bitxor/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"bitxor\",\n    \"filename\": \"bitxor\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"bitxor\"\n        },\n        {\n            \"name\": \"bitxor\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"bitxor\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/change/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/change/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"change\",\n    \"filename\": \"change\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 12,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"change\"\n        },\n        {\n            \"name\": \"change\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"change\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/cycle/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/cycle/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"cycle\",\n    \"filename\": \"cycle\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/oscillators.lib\",\n        \"/usr/share/faust/platform.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/basics.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 524320,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"A sine wave generator with controllable phase\"\n        },\n        {\n            \"filename\": \"cycle\"\n        },\n        {\n            \"inputsDescription\": \"[`freq`, `phase`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"cycle\"\n        },\n        {\n            \"oscillators.lib/name\": \"Faust Oscillator Library\"\n        },\n        {\n            \"oscillators.lib/version\": \"0.1\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"cycle\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/dbtoa/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/dbtoa/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"dbtoa\",\n    \"filename\": \"dbtoa\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/basics.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"dbtoa\"\n        },\n        {\n            \"name\": \"dbtoa\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"dbtoa\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/dcblocker/dspMeta.json":
/*!*************************************!*\
  !*** ./dsps/dcblocker/dspMeta.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"dcblocker\",\n    \"filename\": \"dcblocker\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/filters.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"DC blocker. Default dc blocker has -3dB point near 35 Hz (at 44.1 kHz) and high-frequency gain near 1.0025 (due to no scaling).\"\n        },\n        {\n            \"filename\": \"dcblocker\"\n        },\n        {\n            \"filters.lib/dcblocker:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/dcblocker:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/dcblocker:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"filters.lib/lowpass0_highpass1\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/name\": \"Faust Filters Library\"\n        },\n        {\n            \"filters.lib/pole:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/pole:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/pole:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"filters.lib/version\": \"0.3\"\n        },\n        {\n            \"filters.lib/zero:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/zero:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/zero:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"name\": \"dcblocker\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"dcblocker\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/distort/dspMeta.json":
/*!***********************************!*\
  !*** ./dsps/distort/dspMeta.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"distort\",\n    \"filename\": \"distort\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Simple soft distortion ((1 + a) * x) / (1 + a * |x|)\"\n        },\n        {\n            \"filename\": \"distort\"\n        },\n        {\n            \"inputsDescription\": \"[``, `Factor (>= -1)`]\"\n        },\n        {\n            \"name\": \"distort\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"distort\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/div/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/div/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"div\",\n    \"filename\": \"div\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"div\"\n        },\n        {\n            \"name\": \"div\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"div\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/eq/dspMeta.json":
/*!******************************!*\
  !*** ./dsps/eq/dspMeta.json ***!
  \******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"eq\",\n    \"filename\": \"eq\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"eq\"\n        },\n        {\n            \"name\": \"eq\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"eq\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/filtercoeff/dspMeta.json":
/*!***************************************!*\
  !*** ./dsps/filtercoeff/dspMeta.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"filtercoeff\",\n    \"filename\": \"filtercoeff\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 3,\n    \"outputs\": 0,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"filtercoeff\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"filtercoeff\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"filtercoeff\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/ftom/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/ftom/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"ftom\",\n    \"filename\": \"ftom\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/basics.lib\",\n        \"/usr/share/faust/maths.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"ftom\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"ftom\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"ftom\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/geq/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/geq/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"geq\",\n    \"filename\": \"geq\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"geq\"\n        },\n        {\n            \"name\": \"geq\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"geq\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/gtr/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/gtr/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"gtr\",\n    \"filename\": \"gtr\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"gtr\"\n        },\n        {\n            \"name\": \"gtr\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"gtr\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/highpass/dspMeta.json":
/*!************************************!*\
  !*** ./dsps/highpass/dspMeta.json ***!
  \************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"highpass\",\n    \"filename\": \"highpass\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"High Pass Filter\"\n        },\n        {\n            \"filename\": \"highpass\"\n        },\n        {\n            \"inputsDescription\": \"[``, `f0`, `gain in dB`, `Q`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"highpass\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"highpass\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/highshelf/dspMeta.json":
/*!*************************************!*\
  !*** ./dsps/highshelf/dspMeta.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"highshelf\",\n    \"filename\": \"highshelf\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"highshelf\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"highshelf\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"highshelf\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/leq/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/leq/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"leq\",\n    \"filename\": \"leq\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"leq\"\n        },\n        {\n            \"name\": \"leq\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"leq\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/log/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/log/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"log\",\n    \"filename\": \"log\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/maths.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"log\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"log\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"log\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/lowpass/dspMeta.json":
/*!***********************************!*\
  !*** ./dsps/lowpass/dspMeta.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"lowpass\",\n    \"filename\": \"lowpass\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Low Pass Filter\"\n        },\n        {\n            \"filename\": \"lowpass\"\n        },\n        {\n            \"inputsDescription\": \"[``, `f0`, `gain in dB`, `Q`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"lowpass\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"lowpass\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/lowshelf/dspMeta.json":
/*!************************************!*\
  !*** ./dsps/lowshelf/dspMeta.json ***!
  \************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"lowshelf\",\n    \"filename\": \"lowshelf\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"lowshelf\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"lowshelf\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"lowshelf\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/lss/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/lss/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"lss\",\n    \"filename\": \"lss\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"lss\"\n        },\n        {\n            \"name\": \"lss\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"lss\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/max/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/max/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"max\",\n    \"filename\": \"max\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"max\"\n        },\n        {\n            \"name\": \"max\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"max\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/min/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/min/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"min\",\n    \"filename\": \"min\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"min\"\n        },\n        {\n            \"name\": \"min\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"min\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/mod/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/mod/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"mod\",\n    \"filename\": \"mod\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"mod\"\n        },\n        {\n            \"name\": \"mod\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"mod\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/mtof/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/mtof/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"mtof\",\n    \"filename\": \"mtof\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/basics.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 1,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"mtof\"\n        },\n        {\n            \"name\": \"mtof\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"mtof\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/mul/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/mul/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"mul\",\n    \"filename\": \"mul\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"mul\"\n        },\n        {\n            \"name\": \"mul\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"mul\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/neq/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/neq/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"neq\",\n    \"filename\": \"neq\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"neq\"\n        },\n        {\n            \"name\": \"neq\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"neq\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/noise/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/noise/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"noise\",\n    \"filename\": \"noise\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/noises.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 12,\n    \"inputs\": 0,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"noise\"\n        },\n        {\n            \"name\": \"noise\"\n        },\n        {\n            \"noises.lib/name\": \"Faust Noise Generator Library\"\n        },\n        {\n            \"noises.lib/version\": \"0.0\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"noise\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/notch/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/notch/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"notch\",\n    \"filename\": \"notch\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Notch Filter\"\n        },\n        {\n            \"filename\": \"notch\"\n        },\n        {\n            \"inputsDescription\": \"[``, `f0`, `gain in dB`, `Q`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"notch\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"notch\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/peaknotch/dspMeta.json":
/*!*************************************!*\
  !*** ./dsps/peaknotch/dspMeta.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"peaknotch\",\n    \"filename\": \"peaknotch\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 4,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"peaknotch\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"peaknotch\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"peaknotch\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/phasor/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/phasor/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"phasor\",\n    \"filename\": \"phasor\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/oscillators.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 24,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0.5]\"\n        },\n        {\n            \"description\": \"Simple sawtooth waveform oscillator between 0 and 1 with phase control\"\n        },\n        {\n            \"filename\": \"phasor\"\n        },\n        {\n            \"inputsDescription\": \"[`freq`, `phase`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"phasor\"\n        },\n        {\n            \"oscillators.lib/name\": \"Faust Oscillator Library\"\n        },\n        {\n            \"oscillators.lib/version\": \"0.1\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"phasor\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/pink/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/pink/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"pink\",\n    \"filename\": \"pink\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/noises.lib\",\n        \"/usr/share/faust/filters.lib\",\n        \"/usr/share/faust/maths.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 28,\n    \"inputs\": 0,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"pink\"\n        },\n        {\n            \"filters.lib/fir:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/fir:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/fir:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"filters.lib/iir:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/iir:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/iir:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"filters.lib/lowpass0_highpass1\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/name\": \"Faust Filters Library\"\n        },\n        {\n            \"filters.lib/version\": \"0.3\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"pink\"\n        },\n        {\n            \"noises.lib/name\": \"Faust Noise Generator Library\"\n        },\n        {\n            \"noises.lib/version\": \"0.0\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"pink\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/rdiv/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/rdiv/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"rdiv\",\n    \"filename\": \"rdiv\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"rdiv\"\n        },\n        {\n            \"name\": \"rdiv\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"rdiv\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/rect/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/rect/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"rect\",\n    \"filename\": \"rect\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/oscillators.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 16428,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0.5]\"\n        },\n        {\n            \"filename\": \"rect\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"rect\"\n        },\n        {\n            \"oscillators.lib/name\": \"Faust Oscillator Library\"\n        },\n        {\n            \"oscillators.lib/version\": \"0.1\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"rect\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/rsub/dspMeta.json":
/*!********************************!*\
  !*** ./dsps/rsub/dspMeta.json ***!
  \********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"rsub\",\n    \"filename\": \"rsub\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"rsub\"\n        },\n        {\n            \"name\": \"rsub\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"rsub\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/sah/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/sah/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"sah\",\n    \"filename\": \"sah\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 20,\n    \"inputs\": 3,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"2\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Sample and hold\"\n        },\n        {\n            \"filename\": \"sah\"\n        },\n        {\n            \"inputsDescription\": \"[`Value to sample`, `Trigger Input`, `Trigger threshold`]\"\n        },\n        {\n            \"name\": \"sah\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"sah\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/slide/dspMeta.json":
/*!*********************************!*\
  !*** ./dsps/slide/dspMeta.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"slide\",\n    \"filename\": \"slide\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 12,\n    \"inputs\": 3,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Filter a signal logarithmically\"\n        },\n        {\n            \"filename\": \"slide\"\n        },\n        {\n            \"inputsDescription\": \"[``, `slide up time (samples)`, `slide down time (samples)`]\"\n        },\n        {\n            \"name\": \"slide\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"slide\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/smooth/dspMeta.json":
/*!**********************************!*\
  !*** ./dsps/smooth/dspMeta.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"smooth\",\n    \"filename\": \"smooth\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/maxmsp.lib\",\n        \"/usr/share/faust/basics.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 32,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"basics.lib/name\": \"Faust Basic Element Library\"\n        },\n        {\n            \"basics.lib/version\": \"0.1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"description\": \"Generate signal ramp or envelop\"\n        },\n        {\n            \"filename\": \"smooth\"\n        },\n        {\n            \"inputsDescription\": \"[`value`, `time in ms`]\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"maxmsp.lib/author\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maxmsp.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maxmsp.lib/name\": \"MaxMSP compatibility Library\"\n        },\n        {\n            \"maxmsp.lib/version\": \"1.1\"\n        },\n        {\n            \"name\": \"smooth\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"smooth\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/sub/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/sub/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"sub\",\n    \"filename\": \"sub\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 4,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"argsOffset\": \"1\"\n        },\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"filename\": \"sub\"\n        },\n        {\n            \"name\": \"sub\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"sub\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./dsps/tri/dspMeta.json":
/*!*******************************!*\
  !*** ./dsps/tri/dspMeta.json ***!
  \*******************************/
/***/ ((module) => {

module.exports = "{\n    \"name\": \"tri\",\n    \"filename\": \"tri\",\n    \"version\": \"2.32.6\",\n    \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\",\n    \"library_list\": [\n        \"/usr/share/faust/stdfaust.lib\",\n        \"/usr/share/faust/oscillators.lib\",\n        \"/usr/share/faust/maths.lib\",\n        \"/usr/share/faust/platform.lib\",\n        \"/usr/share/faust/filters.lib\"\n    ],\n    \"include_pathnames\": [\n        \"/share/faust\",\n        \"/usr/local/share/faust\",\n        \"/usr/share/faust\",\n        \".\"\n    ],\n    \"size\": 16440,\n    \"inputs\": 2,\n    \"outputs\": 1,\n    \"meta\": [\n        {\n            \"compile_options\": \"-lang wasm-i -es 1 -single -ftz 0\"\n        },\n        {\n            \"defaultInputs\": \"[0, 0.5]\"\n        },\n        {\n            \"filename\": \"tri\"\n        },\n        {\n            \"filters.lib/lowpass0_highpass1\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/name\": \"Faust Filters Library\"\n        },\n        {\n            \"filters.lib/pole:author\": \"Julius O. Smith III\"\n        },\n        {\n            \"filters.lib/pole:copyright\": \"Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>\"\n        },\n        {\n            \"filters.lib/pole:license\": \"MIT-style STK-4.3 license\"\n        },\n        {\n            \"filters.lib/version\": \"0.3\"\n        },\n        {\n            \"maths.lib/author\": \"GRAME\"\n        },\n        {\n            \"maths.lib/copyright\": \"GRAME\"\n        },\n        {\n            \"maths.lib/license\": \"LGPL with exception\"\n        },\n        {\n            \"maths.lib/name\": \"Faust Math Library\"\n        },\n        {\n            \"maths.lib/version\": \"2.3\"\n        },\n        {\n            \"name\": \"tri\"\n        },\n        {\n            \"oscillators.lib/name\": \"Faust Oscillator Library\"\n        },\n        {\n            \"oscillators.lib/version\": \"0.1\"\n        },\n        {\n            \"platform.lib/name\": \"Generic Platform Library\"\n        },\n        {\n            \"platform.lib/version\": \"0.1\"\n        }\n    ],\n    \"ui\": [\n        {\n            \"type\": \"vgroup\",\n            \"label\": \"tri\",\n            \"items\": []\n        }\n    ]\n}";

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = "{\n  \"name\": \"@jspatcher/package-dsp\",\n  \"version\": \"1.0.1\",\n  \"description\": \"The DSP package for JSPatcher\",\n  \"main\": \"dist/index.js\",\n  \"scripts\": {\n    \"prebuild\": \"node src/scripts/build-faust.js\",\n    \"build\": \"webpack --mode development\",\n    \"build-watch\": \"webpack --mode development --watch --stats-children\"\n  },\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"git+https://github.com/jspatcher/package-dsp.git\"\n  },\n  \"keywords\": [\n    \"jspatcher\"\n  ],\n  \"jspatcher\": {\n    \"isJSPatcherPackage\": true,\n    \"thumbnail\": \"\",\n    \"jspatpkg\": \"index.jspatpkg.js\"\n  },\n  \"author\": \"Fr0stbyteR\",\n  \"license\": \"GPL-3.0-or-later\",\n  \"bugs\": {\n    \"url\": \"https://github.com/jspatcher/package-dsp/issues\"\n  },\n  \"homepage\": \"https://github.com/jspatcher/package-dsp#readme\",\n  \"devDependencies\": {\n    \"@jspatcher/jspatcher\": \"^0.0.9\",\n    \"@shren/faustwasm\": \"^0.0.19\",\n    \"clean-webpack-plugin\": \"^4.0.0\",\n    \"esbuild-loader\": \"^2.16.0\",\n    \"typescript\": \"^4.4.4\",\n    \"webpack\": \"^5.64.1\",\n    \"webpack-cli\": \"^4.9.1\"\n  }\n}\n";

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/index.jspatpkg.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getDsps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDsps */ "./src/getDsps.ts");
/* harmony import */ var _FaustDspObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaustDspObject */ "./src/FaustDspObject.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/index.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  var _a, _b, _c, _d, _e;
  const objects = {};
  const dspIdMap = {
    add: "+",
    sub: "-",
    rsub: "!-",
    mul: "*",
    div: "/",
    rdiv: "!/",
    gtr: ">",
    geq: ">=",
    lss: "<",
    leq: "<=",
    eq: "=",
    neq: "!=",
    mod: "%",
    bitand: "&",
    bitor: "|",
    max: "maximum",
    min: "minimum"
  };
  const dsps = await (0,_getDsps__WEBPACK_IMPORTED_MODULE_0__["default"])();
  for (const dspId in dsps) {
    const dspFactory = dsps[dspId];
    const meta = JSON.parse(dspFactory.json);
    const { meta: declaredMeta } = meta;
    const descr = ((_a = declaredMeta.find((m) => "description" in m)) == null ? void 0 : _a.description) || _index__WEBPACK_IMPORTED_MODULE_2__.description;
    const defaultInputsStr = (_b = declaredMeta.find((m) => "defaultInputs" in m)) == null ? void 0 : _b.defaultInputs;
    const defaultInputs = defaultInputsStr ? JSON.parse(defaultInputsStr) : [];
    const argsOffset = +((_c = declaredMeta.find((m) => "argsOffset" in m)) == null ? void 0 : _c.argsOffset) || 0;
    const inputsDescr = (_d = declaredMeta.find((m) => "inputsDescription" in m)) == null ? void 0 : _d.inputsDescription;
    const inputsDescrArr = inputsDescr ? JSON.parse(inputsDescr.replace(/`/g, '"')) : null;
    objects[`${dspIdMap[dspId] || dspId}~`] = (_e = class extends _FaustDspObject__WEBPACK_IMPORTED_MODULE_1__["default"] {
      constructor() {
        super(...arguments);
        this._ = __spreadProps(__spreadValues({}, this._), {
          dspFactory,
          dspId,
          faustDspGenerator: new this.env.Faust.FaustMonoDspGenerator(),
          defaultInputs,
          argsOffset
        });
      }
    }, _e.description = descr, _e.inlets = (inputsDescrArr || [null]).map((d) => ({
      isHot: true,
      type: "signal",
      description: d || "audio input connection",
      varLength: true
    })), _e.args = (inputsDescrArr == null ? void 0 : inputsDescrArr.slice(argsOffset).map((d, i) => ({
      type: "number",
      optional: true,
      varLength: true,
      description: d || `arg${i}`,
      default: defaultInputs[i + argsOffset] || 0
    }))) || [{
      type: "number",
      optional: true,
      varLength: true,
      description: "Initial inputs",
      default: 0
    }], _e);
  }
  return objects;
});

})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=index.jspatpkg.js.map