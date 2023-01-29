import { MySQLClient } from '@wnynya/mysql-client';

let MySQL;
function setMySQLClient(o) {
  if (o instanceof MySQLClient) {
    MySQL = o;
  } else {
    MySQL = new MySQLClient(o);
  }
}
export { MySQL, MySQL as mysql, setMySQLClient };

const table = {
  articles: 'blog_articles',
  comments: 'blog_comments',
};
export { table };

export default {
  setMySQLClient: setMySQLClient,
};
