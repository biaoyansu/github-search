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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pagination.js":
/*!***********************!*\
  !*** ./pagination.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var config\n  , page_amount // 通过amount/limit计算得到\n  , el_pagination_list // 用于渲染页码的元素（由于还有\"上一页\"、\"下一页\"的存在，为了清楚起见，将所有数字页码封装到一个元素中）\n  , el_pagination_fieldset // <fieldset>元素，用于快速禁用所有按钮和其他输入组件\n  , default_config = {\n    amount: null,\n    limit: null,\n    range: 5,\n    current: 1,\n  }\n  /*导出接口*/\n  , output = {\n    init: init,\n    change_page: change_page,\n    disable: disable,\n    enable: enable,\n    is_disabled: is_disabled,\n  }\n;\n\n/*初始化\n* @param Object config 用于配置插件\n* {\n*   -------属性--------\n*   el: 选择器 // 必填项\n*   amount: 总数 // 必填项\n*   limit: 每页显示数 // 必填项\n*   range: 可见按钮数 // 默认为5\n*   current: 指定当前页 // 默认为1\n*   -------方法--------\n*   on_page_change() // 当页面发生改变时触发使用者的函数\n* }\n* */\nfunction init(user_config) {\n  el = document.querySelector(user_config.el);\n\n  /*el为必填参数*/\n  if (!el)\n    throw 'Invalid root element.';\n\n  /*amount和limit为必填参数*/\n  if (!user_config.amount || !user_config.limit)\n    throw 'Required config.amount and config.limit.';\n\n  /*合并默认配置和用户配置*/\n  config = Object.assign({}, default_config, user_config);\n\n  /*通过amount/limit得到总页数*/\n  calc_page_amount();\n\n  change_page(config.current, true);\n\n  /*渲染插件基本的HTML结构*/\n  render_init();\n\n  /*通过已知的页面总数渲染所有的数字按钮*/\n  render_list();\n}\n\n/**\n * 渲染插件基本的HTML结构\n * <.pagination-pre>\n *   <First>\n *   <Last>\n * <.pagination-list>\n *   <1>\n *   <2>\n *   <3>\n *   <...>\n * <.pagination-post>\n *   <First>\n *   <Last>\n * */\nfunction render_init() {\n  el.classList.add('pagination');\n\n  el.innerHTML = `\n  <fieldset class=\"pagination-fieldset\">\n    <div class=\"pagination-pre\">\n      <button class=\"pagination-first\">First</button>\n      <button class=\"pagination-prev\">Prev</button>\n    </div>\n    <div class=\"pagination-list\"></div>\n    <div class=\"pagination-post\">\n      <button class=\"pagination-next\">Next</button>\n      <button class=\"pagination-last\">Last</button>\n    </div>\n  </fieldset>\n  `;\n\n  el_pagination_list = el.querySelector('.pagination-list');\n  el_pagination_fieldset = el.querySelector('.pagination-fieldset');\n\n  el.addEventListener('click', function (e) {\n    var target = e.target // 谁冒的泡\n      , is_numeric_btn = target.classList.contains('pagination-item')\n      , first = target.classList.contains('pagination-first') // 点击了第一页\n      , last = target.classList.contains('pagination-last') // 点击了第最后一页\n      , prev = target.classList.contains('pagination-prev') // 点击了上一页\n      , next = target.classList.contains('pagination-next') // 点击了下一页\n    ;\n\n    if (is_numeric_btn) { // 如果是数字按钮\n      var page = parseInt(target.dataset.page);\n      change_page(page);\n    } else if (first) {\n      change_page(1);\n    } else if (last) {\n      change_page(page_amount);\n    } else if (prev) {\n      change_page(config.current - 1);\n    } else if (next) {\n      change_page(config.current + 1);\n    } else {\n\n    }\n\n    render_list();\n  })\n}\n\n/**\n * 通过已知的页面总数渲染所有的数字按钮\n */\nfunction render_list() {\n  el_pagination_list.innerHTML = '';\n\n  // /*最终渲染的按钮数量只能≤range，如果大于range，就强行将其设为range（只能小不能大）*/\n  // var end = page_amount > config.range ? config.range : page_amount;\n  //\n  // var start = 1;\n\n  var between = calc_start_and_end()\n    , start = between.start\n    , end = between.end\n  ;\n\n  /*生成翻页按钮*/\n  for (var i = start; i <= end; i++) {\n    var btn = document.createElement('button');\n    btn.innerText = i;\n    btn.classList.add('pagination-item');\n    btn.dataset.page = i;\n    el_pagination_list.appendChild(btn);\n\n    if (i == config.current)\n      btn.classList.add('active');\n  }\n}\n\n/*计算数字按钮的开始和结束*/\nfunction calc_start_and_end() {\n  var start\n    , end\n    , middle = Math.ceil(config.range / 2)\n    , reaching_left = config.current <= middle\n    , reaching_right = config.current >= page_amount - middle\n  ;\n\n  if (reaching_left) { // 逼近左边\n    start = 1;\n    end = config.range;\n  } else if (reaching_right) { // 逼近右边\n    start = page_amount - (config.range - 1);\n    end = page_amount;\n  } else { // 正常状态（在中间）\n    start = config.current - (middle - 1);\n    end = config.current + (middle - 1);\n  }\n\n  return {start: start, end: end};\n}\n\n/*计算一共有多少页*/\nfunction calc_page_amount() {\n  /*Math.ceil用于除不尽的情况，只入不舍*/\n  page_amount = Math.ceil(config.amount / config.limit);\n}\n\n/*验证且更改当前页面（比如说从1改为2）\n* 更改后通知在乎的人（触发回调函数）\n* @param Number page 当前页\n* */\nfunction change_page(page, force) {\n\n  var old = config.current;\n\n  config.current = page;\n\n  /*如果大于最大页面，就强制等于最后一页*/\n  if (page > page_amount)\n    config.current = page_amount;\n\n  /*如果小于最小页面，就强制等于第一页*/\n  if (page < 1)\n    config.current = 1;\n\n  if (!force && old == config.current)\n    return;\n\n  /*通知使用者*/\n  if (config.on_page_change)\n    config.on_page_change(config.current);\n}\n\n/*禁用组件*/\nfunction disable() {\n  el_pagination_fieldset.disabled = true;\n}\n\n/*启用组件*/\nfunction enable() {\n  el_pagination_fieldset.disabled = false;\n}\n\n/*组件是否禁用中*/\nfunction is_disabled() {\n  return el_pagination_fieldset.disabled;\n}\n\nmodule.exports = output;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdpbmF0aW9uLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnaW5hdGlvbi5qcz9kMmFlIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb25maWdcbiAgLCBwYWdlX2Ftb3VudCAvLyDpgJrov4dhbW91bnQvbGltaXTorqHnrpflvpfliLBcbiAgLCBlbF9wYWdpbmF0aW9uX2xpc3QgLy8g55So5LqO5riy5p+T6aG156CB55qE5YWD57Sg77yI55Sx5LqO6L+Y5pyJXCLkuIrkuIDpobVcIuOAgVwi5LiL5LiA6aG1XCLnmoTlrZjlnKjvvIzkuLrkuobmuIXmpZrotbfop4HvvIzlsIbmiYDmnInmlbDlrZfpobXnoIHlsIHoo4XliLDkuIDkuKrlhYPntKDkuK3vvIlcbiAgLCBlbF9wYWdpbmF0aW9uX2ZpZWxkc2V0IC8vIDxmaWVsZHNldD7lhYPntKDvvIznlKjkuo7lv6vpgJ/npoHnlKjmiYDmnInmjInpkq7lkozlhbbku5bovpPlhaXnu4Tku7ZcbiAgLCBkZWZhdWx0X2NvbmZpZyA9IHtcbiAgICBhbW91bnQ6IG51bGwsXG4gICAgbGltaXQ6IG51bGwsXG4gICAgcmFuZ2U6IDUsXG4gICAgY3VycmVudDogMSxcbiAgfVxuICAvKuWvvOWHuuaOpeWPoyovXG4gICwgb3V0cHV0ID0ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgY2hhbmdlX3BhZ2U6IGNoYW5nZV9wYWdlLFxuICAgIGRpc2FibGU6IGRpc2FibGUsXG4gICAgZW5hYmxlOiBlbmFibGUsXG4gICAgaXNfZGlzYWJsZWQ6IGlzX2Rpc2FibGVkLFxuICB9XG47XG5cbi8q5Yid5aeL5YyWXG4qIEBwYXJhbSBPYmplY3QgY29uZmlnIOeUqOS6jumFjee9ruaPkuS7tlxuKiB7XG4qICAgLS0tLS0tLeWxnuaApy0tLS0tLS0tXG4qICAgZWw6IOmAieaLqeWZqCAvLyDlv4XloavpoblcbiogICBhbW91bnQ6IOaAu+aVsCAvLyDlv4XloavpoblcbiogICBsaW1pdDog5q+P6aG15pi+56S65pWwIC8vIOW/heWhq+mhuVxuKiAgIHJhbmdlOiDlj6/op4HmjInpkq7mlbAgLy8g6buY6K6k5Li6NVxuKiAgIGN1cnJlbnQ6IOaMh+WumuW9k+WJjemhtSAvLyDpu5jorqTkuLoxXG4qICAgLS0tLS0tLeaWueazlS0tLS0tLS0tXG4qICAgb25fcGFnZV9jaGFuZ2UoKSAvLyDlvZPpobXpnaLlj5HnlJ/mlLnlj5jml7bop6blj5Hkvb/nlKjogIXnmoTlh73mlbBcbiogfVxuKiAqL1xuZnVuY3Rpb24gaW5pdCh1c2VyX2NvbmZpZykge1xuICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodXNlcl9jb25maWcuZWwpO1xuXG4gIC8qZWzkuLrlv4Xloavlj4LmlbAqL1xuICBpZiAoIWVsKVxuICAgIHRocm93ICdJbnZhbGlkIHJvb3QgZWxlbWVudC4nO1xuXG4gIC8qYW1vdW505ZKMbGltaXTkuLrlv4Xloavlj4LmlbAqL1xuICBpZiAoIXVzZXJfY29uZmlnLmFtb3VudCB8fCAhdXNlcl9jb25maWcubGltaXQpXG4gICAgdGhyb3cgJ1JlcXVpcmVkIGNvbmZpZy5hbW91bnQgYW5kIGNvbmZpZy5saW1pdC4nO1xuXG4gIC8q5ZCI5bm26buY6K6k6YWN572u5ZKM55So5oi36YWN572uKi9cbiAgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdF9jb25maWcsIHVzZXJfY29uZmlnKTtcblxuICAvKumAmui/h2Ftb3VudC9saW1pdOW+l+WIsOaAu+mhteaVsCovXG4gIGNhbGNfcGFnZV9hbW91bnQoKTtcblxuICBjaGFuZ2VfcGFnZShjb25maWcuY3VycmVudCwgdHJ1ZSk7XG5cbiAgLyrmuLLmn5Pmj5Lku7bln7rmnKznmoRIVE1M57uT5p6EKi9cbiAgcmVuZGVyX2luaXQoKTtcblxuICAvKumAmui/h+W3suefpeeahOmhtemdouaAu+aVsOa4suafk+aJgOacieeahOaVsOWtl+aMiemSriovXG4gIHJlbmRlcl9saXN0KCk7XG59XG5cbi8qKlxuICog5riy5p+T5o+S5Lu25Z+65pys55qESFRNTOe7k+aehFxuICogPC5wYWdpbmF0aW9uLXByZT5cbiAqICAgPEZpcnN0PlxuICogICA8TGFzdD5cbiAqIDwucGFnaW5hdGlvbi1saXN0PlxuICogICA8MT5cbiAqICAgPDI+XG4gKiAgIDwzPlxuICogICA8Li4uPlxuICogPC5wYWdpbmF0aW9uLXBvc3Q+XG4gKiAgIDxGaXJzdD5cbiAqICAgPExhc3Q+XG4gKiAqL1xuZnVuY3Rpb24gcmVuZGVyX2luaXQoKSB7XG4gIGVsLmNsYXNzTGlzdC5hZGQoJ3BhZ2luYXRpb24nKTtcblxuICBlbC5pbm5lckhUTUwgPSBgXG4gIDxmaWVsZHNldCBjbGFzcz1cInBhZ2luYXRpb24tZmllbGRzZXRcIj5cbiAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbi1wcmVcIj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uLWZpcnN0XCI+Rmlyc3Q8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uLXByZXZcIj5QcmV2PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBhZ2luYXRpb24tbGlzdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLXBvc3RcIj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uLW5leHRcIj5OZXh0PC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwicGFnaW5hdGlvbi1sYXN0XCI+TGFzdDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2ZpZWxkc2V0PlxuICBgO1xuXG4gIGVsX3BhZ2luYXRpb25fbGlzdCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0aW9uLWxpc3QnKTtcbiAgZWxfcGFnaW5hdGlvbl9maWVsZHNldCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0aW9uLWZpZWxkc2V0Jyk7XG5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCAvLyDosIHlhpLnmoTms6FcbiAgICAgICwgaXNfbnVtZXJpY19idG4gPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdpbmF0aW9uLWl0ZW0nKVxuICAgICAgLCBmaXJzdCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2luYXRpb24tZmlyc3QnKSAvLyDngrnlh7vkuobnrKzkuIDpobVcbiAgICAgICwgbGFzdCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2luYXRpb24tbGFzdCcpIC8vIOeCueWHu+S6huesrOacgOWQjuS4gOmhtVxuICAgICAgLCBwcmV2ID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncGFnaW5hdGlvbi1wcmV2JykgLy8g54K55Ye75LqG5LiK5LiA6aG1XG4gICAgICAsIG5leHQgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdpbmF0aW9uLW5leHQnKSAvLyDngrnlh7vkuobkuIvkuIDpobVcbiAgICA7XG5cbiAgICBpZiAoaXNfbnVtZXJpY19idG4pIHsgLy8g5aaC5p6c5piv5pWw5a2X5oyJ6ZKuXG4gICAgICB2YXIgcGFnZSA9IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LnBhZ2UpO1xuICAgICAgY2hhbmdlX3BhZ2UocGFnZSk7XG4gICAgfSBlbHNlIGlmIChmaXJzdCkge1xuICAgICAgY2hhbmdlX3BhZ2UoMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0KSB7XG4gICAgICBjaGFuZ2VfcGFnZShwYWdlX2Ftb3VudCk7XG4gICAgfSBlbHNlIGlmIChwcmV2KSB7XG4gICAgICBjaGFuZ2VfcGFnZShjb25maWcuY3VycmVudCAtIDEpO1xuICAgIH0gZWxzZSBpZiAobmV4dCkge1xuICAgICAgY2hhbmdlX3BhZ2UoY29uZmlnLmN1cnJlbnQgKyAxKTtcbiAgICB9IGVsc2Uge1xuXG4gICAgfVxuXG4gICAgcmVuZGVyX2xpc3QoKTtcbiAgfSlcbn1cblxuLyoqXG4gKiDpgJrov4flt7Lnn6XnmoTpobXpnaLmgLvmlbDmuLLmn5PmiYDmnInnmoTmlbDlrZfmjInpkq5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyX2xpc3QoKSB7XG4gIGVsX3BhZ2luYXRpb25fbGlzdC5pbm5lckhUTUwgPSAnJztcblxuICAvLyAvKuacgOe7iOa4suafk+eahOaMiemSruaVsOmHj+WPquiDveKJpHJhbmdl77yM5aaC5p6c5aSn5LqOcmFuZ2XvvIzlsLHlvLrooYzlsIblhbborr7kuLpyYW5nZe+8iOWPquiDveWwj+S4jeiDveWkp++8iSovXG4gIC8vIHZhciBlbmQgPSBwYWdlX2Ftb3VudCA+IGNvbmZpZy5yYW5nZSA/IGNvbmZpZy5yYW5nZSA6IHBhZ2VfYW1vdW50O1xuICAvL1xuICAvLyB2YXIgc3RhcnQgPSAxO1xuXG4gIHZhciBiZXR3ZWVuID0gY2FsY19zdGFydF9hbmRfZW5kKClcbiAgICAsIHN0YXJ0ID0gYmV0d2Vlbi5zdGFydFxuICAgICwgZW5kID0gYmV0d2Vlbi5lbmRcbiAgO1xuXG4gIC8q55Sf5oiQ57+76aG15oyJ6ZKuKi9cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgdmFyIGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ0bi5pbm5lclRleHQgPSBpO1xuICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0aW9uLWl0ZW0nKTtcbiAgICBidG4uZGF0YXNldC5wYWdlID0gaTtcbiAgICBlbF9wYWdpbmF0aW9uX2xpc3QuYXBwZW5kQ2hpbGQoYnRuKTtcblxuICAgIGlmIChpID09IGNvbmZpZy5jdXJyZW50KVxuICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICB9XG59XG5cbi8q6K6h566X5pWw5a2X5oyJ6ZKu55qE5byA5aeL5ZKM57uT5p2fKi9cbmZ1bmN0aW9uIGNhbGNfc3RhcnRfYW5kX2VuZCgpIHtcbiAgdmFyIHN0YXJ0XG4gICAgLCBlbmRcbiAgICAsIG1pZGRsZSA9IE1hdGguY2VpbChjb25maWcucmFuZ2UgLyAyKVxuICAgICwgcmVhY2hpbmdfbGVmdCA9IGNvbmZpZy5jdXJyZW50IDw9IG1pZGRsZVxuICAgICwgcmVhY2hpbmdfcmlnaHQgPSBjb25maWcuY3VycmVudCA+PSBwYWdlX2Ftb3VudCAtIG1pZGRsZVxuICA7XG5cbiAgaWYgKHJlYWNoaW5nX2xlZnQpIHsgLy8g6YC86L+R5bem6L65XG4gICAgc3RhcnQgPSAxO1xuICAgIGVuZCA9IGNvbmZpZy5yYW5nZTtcbiAgfSBlbHNlIGlmIChyZWFjaGluZ19yaWdodCkgeyAvLyDpgLzov5Hlj7PovrlcbiAgICBzdGFydCA9IHBhZ2VfYW1vdW50IC0gKGNvbmZpZy5yYW5nZSAtIDEpO1xuICAgIGVuZCA9IHBhZ2VfYW1vdW50O1xuICB9IGVsc2UgeyAvLyDmraPluLjnirbmgIHvvIjlnKjkuK3pl7TvvIlcbiAgICBzdGFydCA9IGNvbmZpZy5jdXJyZW50IC0gKG1pZGRsZSAtIDEpO1xuICAgIGVuZCA9IGNvbmZpZy5jdXJyZW50ICsgKG1pZGRsZSAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHtzdGFydDogc3RhcnQsIGVuZDogZW5kfTtcbn1cblxuLyrorqHnrpfkuIDlhbHmnInlpJrlsJHpobUqL1xuZnVuY3Rpb24gY2FsY19wYWdlX2Ftb3VudCgpIHtcbiAgLypNYXRoLmNlaWznlKjkuo7pmaTkuI3lsL3nmoTmg4XlhrXvvIzlj6rlhaXkuI3oiI0qL1xuICBwYWdlX2Ftb3VudCA9IE1hdGguY2VpbChjb25maWcuYW1vdW50IC8gY29uZmlnLmxpbWl0KTtcbn1cblxuLyrpqozor4HkuJTmm7TmlLnlvZPliY3pobXpnaLvvIjmr5TlpoLor7Tku44x5pS55Li6Mu+8iVxuKiDmm7TmlLnlkI7pgJrnn6XlnKjkuY7nmoTkurrvvIjop6blj5Hlm57osIPlh73mlbDvvIlcbiogQHBhcmFtIE51bWJlciBwYWdlIOW9k+WJjemhtVxuKiAqL1xuZnVuY3Rpb24gY2hhbmdlX3BhZ2UocGFnZSwgZm9yY2UpIHtcblxuICB2YXIgb2xkID0gY29uZmlnLmN1cnJlbnQ7XG5cbiAgY29uZmlnLmN1cnJlbnQgPSBwYWdlO1xuXG4gIC8q5aaC5p6c5aSn5LqO5pyA5aSn6aG16Z2i77yM5bCx5by65Yi2562J5LqO5pyA5ZCO5LiA6aG1Ki9cbiAgaWYgKHBhZ2UgPiBwYWdlX2Ftb3VudClcbiAgICBjb25maWcuY3VycmVudCA9IHBhZ2VfYW1vdW50O1xuXG4gIC8q5aaC5p6c5bCP5LqO5pyA5bCP6aG16Z2i77yM5bCx5by65Yi2562J5LqO56ys5LiA6aG1Ki9cbiAgaWYgKHBhZ2UgPCAxKVxuICAgIGNvbmZpZy5jdXJyZW50ID0gMTtcblxuICBpZiAoIWZvcmNlICYmIG9sZCA9PSBjb25maWcuY3VycmVudClcbiAgICByZXR1cm47XG5cbiAgLyrpgJrnn6Xkvb/nlKjogIUqL1xuICBpZiAoY29uZmlnLm9uX3BhZ2VfY2hhbmdlKVxuICAgIGNvbmZpZy5vbl9wYWdlX2NoYW5nZShjb25maWcuY3VycmVudCk7XG59XG5cbi8q56aB55So57uE5Lu2Ki9cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gIGVsX3BhZ2luYXRpb25fZmllbGRzZXQuZGlzYWJsZWQgPSB0cnVlO1xufVxuXG4vKuWQr+eUqOe7hOS7tiovXG5mdW5jdGlvbiBlbmFibGUoKSB7XG4gIGVsX3BhZ2luYXRpb25fZmllbGRzZXQuZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuLyrnu4Tku7bmmK/lkKbnpoHnlKjkuK0qL1xuZnVuY3Rpb24gaXNfZGlzYWJsZWQoKSB7XG4gIHJldHVybiBlbF9wYWdpbmF0aW9uX2ZpZWxkc2V0LmRpc2FibGVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG91dHB1dDtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pagination.js\n");

/***/ }),

/***/ "./test/test.js":
/*!**********************!*\
  !*** ./test/test.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pagination = __webpack_require__(/*! ../pagination */ \"./pagination.js\");\n\npagination.init({\n  el: '#page',\n  amount: 200,\n  limit: 10,\n  range: 5,\n  current: 12,\n\n  on_page_change: function (page, e) {\n    console.log(page);\n  }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi90ZXN0L3Rlc3QuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZXN0L3Rlc3QuanM/MzdhYyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGFnaW5hdGlvbiA9IHJlcXVpcmUoJy4uL3BhZ2luYXRpb24nKTtcblxucGFnaW5hdGlvbi5pbml0KHtcbiAgZWw6ICcjcGFnZScsXG4gIGFtb3VudDogMjAwLFxuICBsaW1pdDogMTAsXG4gIHJhbmdlOiA1LFxuICBjdXJyZW50OiAxMixcblxuICBvbl9wYWdlX2NoYW5nZTogZnVuY3Rpb24gKHBhZ2UsIGUpIHtcbiAgICBjb25zb2xlLmxvZyhwYWdlKTtcbiAgfVxufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./test/test.js\n");

/***/ })

/******/ });