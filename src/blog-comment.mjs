import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';

import BlogArticle from './blog-article.mjs';

export default class BlogComment extends MySQLClass {
  constructor(uid = Crypto.uid()) {
    super(mysql);

    this.uid = uid;
    this.article;
    this.replyof;
    this.content = '';
    this.author;
    this.name;
    this.email;
    this.home;
    this.creation = new Date();
    this.modified = this.creation;

    this.table = table.comments;
    this.schema = {
      uid: 'string',
      article: [
        (uid) => {
          return new BlogArticle(uid);
        },
        (article) => {
          return article.uid;
        },
      ],
      replyof: 'string',
      content: 'string',
      author: [
        (uid) => {
          if (!uid || uid == '') {
            return null;
          } else {
            return new AuthAccount(AuthElement(uid));
          }
        },
        (account) => {
          return account.element.uid;
        },
      ],
      name: 'string',
      email: 'string',
      home: 'string',
      creation: 'date',
      modified: 'date',
    };
    this.filter = { uid: this.uid };
  }

  async insert() {
    await this.insertQuery();
  }

  async select(parts = '*') {
    await this.selectQuery(parts);
    if (parts.includes('author') && this.author) {
      await this.author.select([
        'element',
        'eid',
        'email',
        'label',
        'lastused',
      ]);
    }
  }

  async update(parts) {
    await this.updateQuery(parts);
  }

  async delete() {
    await this.deleteQuery();
  }

  toJSON() {
    return {
      uid: this.uid,
      article: this.article.uid,
      content: {
        html: this.content,
      },
      author: this.author ? this.author.toJSON() : null,
      name: this.name ? this.name : null,
      email: this.email ? this.email : null,
      home: this.home ? this.home : null,
      creation: this.creation.getTime(),
      modified: this.modified.getTime(),
    };
  }
}
