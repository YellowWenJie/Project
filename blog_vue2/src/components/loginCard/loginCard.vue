<template>
  <div class="logincard">
    <div class="materialContainer">
      <div class="box">
        <div class="title">LOGIN</div>

        <div class="input">
          <label for="name">Username</label>
          <input
            type="text"
            ref="loginUsername"
            name="name"
            id="name"
            onkeyup="value = value.replace(/[^a-z0-9]|^[^a-z]/ig,'')"
          />
          <span class="spin"></span>
        </div>

        <div class="input">
          <label for="pass">Password</label>
          <input type="password" ref="loginPassword" name="pass" id="pass" />
          <span class="spin"></span>
        </div>

        <div class="button login" @click="login">
          <button>
            <span>GO</span>
            <i class="fa fa-check"></i>
          </button>
        </div>

        <a href="javascript:;" class="pass-forgot">Forgot your password?</a>
      </div>

      <div class="overbox">
        <div class="material-button alt-2">
          <span class="shape"></span>
        </div>

        <div class="title">REGISTER</div>

        <div class="input">
          <label for="regname">Username</label>
          <input
            type="text"
            ref="regName"
            name="regname"
            id="regname"
            onkeyup="value = value.replace(/[^a-z0-9]|^[^a-z]/ig,'')"
          />
          <span class="spin"></span>
        </div>

        <div class="input">
          <label for="regpass">Password</label>
          <input type="password" ref="regPassword" name="regpass" id="regpass" />
          <span class="spin"></span>
        </div>

        <div class="input">
          <label for="reregpass">Repeat Password</label>
          <input type="password" ref="regPasswords" name="reregpass" id="reregpass" />
          <span class="spin"></span>
        </div>

        <div class="button">
          <button @click="register">
            <span>NEXT</span>
          </button>
        </div>
      </div>
    </div>
    <div class="bgc"></div>
  </div>
</template>
<script>
import $ from "jquery";
import requests from "../../api/ajax";
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    errHint(rule, message) {
      if (rule) {
        this.$notify.error({
          title: "错误",
          message: message,
        });
      }
      return;
    },

    jquery() {
      $(function () {
        $(".input input")
          .focus(function () {
            $(this)
              .parent(".input")
              .each(function () {
                $("label", this).css({
                  "line-height": "18px",
                  "font-size": "18px",
                  "font-weight": "100",
                  top: "0px",
                });
                $(".spin", this).css({
                  width: "100%",
                });
              });
          })
          .blur(function () {
            $(".spin").css({
              width: "0px",
            });
            if ($(this).val() == "") {
              $(this)
                .parent(".input")
                .each(function () {
                  $("label", this).css({
                    "line-height": "60px",
                    "font-size": "24px",
                    "font-weight": "300",
                    top: "10px",
                  });
                });
            }
          });

        $(".button").click(function (e) {
          var pX = e.pageX,
            pY = e.pageY,
            oX = parseInt($(this).offset().left),
            oY = parseInt($(this).offset().top);

          $(this).append(
            '<span class="click-efect x-' +
              oX +
              " y-" +
              oY +
              '" style="margin-left:' +
              (pX - oX) +
              "px;margin-top:" +
              (pY - oY) +
              'px;"></span>'
          );
          $(".x-" + oX + ".y-" + oY + "").animate(
            {
              width: "500px",
              height: "500px",
              top: "-250px",
              left: "-250px",
            },
            600
          );
          // $("button", this).addClass("active");
        });

        $(".alt-2").click(function () {
          if (!$(this).hasClass("material-button")) {
            $(".shape").css({
              width: "100%",
              height: "100%",
              transform: "rotate(0deg)",
            });

            setTimeout(function () {
              $(".overbox").css({
                overflow: "initial",
              });
            }, 600);

            $(this).animate(
              {
                width: "140px",
                height: "140px",
              },
              500,
              function () {
                $(".box").removeClass("back");

                $(this).removeClass("active");
              }
            );

            $(".overbox .title").fadeOut(300);
            $(".overbox .input").fadeOut(300);
            $(".overbox .button").fadeOut(300);

            $(".alt-2").addClass("material-buton");
          }
        });

        $(".material-button").click(function () {
          if ($(this).hasClass("material-button")) {
            setTimeout(function () {
              $(".overbox").css({
                overflow: "hidden",
              });
              $(".box").addClass("back");
            }, 200);
            $(this).addClass("active").animate({
              width: "700px",
              height: "700px",
            });

            setTimeout(function () {
              $(".shape").css({
                width: "50%",
                height: "50%",
                transform: "rotate(45deg)",
              });

              $(".overbox .title").fadeIn(300);
              $(".overbox .input").fadeIn(300);
              $(".overbox .button").fadeIn(300);
            }, 700);

            $(this).removeClass("material-button");
          }

          if ($(".alt-2").hasClass("material-buton")) {
            $(".alt-2").removeClass("material-buton");
            $(".alt-2").addClass("material-button");
          }
        });
      });
    },

    async login() {
      const username = this.$refs.loginUsername.value;
      const password = this.$refs.loginPassword.value;
      let userNameRule = !(username.length < 11 && username.length > 1);
      this.errHint(userNameRule, "请输入 1 ~ 10 位 Username");
      let passWordRule = !(password.length > 5 && password.length < 13);
      this.errHint(passWordRule, "请输入 6 ~ 12 位 Password");
      const loginfo = { username, password };
      const login = () =>
        requests({
          url: "api/user/login",
          method: "POST",
          data: loginfo,
        });
      let logins = await login();
      console.log(logins);
      if (logins.state == 1) {
        this.$message({
          message: "登陆成功",
          type: "success",
        });
      }
      if (logins.state == 0) {
        this.$message.error(logins.message);
        return;
      }
      // 将 token 保存在 session Storage 中
      window.sessionStorage.setItem("token", logins.message);

      // 退出登录 清除 token
      // window.sessionStorage.clear();
    },
    async register() {
      const reaName = this.$refs.regName.value;
      const regPassword = this.$refs.regPassword.value;
      const regPasswords = this.$refs.regPasswords.value;
      let userNameRule = !(reaName.length < 11 && reaName.length > 1);
      this.errHint(userNameRule, "请输入 1 ~ 10 位 Username");
      let passWordRule =
        !(regPassword.length > 5 && regPassword.length < 13) ||
        !(regPasswords.length > 5 && regPasswords.length < 13);
      this.errHint(passWordRule, "请输入 6 ~ 12 位 Password");
      this.errHint(regPassword !== regPasswords, "请确认密码");
      const loginfo = { username: reaName, password: regPassword };
      const login = () =>
        requests({
          url: "api/user/reguser",
          method: "POST",
          data: loginfo,
        });
      let logins = await login();
      console.log(logins);
      if (logins.state == 1) {
        this.$message({
          message: "注册成功",
          type: "success",
        });
        return;
      }
      if (logins.state == 0) {
        this.$message.error(logins.message);
        return;
      }
    },
  },
  computed: {},
  mounted() {
    this.jquery();
  },
};
</script>
<style lang='scss' scoped>
.box {
  position: relative;
  top: 0;
  opacity: 1;
  float: left;
  padding: 60px 50px 40px 50px;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  transform: scale(1);
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  z-index: 5;

  &.back {
    transform: scale(0.95);
    -webkit-transform: scale(0.95);
    -ms-transform: scale(0.95);
    top: -20px;
    opacity: 0.8;
    z-index: -1;
  }

  &:before {
    content: "";
    width: 100%;
    height: 30px;
    border-radius: 10px;
    position: absolute;
    top: -10px;
    background: rgba(255, 255, 255, 0.6);
    left: 0;
    transform: scale(0.95);
    -webkit-transform: scale(0.95);
    -ms-transform: scale(0.95);
    z-index: -1;
  }
}

.overbox .title {
  color: #fff;

  &:before {
    background: #fff;
  }
}

.title {
  width: 100%;
  float: left;
  line-height: 46px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ed2553;
  position: relative;

  &:before {
    content: "";
    width: 5px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -50px;
    background: #ed2553;
  }
}

.input {
  transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  label,
  input,
  .spin {
    transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.button {
  transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  button .button.login button i.fa {
    transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.material-button .shape {
  &:before,
  &:after {
    transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.button.login button {
  transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  -ms-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.material-button,
.alt-2,
.material-button .shape,
.alt-2 .shape,
.box {
  transition: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  -ms-transition: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.input {
  width: 100%;
  float: left;

  label,
  input,
  .spin {
    width: 100%;
    float: left;
  }
}

.button {
  width: 100%;
  float: left;

  button {
    width: 100%;
    float: left;
  }
}

.input,
.button {
  margin-top: 30px;
  height: 70px;
}

.input {
  position: relative;

  input {
    position: relative;
  }
}

.button {
  position: relative;

  button {
    position: relative;
  }
}

.input {
  input {
    height: 60px;
    top: 10px;
    border: none;
    background: transparent;
    font-family: "Roboto", sans-serif;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 300;
  }

  label {
    font-family: "Roboto", sans-serif;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 300;
  }
}

.button button {
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 300;
}

.input {
  &:before,
  .spin {
    width: 100%;
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  &:before {
    content: "";
    background: rgba(0, 0, 0, 0.1);
    z-index: 3;
  }

  .spin {
    background: #ed2553;
    z-index: 4;
    width: 0;
  }
}

.overbox .input {
  .spin {
    background: rgba(255, 255, 255, 1);
  }

  &:before {
    background: rgba(255, 255, 255, 0.5);
  }
}

.input label {
  position: absolute;
  top: 10px;
  left: 0;
  z-index: 2;
  cursor: pointer;
  line-height: 60px;
}

.button {
  &.login {
    width: 60%;
    left: 20%;

    button {
      width: 100%;
      line-height: 64px;
      left: 0%;
      background-color: transparent;
      border: 3px solid rgba(0, 0, 0, 0.1);
      font-weight: 900;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.2);
    }
  }

  button {
    width: 100%;
    line-height: 64px;
    left: 0%;
    background-color: transparent;
    border: 3px solid rgba(0, 0, 0, 0.1);
    font-weight: 900;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.2);
  }

  &.login {
    margin-top: 30px;
  }

  margin-top: 20px;

  button {
    background-color: #fff;
    color: #ed2553;
    border: none;
  }

  &.login button {
    &.active {
      border: 3px solid transparent;
      color: #fff !important;

      span {
        opacity: 0;
        transform: scale(0);
        -webkit-transform: scale(0);
        -ms-transform: scale(0);
      }

      i.fa {
        opacity: 1;
        transform: scale(1) rotate(-0deg);
        -webkit-transform: scale(1) rotate(-0deg);
        -ms-transform: scale(1) rotate(-0deg);
      }
    }

    i.fa {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      line-height: 60px;
      transform: scale(0) rotate(-45deg);
      -webkit-transform: scale(0) rotate(-45deg);
      -ms-transform: scale(0) rotate(-45deg);
    }

    &:hover {
      color: #ed2553;
      border-color: #ed2553;
    }
  }

  margin: 40px 0;
  overflow: hidden;
  z-index: 2;

  button {
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
}

.pass-forgot {
  width: 100%;
  float: left;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 18px;
}

.click-efect {
  position: absolute;
  top: 0;
  left: 0;
  background: #ed2553;
  border-radius: 50%;
}

.overbox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: inherit;
  border-radius: 10px;
  padding: 60px 50px 40px 50px;

  .title,
  .button,
  .input {
    z-index: 111;
    position: relative;
    color: #fff !important;
    display: none;
  }

  .title {
    width: 80%;
  }

  .input {
    margin-top: 20px;

    input,
    label {
      color: #fff;
    }
  }

  .material-button,
  .alt-2 {
    display: block;

    .shape {
      display: block;
    }
  }
}

.material-button,
.alt-2 {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #ed2553;
  position: absolute;
  top: 40px;
  right: -70px;
  cursor: pointer;
  z-index: 100;
  transform: translate(0%, 0%);
  -webkit-transform: translate(0%, 0%);
  -ms-transform: translate(0%, 0%);
}

.material-button .shape,
.alt-2 .shape {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.material-button .shape:before,
.alt-2 .shape:before,
.material-button .shape:after,
.alt-2 .shape:after {
  content: "";
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(360deg);
  -webkit-transform: translate(-50%, -50%) rotate(360deg);
  -ms-transform: translate(-50%, -50%) rotate(360deg);
}

.material-button .shape:before,
.alt-2 .shape:before {
  width: 25px;
  height: 4px;
}

.material-button .shape:after,
.alt-2 .shape:after {
  height: 25px;
  width: 4px;
}

.material-button.active,
.alt-2.active {
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%) rotate(0deg);
  -webkit-transform: translate(50%, -50%) rotate(0deg);
  -ms-transform: translate(50%, -50%) rotate(0deg);
}

body {
  background-image: url(https://lh4.googleusercontent.com/-XplyTa1Za-I/VMSgIyAYkHI/AAAAAAAADxM/oL-rD6VP4ts/w1184-h666/Android-Lollipop-wallpapers-Google-Now-Wallpaper-2.png);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  overflow: hidden;
}

html {
  overflow: hidden;
}

.materialContainer {
  width: 100%;
  max-width: 460px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style-type: none;
  outline: none;

  &:after,
  &::before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    text-decoration: none;
    list-style-type: none;
    outline: none;
  }
}
.bgc {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: bgc 1s forwards;
}
@keyframes bgc {
  0% {
    background: rgba(0, 0, 0, 0);
  }
  100% {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
  }
}
</style>