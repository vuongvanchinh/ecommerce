#Ecommerce
# Tổng quan

- Trang web bán hàng 
- Các tính năng
  - Login json web token
  - Product variant linh hoạt.
  - Discount
  - Checkout 
  -  ...
- Công nghệ sử dụng
  - backend: python django/django rest framework
  - frontend: reactjs/nextjs
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
##Demo 
![Hình ảnh](https://github.com/vuongvanchinh/ecommerce/blob/main/image.jpg?raw=true)
