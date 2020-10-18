-- PSQL
-- For help \?
-- list database \l
-- list all tables in database \d
-- table structure \d table_name
-- create database CREATE DATABASE database_name;

CREATE DATABASE practicedb;

CREATE Table products (
    id INT,
    name VARCHAR(50),
    price INT,
    un_sale Boolean
);

ALTER TABLE products 
ADD COLUMN featured Boolean;

ALTER TABLE products 
DROP COLUMN featured;

DROP TABLE products;

DROP DATABASE database_name;

-- Yelp Restaurant Database

DROP DATABASE yelp;

CREATE TABLE restaurants (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL check(price_range >=1 and price_range <=5)
);

INSERT INTO restaurants (name, location, price_range)
VALUES ('RRR', 'mysuru', 5);

SELECT * FROM restaurants;

SELECT name, price_range  FROM restaurants;

CREATE TABLE reviews(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    reviews TEXT NOT NULL,
    ratings INT NOT NULL CHECK(ratings >= 1 and ratings <=5)
);