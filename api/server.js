const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const SessionStore =require("connect-session-knex")(session);

/**
  Kullanıcı oturumlarını desteklemek için `express-session` paketini kullanın!
  Kullanıcıların gizliliğini ihlal etmemek için, kullanıcılar giriş yapana kadar onlara cookie göndermeyin. 
  'saveUninitialized' öğesini false yaparak bunu sağlayabilirsiniz
  ve `req.session` nesnesini, kullanıcı giriş yapana kadar değiştirmeyin.

  Kimlik doğrulaması yapan kullanıcıların sunucuda kalıcı bir oturumu ve istemci tarafında bir cookiesi olmalıdır,
  Cookienin adı "cikolatacips" olmalıdır.

  Oturum memory'de tutulabilir (Production ortamı için uygun olmaz)
  veya "connect-session-knex" gibi bir oturum deposu kullanabilirsiniz.
 */

const server = express();

const usersRouter=require("./users/users-router")
const authRouter=require("./auth/auth-router")

const sessionConfig={
  name:"cikolatacips",
  secret:process.env.SESSION_SECRET || "ratgele secret",
  cookie:{
    maxAge:1000*100, //100 sn
    secure:process.env.SECURE_COOKIE  || false
  },
  store: new SessionStore({
    knex:require("../data/db-config"),
    tableName:"sessions",
    sidFieldName:"sid",
    createTable:true,
    clearInterval:1000*60*60,
  }),
  httpOnly:true, //js den erişim yapılmaması için güvenlik
  resave:false, //her sayfaya yeniden geldiğinde yeni cookie kaydetmeyecek
  saveUninitialized:false //KVKK için izin almak gerekiyor
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)) //header altında cookie gönderecek

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use("/api/auth",authRouter);
server.use("/api/users",usersRouter);

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
