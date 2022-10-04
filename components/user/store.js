const Model = require("./model");

const createStore = (user) => {
  const token = new Model(user);
  return token.save();
};

const readAllStore = () => {
  return Model.find();
};

const readOneStore = async (id) => {
  const data = await Model.findById(id);
  return data;
};

const updateStore = async (id, user) => {
  const data = await Model.findByIdAndUpdate(id, user);
  return data;
};

const deleteStore = (id) => {
  return Model.deleteOne({
    _id: id,
  });
};

module.exports = {
  createStore,
  readOneStore,
  readAllStore,
  updateStore,
  deleteStore,
};
