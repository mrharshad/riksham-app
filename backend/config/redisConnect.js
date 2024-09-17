import { createClient } from "redis";

const client = createClient({
  password: "DneZppkVrJcosoKQ2ywuLh2CrBnQHwoz",
  socket: {
    host: "redis-13472.c330.asia-south1-1.gce.redns.redis-cloud.com",
    port: 13472,
  },
  // socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});
// client.configSet("no_persistence");
client.on("error", (err) => console.log("err", err));

if (!client.isOpen) {
  client.connect();
  console.log("redis server is connected");
}

export default client;
