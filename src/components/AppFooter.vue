<template>
  <footer class="main-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4">
          <a href="index.html" class="footer-logo">Blong</a>
          <p class="text-muted mt-2 small">
            Horizone là nền tảng nơi du khách khám phá và đặt vé máy bay, khách
            sạn, và nhiều dịch vụ khác.
          </p>
          <div class="social-icons">
            <a href="https://www.facebook.com/hoang.long.119764/"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com/hoaglog20.04"
              ><i class="fab fa-instagram"></i
            ></a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="fw-bold mb-3">Về Chúng Tôi</h6>
          <ul class="list-unstyled footer-list">
            <li><a href="#">Về Blong</a></li>
            <li><a href="#">Tuyển Dụng</a></li>
          </ul>
        </div>
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="fw-bold mb-3">Hỗ Trợ</h6>
          <ul class="list-unstyled footer-list">
            <li><a href="#">Liên Hệ</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div class="col-lg-5 col-md-6 mb-4">
          <h6 class="fw-bold mb-3">Nhận Tin Mới</h6>
          <p class="small text-muted">
            Đăng ký nhận tin tức và ưu đãi du lịch mới nhất.
          </p>
          <form class="d-flex footer-form">
            <input
              type="email"
              class="form-control"
              placeholder="Email của bạn"
            />
            <button class="btn" type="submit">Đăng Ký</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom text-center">
        <p class="mb-0">&copy; 2025 HoHoangLong.</p>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.main-footer {
  background-color: var(--color-white);
  padding: 50px 0;
  color: var(--color-text-dark);
  border-radius: 20px;
  margin-top: 40px;
}
.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-brown);
  margin-bottom: 20px;
  text-decoration: none;
}
.footer-list li a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 2.2;
}
.footer-list li a:hover {
  color: var(--color-primary-brown);
}
.social-icons a {
  color: #999;
  font-size: 1.2rem;
  margin-right: 15px;
  transition: color 0.2s;
}
.social-icons a:hover {
  color: var(--color-primary-brown);
}
.footer-form .btn {
  background-color: var(--color-primary-brown);
  color: white;
}
.footer-bottom {
  border-top: 1px solid var(--color-border-light);
  padding-top: 20px;
  margin-top: 20px;
}
</style>
