const { MongoClient, ObjectId } = require("mongodb");

const create_user = async (data) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("users")
      .insertOne(data);
    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

const validate_user = async (body) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const user = await client
      .db("nosql_project")
      .collection("users")
      .findOne({ email: body.email, password: body.password });
    return user;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

const create_profile = async (body) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  console.log(typeof body.user_id);
  try {
    const result = await client
      .db("nosql_project")
      .collection("users")
      .updateOne(
        { _id: new ObjectId(body.user_id) },
        { $set: { profile: body.profile } }
      );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

const get_user = async (id) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

module.exports = { create_user, validate_user, create_profile, get_user };
