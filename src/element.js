var share = require('./share');

var output = {
  form: document.getElementById('search-form'),
  input: document.getElementById('search-input'),
  placeholer: document.getElementById('placeholer'),
  top: document.getElementById('top'),
  loading: document.getElementById('loading'),
  pagination: document.getElementById('pagination'),
  pagination_start: document.getElementById('pagination-start'),
  pagination_end: document.getElementById('pagination-end'),
  pagination_container: document.getElementById('pagination-container'),
  user_list: document.getElementById('user-list'),
  reset_user_list: reset_user_list,
  show_loading: show_loading,
  hide_loading: hide_loading,
  render: render,
};

function show_loading() {
  output.loading.hidden = false;
}

function hide_loading() {
  output.loading.hidden = true;
}

/*清空已渲染内容*/
function reset_user_list() {
  output.user_list.innerHTML = '';
}

/**
 * 通过数据生成HTML
 */
function render() {
  /*初始化HTML*/
  var html = '';

  var list = share.get_user_list();

  /*遍历用户列表*/
  list.forEach(function (user) {
    /*每个用户都追加到HTML后面*/
    html = html + `
  <div class="user">
    <a class="avatar" target="_blank" href="${user.html_url}">
      <img src="${user.avatar_url}">
    </a>
    <div class="info">
      <div class="username">${user.login}</div>
      <div><a target="_blank" href="${user.html_url}">${user.html_url}</a></div>
    </div>
  </div>
    `;
  });

  /*将生成的HTML写入模板床*/
  output.user_list.innerHTML = html;
  document
    .getElementById('amount')
    .innerHTML = `共有${share.get_amount()}条结果`;
}

module.exports = output;
