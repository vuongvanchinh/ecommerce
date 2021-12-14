#Ecommerce
# Tổng quan
- Trang web bán hàng 
- Các tính năng
  - Login json web token
  - Sign in
  - Product variant linh hoạt.
  - Discount
  - Checkout 
  -  ...
# Yêu cầu 
  * Docker
  * npm/yarn
# Cách chạy
```
docker-compose run backend python manage.py migrate
```
sau đó tạo user admin
```
docker-compose run backend python manage.py createsuperuser
```
khởi chạy
```
docker-compose up
```
