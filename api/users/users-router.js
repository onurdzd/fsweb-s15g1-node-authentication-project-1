const express=require("express")

const router=express.Router()

const Users=require("./users-model")
const mw=require("../auth/auth-middleware")
// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!

router.get("/",mw.sinirli,async (req,res,next)=>{
  try {
    const users=await Users.bul()
    res.json(users)
  } catch (error) {
    next(error)
  }
})
/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */


// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports=router
