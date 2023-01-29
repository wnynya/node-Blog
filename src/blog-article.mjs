import Crypto from '@wnynya/crypto';
import { MySQLClass } from '@wnynya/mysql-client';
import { mysql, table } from './index.mjs';

import { AuthAccount, AuthElement } from '@wnynya/auth';
import BlogComment from './blog-comment.mjs';

export default class BlogArticle extends MySQLClass {
  constructor(uid = Crypto.uid()) {
    super(mysql);

    this.uid = uid;
    this.eid = this.uid;
    this.title = '제목없음';
    this.thumbnail = '';
    this.content = '';
    this.author;
    this.creation = new Date();
    this.modified = this.creation;
    this.tags = [];
    this.category = 'default';
    this.views = 0;

    this.table = table.articles;
    this.schema = {
      uid: 'string',
      eid: 'string',
      title: 'string',
      thumbnail: 'string',
      content: 'string',
      author: [
        (uid) => {
          return new AuthAccount(AuthElement(uid));
        },
        (account) => {
          return account.element.uid;
        },
      ],
      creation: 'date',
      modified: 'date',
      tags: 'array',
      category: 'string',
      views: 'number',
    };
    this.filter = { uid: this.uid };
  }

  async insert() {
    await this.insertQuery();
  }

  async select(parts = '*') {
    await this.selectQuery(parts);
    if (parts.includes('author')) {
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
      eid: this.eid,
      title: {
        html: this.title,
        text: stringify(this.title),
        image: this.thumbnail,
      },
      content: {
        html: this.content,
        text: stringify(this.content),
      },
      author: this.author.toJSON(),
      creation: this.creation.getTime(),
      modified: this.modified.getTime(),
      tags: this.tags,
      category: this.category,
      views: this.views,
    };
  }

  async insertComment(comment) {
    comment.article = this;

    await comment.insert();

    return comment;
  }

  async selectComments(size = 20, page = 1, toJSON = false) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.comments,
      imports: {
        uid: 'string',
      },
      filter: {
        article: this.uid,
      },
      size: size,
      page: page,
    });

    let comments = [];
    const tasks = [];

    for (const data of res) {
      const comment = new BlogComment(data.element);
      comments.push(comment);
      tasks.push(comment.select());
    }

    await Promise.all(tasks);

    if (toJSON) {
      const commentsJSON = [];
      for (const comment of comments) {
        commentsJSON.push(comment.toJSON());
      }
      comments = commentsJSON;
    }

    return comments;
  }

  static async of(string) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.articles,
      imports: {
        uid: 'string',
      },
      filter: {
        uid: string,
        eid: string,
        title: string,
        content: string,
      },
      join: 'OR',
      single: true,
    });

    const uid = res.uid;

    if (!uid) {
      throw 'default404';
    }

    const article = new BlogArticle(uid);

    await article.select();

    return article;
  }

  static async index(
    filter = {},
    size = 10,
    page = 1,
    count = false,
    toJSON = false
  ) {
    const res = await mysql.query({
      statement: 'SELECT',
      table: table.articles,
      imports: {
        uid: 'string',
      },
      filter: filter,
      join: 'OR',
      like: true,
      size: size,
      page: page,
      count: count,
    });

    let articles = [];
    const tasks = [];

    for (const data of res) {
      const article = new BlogArticle(data.uid);
      articles.push(article);
      tasks.push(article.select());
    }

    await Promise.all(tasks);

    if (toJSON) {
      const articlesJSON = [];
      for (const article of articles) {
        articlesJSON.push(article.toJSON());
      }
      articles = articlesJSON;
    }

    return articles;
  }
}

function stringify(string) {
  string = string.replace(/<([^>]*)>/g, ' ');
  string = string.replace(/&nbsp;/g, ' ');
  string = trim(string);
  return string;
}

function trim(string) {
  string = string.replace(/ {2,}/g, ' ');
  string = string.replace(/^ +/, '');
  string = string.replace(/ +$/, '');
  return string;
}
