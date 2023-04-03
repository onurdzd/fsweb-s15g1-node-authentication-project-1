const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model");
const mw = require("./auth-middleware");

// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */

router.post(
  "/register",
  mw.sifreGecerlimi,
  mw.usernameBostami,
  async (req, res, next) => {
    try {
      const user = req.body;
      const hashedPassword = bcrypt.hashSync(user.password, 12);
      user.password = hashedPassword;
      const newUser = await User.ekle(user);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */

router.post(
  "/login",
  mw.sifreGecerlimi,
  mw.usernameVarmi,
  async (req, res, next) => {
    try {
      const registeredUser = await User.goreBul(req.body);
      if (
        registeredUser &&
        bcrypt.compareSync(req.body.password, registeredUser.password)
      ) {
        req.session.userId=registeredUser.user_id
        res.status(200).json({ message: "Hoşgeldin sue!" });
      } else {
        res.status(401).json({ message: "Geçersiz kriter!" });
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

  router.get(
    "/logout",
     (req, res, next) => {
        if(req.session){
          req.session.destroy(err=>{
            if(err){
              res.status(400).json({ "message": "Oturum bulunamadı!"}) //oturum olmasa bile burayı göstermiyor
            }else{
              res.status(200).json({ "message": "Çıkış yapildi"})
            }
          })
        }
    }
  );

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;
