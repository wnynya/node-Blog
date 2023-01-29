import { MySQLClient } from '@wnynya/mysql-client';

import BlogArticle from './blog-article.mjs';
import BlogComment from './blog-comment.mjs';

export { BlogArticle, BlogComment };

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
  BlogArticle: BlogArticle,
  BlogComment: BlogComment,
  setMySQLClient: setMySQLClient,
};
