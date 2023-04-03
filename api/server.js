const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')

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

const sessionConfig={
  name:"codebuster",
  secret:process.env.SESSION_SECRET || "ratgele secret",
  cookie:{
    maxAge:1000*10000, //10000 sn
    secure:process.env.SECURE_COOKIE  || false
  },
  httpOnly:true, //js den erişim yapılmaması için güvenlik
  resave:false, //her sayfaya yeniden geldiğinde yeni cooki kaydetmeyecek
  saveUninitialized:false //KVKK için izin almak gerekiyor
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)) //header altında cookie gönderecek

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
