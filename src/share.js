var user_list = []
  , keyword
  , limit = 5
  , current_page = 1
  , amount
;

function get_keyword() {
  return keyword;
}

function set_keyword(val) {
  keyword = val;
  return keyword;
}

function get_limit() {
  return limit;
}

function set_limit(val) {
  limit = val;
  return limit;
}

function get_current_page() {
  return current_page;
}

function set_current_page(val) {
  current_page = val;
  return current_page;
}

function get_amount() {
  return amount;
}

function set_amount(val) {
  amount = val;
  return amount;
}

function get_user_list() {
  return user_list;
}

function set_user_list(val) {
  user_list = val;
  return user_list;
}

module.exports = {
  get_keyword: get_keyword,
  set_keyword: set_keyword,
  get_limit: get_limit,
  set_limit: set_limit,
  get_current_page: get_current_page,
  set_current_page: set_current_page,
  get_amount: get_amount,
  set_amount: set_amount,
  get_user_list: get_user_list,
  set_user_list: set_user_list,
}
