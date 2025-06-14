-- 관리자 계정 (username: admin / password: admin)
INSERT INTO tbl_member (
    member_id, member_username, member_password, member_email, member_nickname,
    member_phone_number, member_role, member_created_at, member_updated_at, member_is_active
) VALUES (
             1, 'admin', '$2a$10$qfFdRzHwvQCKUu4KH7ZByOc6zz3bN1BvHAPQjDWfA6BiK9h51sREu',
             'admin@example.com', '관리자', '010-0000-0000', 'ADMIN', NOW(), NOW(), true
         );

-- 일반 회원 계정 (username: user / password: user)
INSERT INTO tbl_member (
    member_id, member_username, member_password, member_email, member_nickname,
    member_phone_number, member_role, member_created_at, member_updated_at, member_is_active
) VALUES (
             2, 'user', '$2a$10$f5nQUYpI3YjzDG71u3gfX.NWBXnQx5Zz9IbaDC0a6u6/kMY6Sl2vy',
             'user@example.com', '일반회원', '010-1111-1111', 'USER', NOW(), NOW(), true
         );



-- 커피
INSERT INTO tbl_menu (menu_name, menu_description, menu_price, menu_category, menu_image_url, menu_is_ice_available) VALUES
  ('아메리카노', '산미가 적당한 원두를 사용한 아메리카노', 3500, 'COFFEE', '/images/coffee/iced_americano.png', true),
  ('카페라떼', '부드러운 우유와 에스프레소의 조화', 4000, 'COFFEE', '/images/coffee/iced_cafelatte.png', true),
  ('바닐라라떼', '바닐라 시럽이 들어간 달콤한 라떼', 4300, 'COFFEE', '/images/coffee/vanilla_latte.png', true),
  ('콜드브루', '깊고 진한 풍미의 콜드브루 커피', 4500, 'COFFEE', '/images/coffee/iced_americano.png', true),
  ('카라멜마끼야또', '카라멜 시럽과 에스프레소가 어우러진 달콤한 음료', 4800, 'COFFEE', '/images/coffee/caramelmacchiato.png', true),
  ('카페모카', '초콜릿과 커피가 조화를 이루는 진한 맛', 4700, 'COFFEE', '/images/coffee/cafe_mocha.png', true),
  ('돌체라떼', '우유와 연유의 부드럽고 달콤한 맛', 4900, 'COFFEE', '/images/coffee/dolce_latte.png', true),
  ('바닐라크림콜드브루', '바닐라 크림이 올라간 부드러운 콜드브루', 5000, 'COFFEE', '/images/coffee/vanillacream_coldbrew.png', true),
  ('코코넛라떼', '코코넛의 고소함이 가미된 이색 라떼', 5200, 'COFFEE', '/images/coffee/coconut_latte.png', true),
  ('아포가토', '바닐라 아이스크림에 에스프레소를 부은 디저트 음료', 5500, 'COFFEE', '/images/coffee/affogato.jpg', true);

-- 논커피/티
INSERT INTO tbl_menu (menu_name, menu_description, menu_price, menu_category, menu_image_url, menu_is_ice_available) VALUES
   ('초코라떼', '진한 초콜릿과 우유가 어우러진 달콤한 음료', 4200, 'NON_COFFEE', '/images/non-coffee/choco_latte.png', true),
   ('녹차라떼', '고소한 말차가루로 만든 라떼', 4500, 'NON_COFFEE', '/images/non-coffee/iced_greentea_latte.jpg', true),
   ('청사과요거트스무디', '상큼한 청사과와 요거트의 조화', 4900, 'NON_COFFEE', '/images/non-coffee/greenappleyogurt_smoothie.png', true),
   ('망고스무디', '달콤한 망고로 만든 시원한 스무디', 4700, 'NON_COFFEE', '/images/non-coffee/mango_smoothie.png', true),
   ('파인애플스무디', '열대과일 파인애플의 상큼함이 가득', 4700, 'NON_COFFEE', '/images/non-coffee/pineapple_smoothie.png', true),
   ('딸기복숭아화채스무디', '딸기와 복숭아, 화채가 어우러진 특별한 스무디', 5300, 'NON_COFFEE', '/images/non-coffee/strawberrypeach_punchsmoothie.png', true),
   ('요거트스무디', '요거트 본연의 고소함과 시원함', 4500, 'NON_COFFEE', '/images/non-coffee/yogurt_smoothie.png', true),
   ('요거트밀크화채', '달콤한 요거트와 신선한 과일 화채의 조합', 5200, 'NON_COFFEE', '/images/non-coffee/yogurtmilkpunch.png', true);

-- 디저트
INSERT INTO tbl_menu (menu_name, menu_description, menu_price, menu_category, menu_image_url, menu_is_ice_available) VALUES
 ('티라미수', '마스카포네 치즈와 에스프레소가 어우러진 이탈리안 디저트', 5000, 'DESSERT', '/images/dessert/tiramisu.jpg', false),
 ('크로플', '바삭한 크로와상 와플, 바닐라 아이스크림 추가 가능', 4800, 'DESSERT', '/images/dessert/croffle.jpg', false),
 ('마카롱 3구 세트', '컬러풀하고 달콤한 마카롱 3개 세트', 5500, 'DESSERT', '/images/dessert/macaron_set.png', false),
 ('멜론빵', '멜론향과 바삭한 식감이 살아있는 달콤한 빵', 2800, 'DESSERT', '/images/dessert/melon-bread.jpg', false),
 ('소금빵', '겉은 바삭하고 속은 촉촉한 담백한 소금빵', 2500, 'DESSERT', '/images/dessert/salt-bread.png', false),
 ('크리미슈', '부드러운 크림이 가득 들어간 촉촉한 슈', 3000, 'DESSERT', '/images/dessert/creamychoux.png', false),
 ('햄치즈샌드위치', '고소한 햄과 치즈가 조화를 이루는 든든한 샌드위치', 4500, 'DESSERT', '/images/dessert/ham_cheese.png', false),
 ('고구마빵', '달콤한 고구마 필링이 들어간 폭신한 빵', 3200, 'DESSERT', '/images/dessert/sweetpotato_bread.png', false),
 ('감자빵', '고소한 감자와 치즈가 어우러진 든든한 간식', 3200, 'DESSERT', '/images/dessert/potato_bread.png', false);