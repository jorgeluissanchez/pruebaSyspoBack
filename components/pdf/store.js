const Model = require("./model");

const createStore = (res) => {
  const pdf = new Model(res);
  return pdf.save();
};

const readOneStore = async (id) => {
  const pdf = await Model.findById(id);
  return pdf;
};

const readAllStore = () => {
  return Model.find();
};

const updateStore = async (id, res) => {
  const pdf = await Model.findByIdAndUpdate(id, res);
  return pdf;
};

const deleteStore = (_id) => {
  return Model.deleteOne({ _id });
};

module.exports = {
  createStore,
  readOneStore,
  readAllStore,
  updateStore,
  deleteStore,
};
