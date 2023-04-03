const db = require("../../data/db-config");

/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
function bul() {
  return db("users")
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
function goreBul(filtre) {
  return db("users").where("username", filtre.username).first();
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  const result=await db("users").where("user_id", user_id).first();

  return {
    "user_id": result.uder_id,
    "username": result.username
  }
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  let newUserId=await db("users").insert(user)
  let newUser=await idyeGoreBul(newUserId)
  return {
    "user_id": newUserId[0],
    "username": newUser.username
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
