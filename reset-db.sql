
        
CREATE TABLE articles
(
  id      INT         NOT NULL AUTO_INCREMENT,
  title   VARCHAR(80) NOT NULL,
  author  VARCHAR(80) NOT NULL,
  content TEXT        NOT NULL,
  category_id      INT         NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE categories
(
  id    INT         NOT NULL AUTO_INCREMENT,
  title VARCHAR(80) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE articles
  ADD CONSTRAINT FK_category_TO_articles
    FOREIGN KEY (category_id)
    REFERENCES categories (id);
