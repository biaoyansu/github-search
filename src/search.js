var el = require('./element')
  , share = require('./share')
  , pagination = require('./plugin/pagination/pagination')
  , send = require('./util/send')
;

function set_keyword(kwd) {
  el.input.value = kwd;
  share.set_keyword(kwd);
}

function search(on_succeed, on_fail) {
  search_user(on_succeed, on_fail, before_search, after_search);
}

function before_search() {
  el.show_loading();
  pagination.disable();
}

function after_search() {
  el.hide_loading();
  pagination.enable();
}

/*通过用户名搜Github用户
 * @param String keyword 关键词
 * */
function search_user(on_succeed, on_fail, before, after) {

  var url = 'https://api.github.com/search/users?q='
    + share.get_keyword()
    + '&page='
    + share.get_current_page()
    + '&per_page='
    + share.get_limit();


  if (before)
    before();

  get.ajax({
    url: url,
    headers: {
      Authorization: btoa('biaoyansu:8ffae19fc7496f6053cea02cfc365048b2f81d5a')
    },
    on_succeed: function (data) {
      if (on_succeed)
        on_succeed(data);
    },
    on_fail: function () {
      if (on_fail)
        on_fail()
    },
    on_load: function () {
      after();
    }
  })
}

module.exports = {
  search: search,
  set_keyword: set_keyword,
}
