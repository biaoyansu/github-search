var el = require('./element')
  , history = require('./plugin/history/history')
  , pagination = require('./plugin/pagination/pagination')
  , search = require('./search')
  , share = require('./share')
;

function bind_all() {
  detect_submit();
  detect_click_top();
  // detect_click_pagination();
  detect_click_input();
  detect_click_document();

  init_plugins();
  // detect_blur_input();
  //@1 detect_click_history_list();
}

function init_plugins() {
  history.init({
    el: '#history-list',
    on_delete: on_history_delete,
    on_click: on_history_click,
  });

  pagination.init({
    el: '#pagination',
    on_page_change: function (page) {
      if (page == share.get_current_page())
        return;

      share.set_current_page(page);
      search.search(on_search_succeed);
    }
  });
}

function on_history_click(keyword) {
  el.input.value = keyword;
  share.set_keyword(keyword);
  search.search(on_search_succeed);
}

function on_history_delete(keyword) {
  history.remove(keyword);
}

/*绑定表单提交事件*/
function detect_submit() {
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();

    /*获取输入的关键词*/
    var keyword = share.set_keyword(el.input.value);

    if (!keyword) {
      alert('你闹呢');
      return;
    }

    history.add(keyword);


    /*重置用户列表HTML*/
    el.reset_user_list();

    /*隐藏两个只有得到结果才有意义的组件*/
    el.placeholer.hidden = true;

    search.search(on_search_succeed);
  });
}

function on_search_succeed(data) {

  /*拿到搜索结果总数*/
  share.set_amount(data.total_count);
  share.set_user_list(data.items);
  pagination.set_amount_and_limit(share.get_amount(), share.get_limit());
  pagination.show();

  /*清空上次搜索结果的HTML*/
  el.reset_user_list();

  /*既然有了数据，不就可以渲染用户列表和页码组件了吗？*/
  el.render();
}

/*监听点击回到顶部*/
function detect_click_top() {
  el.top.addEventListener('click', function () {
    window.scrollTo(0, 0);
  });
}

function detect_click_input() {
  el.input.addEventListener('click', function () {
    history.show();
  });
}

function detect_click_document() {
  /*给html元素加点击事件*/
  document
    .documentElement
    .addEventListener('click', function (e) {
      var target = e.target;

      var in_search_input = target.closest('#search-input')
        // , in_history_list = target.closest('#history-list')
        , is_delete = target.closest('.delete')
      ;

      if (in_search_input || is_delete)
        return;

      history.hide();
    });
}

module.exports = {
  bind_all: bind_all,
}
