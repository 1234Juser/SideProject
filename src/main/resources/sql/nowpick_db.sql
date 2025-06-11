-- 1) 디폴트 데이터베이스 스키마인 mysql로 이동
USE mysql;

#SELECT * FROM user;
SHOW databases;

-- 2) 데이터베이스 생성(nowpickdb)
CREATE DATABASE nowpickdb;
SHOW DATABASES;

-- 3) 유저 생성 (nowpick/nowpick)
CREATE USER 'nowpick'@'%' IDENTIFIED BY 'nowpick';
SELECT * FROM user;


-- 4) 유저에게 권한 부여
GRANT ALL PRIVILEGES ON nowpickdb.* TO 'nowpick'@'%';
SHOW GRANTS FOR 'nowpick'@'%';


-- 5) SQL을 실행할 타겟 스키마(nowpickdb)로 이동
USE nowpickdb;