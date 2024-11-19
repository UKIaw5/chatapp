db = db.getSiblingDB("chatapp");
db.createUser({
  user: "chatappuser",
  pwd: "chatappuserpass",
  roles: [
    { role: "readWrite", db: "chatapp" },
    { role: "dbAdmin", db: "chatapp" },
  ],
});
