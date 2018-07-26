module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_load_script__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_load_script___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_load_script__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_accessible_autocomplete_react__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_accessible_autocomplete_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_accessible_autocomplete_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_get_value__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_get_value___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_get_value__);
var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/* global google */function onConfirm(){console.log('confirmed address');}function translate(message,context){var messages={addressAutoComplete:{noResults:'Address not found',statusNoResults:'No matching addresses',statusSelectedOption:'You’ve selected %{option}',statusResults:'%{smart_count} matching address is available |||| %{smart_count} matching addresses are available'}};var translation=__WEBPACK_IMPORTED_MODULE_4_get_value___default()(messages,message);if(!context){return translation;}if(!translation){return message;}// Support English plurals. More complex requirements should use an external
// i18n library like Polyglot.
if(context.smart_count!==undefined){var pluralForms=translation.split('||||');var pluralIndex=context.smart_count===1?0:1;translation=pluralForms[pluralIndex].trim();}// Interpolate results.
return translation.replace(/%\{(.*?)\}/g,function(match,contextKey){if(context[contextKey]===undefined){return match;}if(typeof context[contextKey]==='string'){return context[contextKey].replace(/\$/g,'$$');}return context[contextKey];});}var AccessibleGooglePlacesAutocomplete=function(_Component){_inherits(AccessibleGooglePlacesAutocomplete,_Component);function AccessibleGooglePlacesAutocomplete(props){_classCallCheck(this,AccessibleGooglePlacesAutocomplete);var _this=_possibleConstructorReturn(this,(AccessibleGooglePlacesAutocomplete.__proto__||Object.getPrototypeOf(AccessibleGooglePlacesAutocomplete)).call(this,props));_this.state={apiLoaded:false};_this.service=null;_this.currentStatusMessage='';_this.onApiLoad=_this.onApiLoad.bind(_this);_this.getSuggestions=_this.getSuggestions.bind(_this);_this.getNoResultsMessage=_this.getNoResultsMessage.bind(_this);_this.getStatusSelectedOptionMessage=_this.getStatusSelectedOptionMessage.bind(_this);_this.getStatusNoResultsMessage=_this.getStatusNoResultsMessage.bind(_this);_this.getStatusResultsMessage=_this.getStatusResultsMessage.bind(_this);return _this;}_createClass(AccessibleGooglePlacesAutocomplete,[{key:'onApiLoad',value:function onApiLoad(){this.setState(function(){return{apiLoaded:true};});this.service=new google.maps.places.AutocompleteService();}},{key:'getNoResultsMessage',value:function getNoResultsMessage(){var t=this.props.t;return t('addressAutoComplete.noResults');}},{key:'getStatusSelectedOptionMessage',value:function getStatusSelectedOptionMessage(selectedOption){var t=this.props.t;return t('addressAutoComplete.statusSelectedOption',{option:selectedOption});}},{key:'getStatusNoResultsMessage',value:function getStatusNoResultsMessage(){var t=this.props.t;var statusNoResults=t('addressAutoComplete.statusNoResults');// don't repeat "No matching addresses" over and over
if(this.currentStatusMessage===statusNoResults){return'';}this.currentStatusMessage=statusNoResults;return statusNoResults;}},{key:'getStatusResultsMessage',value:function getStatusResultsMessage(length,contentSelectedOption){var t=this.props.t;if(contentSelectedOption){return'';}var statusResults=t('addressAutoComplete.statusResults',{smart_count:length});// don't repeat "5 matching addresses" over and over
if(this.currentStatusMessage===statusResults){return'';}this.currentStatusMessage=statusResults;return statusResults;}},{key:'getSuggestions',value:function getSuggestions(query,populateResults){var countryCode=this.props.countryCode;var request={input:query,types:['geocode'],componentRestrictions:{country:countryCode}};function getPlaces(predictions,status){if(status!==google.maps.places.PlacesServiceStatus.OK){populateResults([]);return;}var results=predictions.map(function(prediction){return prediction.description;});populateResults(results);}this.service.getPlacePredictions(request,getPlaces);}},{key:'render',value:function render(){var _props=this.props,googleMapsApiKey=_props.googleMapsApiKey,id=_props.id,minLength=_props.minLength;var apiLoaded=this.state.apiLoaded;var encodedKey=encodeURIComponent(googleMapsApiKey);var googleMapsApi='https://maps.googleapis.com/maps/api/js?key='+encodedKey+'&libraries=places';if(apiLoaded){return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_accessible_autocomplete_react___default.a,{id:id,source:this.getSuggestions,minLength:minLength,required:true,displayMenu:'overlay',tNoResults:this.getNoResultsMessage,tStatusSelectedOption:this.getStatusSelectedOptionMessage,tStatusNoResults:this.getStatusNoResultsMessage,tStatusResults:this.getStatusResultsMessage,onConfirm:onConfirm});}return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_load_script___default.a,{url:googleMapsApi,onLoad:this.onApiLoad});}}]);return AccessibleGooglePlacesAutocomplete;}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);/* harmony default export */ __webpack_exports__["default"] = (AccessibleGooglePlacesAutocomplete);AccessibleGooglePlacesAutocomplete.propTypes={googleMapsApiKey:__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,id:__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,countryCode:__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,minLength:__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number,t:__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func};AccessibleGooglePlacesAutocomplete.defaultProps={minLength:4,t:translate};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("react-load-script");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("accessible-autocomplete/react");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("get-value");

/***/ })
/******/ ]);
//# sourceMappingURL=AccessibleGooglePlacesAutocomplete.es5.js.map