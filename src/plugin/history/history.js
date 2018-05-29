var helper = require('../../util/helper')
  , store = require('../../util/store')
;

var list = [] // 核心数据，本质上都是在操作这个数据
  , el // 根元素，历史记录渲染在哪个元素里
  , on_click // 回调（当点击一条历史记录时插件使用者执行的自定义代码）
  , on_delete // 回调（当删除一条历史记录时插件使用者执行的自定义代码）
;

/*供外部使用的接口*/
var output = {
  add: add,
  remove: remove,
  clear: clear,
  init: init,
  show: show,
  hide: hide,
  is_visible: is_visible,
}

/*初始化*/
function init(config) {
  el = document.querySelector(config.el);
  on_click = config.on_click;
  on_delete = config.on_delete;

  if (!config.el || !el)
    throw 'Invalid root element';

  sync_to_ladle(); // 拿到上一次的数据
  render();

  return output;
}

/*========UI操作 开始========*/

/*渲染历史记录*/
function render() {
  /*清空根元素*/
  el.innerHTML = '';

  /*通过list数组中的数据生成历史记录列表*/
  list.forEach(function (keyword) {
    /*创建元素*/
    var el_keyword = document.createElement('div');
    /*插入内容*/
    el_keyword.innerHTML = `
        <div class="text">${keyword}</div>
        <div class="tool">
          <span class="delete">删除</span>
        </div>`;

    /*添加类*/
    el_keyword.classList.add('history');

    /*追加到根元素后*/
    el.appendChild(el_keyword);

    /*为本条记录绑定点击事件*/
    el_keyword.addEventListener('click', function (e) {

      /*如果使用者想在点击时执行自己的函数，就触发它*/
      if (on_click)
        on_click(keyword, e);
    });

    /*为本条记录的删除按钮绑定点击事件*/
    el_keyword
      .querySelector('.delete')
      .addEventListener('click', function (e) {

        /*如果使用者想在点击时执行自己的函数，就触发它*/
        if (on_delete)
          on_delete(keyword, e);

        remove(keyword);
      });
  });
}

function show() {
  el.hidden = false;
}

function hide() {
  el.hidden = true;
}

function is_visible() {
  return !el.hidden;
}

/*========UI操作 结束========*/


/*========数据操作 开始========*/

/*将最新数据存入冰箱*/
function sync_to_store() {
  store.set('history_list', list);
}

/*从冰箱拿到历史数据*/
function sync_to_ladle() {
  list = store.get('history_list') || [];
}

/*添加一条历史记录
* @param String keyword 关键词
* */
function add(keyword) {
  helper.find_and_delete(list, keyword);// 防止重复关键词出现
  list.unshift(keyword);
  sync_to_store();
  render();
}


/*删除一条历史记录
* @param String keyword 关键词
* */
function remove(keyword) {
  helper.find_and_delete(list, keyword);
  sync_to_store();
  render();
}

/*清空历史记录*/
function clear() {
  list = [];
  sync_to_store();
  render();
}

/*========数据操作 结束========*/

module.exports = output;
