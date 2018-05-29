var config
  , el
  , page_amount // 通过amount/limit计算得到
  , el_pagination_list // 用于渲染页码的元素（由于还有"上一页"、"下一页"的存在，为了清楚起见，将所有数字页码封装到一个元素中）
  , el_pagination_fieldset // <fieldset>元素，用于快速禁用所有按钮和其他输入组件
  , default_config = {
    amount: null,
    limit: null,
    range: 5,
    current: 1,
  }
  /*导出接口*/
  , output = {
    init: init,
    change_page: change_page,
    disable: disable,
    enable: enable,
    is_disabled: is_disabled,
    show: show,
    hide: hide,
    is_visible: is_visible,
    set_amount_and_limit: set_amount_and_limit
  }
;

/*初始化
* @param Object config 用于配置插件
* {
*   -------属性--------
*   el: 选择器 // 必填项
*   amount: 总数 // 必填项
*   limit: 每页显示数 // 必填项
*   range: 可见按钮数 // 默认为5
*   current: 指定当前页 // 默认为1
*   -------方法--------
*   on_page_change() // 当页面发生改变时触发使用者的函数
* }
* */
function init(user_config) {
  el = document.querySelector(user_config.el);

  /*el为必填参数*/
  if (!el)
    throw 'Invalid root element.';

  /*合并默认配置和用户配置*/
  config = Object.assign({}, default_config, user_config);

  /*渲染插件基本的HTML结构*/
  render_init();

  /*amount和limit为必填参数*/
  if (!user_config.amount || !user_config.limit)
    return;

  /*通过amount/limit得到总页数*/
  calc_page_amount();

  change_page(config.current, true);


  /*通过已知的页面总数渲染所有的数字按钮*/
  render_list();
}

/**
 * 渲染插件基本的HTML结构
 * <.pagination-pre>
 *   <First>
 *   <Last>
 * <.pagination-list>
 *   <1>
 *   <2>
 *   <3>
 *   <...>
 * <.pagination-post>
 *   <First>
 *   <Last>
 * */
function render_init() {
  el.classList.add('pagination');

  el.innerHTML = `
  <fieldset class="pagination-fieldset">
    <div class="pagination-pre">
      <button class="pagination-first">First</button>
      <button class="pagination-prev">Prev</button>
    </div>
    <div class="pagination-list"></div>
    <div class="pagination-post">
      <button class="pagination-next">Next</button>
      <button class="pagination-last">Last</button>
    </div>
  </fieldset>
  `;


  el_pagination_list = el.querySelector('.pagination-list');
  el_pagination_fieldset = el.querySelector('.pagination-fieldset');

  el.addEventListener('click', function (e) {
    var target = e.target // 谁冒的泡
      , is_numeric_btn = target.classList.contains('pagination-item')
      , first = target.classList.contains('pagination-first') // 点击了第一页
      , last = target.classList.contains('pagination-last') // 点击了第最后一页
      , prev = target.classList.contains('pagination-prev') // 点击了上一页
      , next = target.classList.contains('pagination-next') // 点击了下一页
    ;

    if (is_numeric_btn) { // 如果是数字按钮
      var page = parseInt(target.dataset.page);
      change_page(page);
    } else if (first) {
      change_page(1);
    } else if (last) {
      change_page(page_amount);
    } else if (prev) {
      change_page(config.current - 1);
    } else if (next) {
      change_page(config.current + 1);
    } else {

    }

    render_list();
  })
}

/**
 * 通过已知的页面总数渲染所有的数字按钮
 */
function render_list() {
  el_pagination_list.innerHTML = '';

  // /*最终渲染的按钮数量只能≤range，如果大于range，就强行将其设为range（只能小不能大）*/
  // var end = page_amount > config.range ? config.range : page_amount;
  //
  // var start = 1;

  var between = calc_start_and_end()
    , start = between.start
    , end = between.end
  ;

  /*生成翻页按钮*/
  for (var i = start; i <= end; i++) {
    var btn = document.createElement('button');
    btn.innerText = i;
    btn.classList.add('pagination-item');
    btn.dataset.page = i;
    el_pagination_list.appendChild(btn);

    if (i == config.current)
      btn.classList.add('active');
  }
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

/*计算数字按钮的开始和结束*/
function calc_start_and_end() {
  var start
    , end
    , middle = Math.ceil(config.range / 2)
    , reaching_left = config.current <= middle
    , reaching_right = config.current >= page_amount - middle
  ;

  if (reaching_left) { // 逼近左边
    start = 1;
    end = config.range;
  } else if (reaching_right) { // 逼近右边
    start = page_amount - (config.range - 1);
    end = page_amount;
  } else { // 正常状态（在中间）
    start = config.current - (middle - 1);
    end = config.current + (middle - 1);
  }

  return {start: start, end: end};
}

/*计算一共有多少页*/
function calc_page_amount() {
  /*Math.ceil用于除不尽的情况，只入不舍*/
  page_amount = Math.ceil(config.amount / config.limit);
}

/*验证且更改当前页面（比如说从1改为2）
* 更改后通知在乎的人（触发回调函数）
* @param Number page 当前页
* */
function change_page(page, force) {

  var old = config.current;

  config.current = page;

  /*如果大于最大页面，就强制等于最后一页*/
  if (page > page_amount)
    config.current = page_amount;

  /*如果小于最小页面，就强制等于第一页*/
  if (page < 1)
    config.current = 1;

  if (!force && old == config.current)
    return;

  /*通知使用者*/
  if (config.on_page_change)
    config.on_page_change(config.current);
}

/*设置列表总数和每页的数量*/
function set_amount_and_limit(amount, limit) {
  config.amount = amount;
  config.limit = limit;
  calc_page_amount();

  /*通过已知的页面总数渲染所有的数字按钮*/
  render_list();
}

/*禁用组件*/
function disable() {
  el_pagination_fieldset.disabled = true;
}

/*启用组件*/
function enable() {
  el_pagination_fieldset.disabled = false;
}

/*组件是否禁用中*/
function is_disabled() {
  return el_pagination_fieldset.disabled;
}

module.exports = output;
