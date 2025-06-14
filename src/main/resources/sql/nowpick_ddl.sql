-- 찜
CREATE TABLE tbl_wishlist (
                          wishlist_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '찜 목록 고유 ID',
                          member_id BIGINT NOT NULL COMMENT '찜한 회원의 ID (FK)',
                          product_id BIGINT NOT NULL COMMENT '찜한 상품의 ID (FK)',
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '찜한 날짜',
                          CONSTRAINT fk_wishlist_member FOREIGN KEY (member_id) REFERENCES member(id),
                          CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES product(id),
                          CONSTRAINT uq_member_product UNIQUE (member_id, product_id) -- 중복 찜 방지
);

-- 장바구니 테이블
CREATE TABLE tbl_cart_item (
                           cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '장바구니 항목 고유 ID',
                           member_id BIGINT NOT NULL COMMENT '회원의 ID (FK)',
                           product_id BIGINT NOT NULL COMMENT '담은 상품의 ID (FK)',
                           quantity INT NOT NULL DEFAULT 1 COMMENT '담은 상품의 수량',
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '장바구니에 추가한 날짜',
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수량 등 정보 수정 날짜',
                           CONSTRAINT fk_cart_member FOREIGN KEY (member_id) REFERENCES member(id),
                           CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES product(id),
                           CONSTRAINT uq_cart_member_product UNIQUE (member_id, product_id) -- 같은 상품 중복 담기 방지
);

-- 1:1 문의 테이블
CREATE TABLE tbl_inquiry (
                             inquiry_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '문의 ID',
                             member_id BIGINT NOT NULL COMMENT '문의 작성자 ID',
                             title VARCHAR(200) NOT NULL COMMENT '문의 제목',
                             content TEXT NOT NULL COMMENT '문의 내용',
                             status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '문의 상태 (PENDING, ANSWERED, CLOSED)',
                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '문의 작성 시각',
                             CONSTRAINT `PK_inquiry` PRIMARY KEY (`inquiry_id`),
                             CONSTRAINT `FK_inquiry_member` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`)
);

-- 1:1 문의 답변 테이블
CREATE TABLE tbl_reply (
                           reply_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '답변 ID',
                           inquiry_id BIGINT NOT NULL COMMENT '연결된 문의 ID',
                           admin_id BIGINT NOT NULL COMMENT '답변한 관리자 ID (회원 테이블 참조)',
                           content TEXT NOT NULL COMMENT '답변 내용',
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '답변 작성 시각',
                           CONSTRAINT `PK_reply` PRIMARY KEY (`reply_id`),
                           CONSTRAINT `FK_reply_inquiry` FOREIGN KEY (`inquiry_id`) REFERENCES tbl_inquiry(`inquiry_id`),
                           CONSTRAINT `FK_reply_admin` FOREIGN KEY (`admin_id`) REFERENCES `tbl_member`(`member_id`),
                           CONSTRAINT `UQ_reply_inquiry` UNIQUE (`inquiry_id`) -- 1:1 관계 보장
);


-- 1:1 문의 채팅 채팅방테이블(채팅의 방 정보)
CREATE TABLE tbl_chat_session (
                                  session_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '채팅 세션 ID',
                                  member_id BIGINT NOT NULL COMMENT '채팅 사용자 ID',
                                  admin_id BIGINT NULL COMMENT '배정된 상담원 ID (회원 테이블 참조)',
                                  status VARCHAR(20) NOT NULL DEFAULT 'OPEN' COMMENT '세션 상태 (OPEN, CLOSED)',
                                  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '세션 시작 시간',
                                  closed_at DATETIME NULL COMMENT '세션 종료 시간',
                                  CONSTRAINT `PK_chat_session` PRIMARY KEY (`session_id`),
                                  CONSTRAINT `FK_chat_session_member` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`),
                                  CONSTRAINT `FK_chat_session_admin` FOREIGN KEY (`admin_id`) REFERENCES `tbl_member`(`member_id`)
);

-- 채팅 메시지 테이블(세션 내에서 오간 메시지)
CREATE TABLE tbl_chat_message (
                                  message_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '채팅 메시지 ID',
                                  session_id BIGINT NOT NULL COMMENT '연결된 채팅 세션 ID',
                                  sender_type VARCHAR(10) NOT NULL COMMENT '메시지 발신자 유형',
                                  sender_id BIGINT NOT NULL COMMENT '발신자 ID (회원 테이블 참조)',
                                  message TEXT NOT NULL COMMENT '메시지 내용',
                                  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '메시지 전송 시각',
                                  CONSTRAINT `PK_chat_message` PRIMARY KEY (`message_id`),
                                  CONSTRAINT `FK_chat_message_session` FOREIGN KEY (`session_id`) REFERENCES tbl_chat_session(`session_id`),
                                  CONSTRAINT `FK_chat_message_member` FOREIGN KEY (`sender_id`) REFERENCES `tbl_member`(`member_id`),
                                  CONSTRAINT `CHK_sender_type` CHECK (`sender_type` IN ('USER', 'ADMIN'))
);

