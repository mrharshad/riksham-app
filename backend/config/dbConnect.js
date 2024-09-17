import mongoose from "mongoose";
// same code -
function dbConnect() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`server is connected port: ${mongoose.connection.host}`);
    })
    .catch((err) =>
      console.log(`server in not connected for data base: ${err}`)
    );
}

export default dbConnect;
