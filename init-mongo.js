db = db.getSiblingDB("admin");

db.createUser({
  user: "root",
  pwd: "rootpassword",
  roles: [
    { role: "root", db: "admin" }
  ]
});

db = db.getSiblingDB("chatapp");

db.createUser({
  user: "chatappuser",
  pwd: "chatappuserpass",
  roles: [
    { role: "readWrite", db: "chatapp" }
  ]
});
