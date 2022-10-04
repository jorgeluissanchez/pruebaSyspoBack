const { config } = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const Model = require("./model");
const {
  createStore,
  readOneStore,
  readAllStore,
  updateStore,
  deleteStore,
} = require("./store");

const fs = require("fs");

const schemaResgister = Joi.object({
  user: Joi.string().required().min(5).max(15),
  full_name: Joi.string().required().min(5).max(15),
  city: Joi.string().required().min(3).max(15),
  country: Joi.string().required().min(3).max(15),
  age: Joi.number().integer().required().min(18).max(100),
  gender: Joi.string().required().min(3).max(15),
  password: Joi.string().required().min(5).max(15),
  identificationType: Joi.string().required().min(3).max(15),
  identification: Joi.number()
    .integer()
    .required()
    .min(1000000)
    .max(9999999999),
});

const schemaLogin = Joi.object({
  user: Joi.string().required().min(5).max(15),
  password: Joi.string().required().min(5).max(15),
});

const createController = (data) => {
  const {
    user,
    full_name,
    city,
    country,
    age,
    gender,
    identificationType,
    identification,
    password,
  } = data;

  return new Promise(async (resolve, reject) => {
    const { error } = schemaResgister.validate({
      user,
      full_name,
      city,
      country,
      age,
      gender,
      identificationType,
      identification,
      password,
    });

    if (!error) {
      const findUser = await Model.findOne({ user }).exec();

      if (findUser == null) {
        const salt = await bcrypt.genSalt(10);
        const passw = await bcrypt.hash(password, salt);

        info = {
          user,
          full_name,
          city,
          country,
          age,
          gender,
          identificationType,
          identification,
          password: passw,
        };

        return resolve(createStore(info));
      } else {
        reject("El usuario ya existe");
      }
    } else {
      reject(error.details);
    }
  });
};

const readOneController = (id) => {
  return readOneStore(id);
};

const readAllController = () => {
  return readAllStore();
};

const updateController = async (id, body) => {
  let {
    user,
    full_name,
    city,
    pfp,
    signature,
    country,
    age,
    gender,
    identificationType,
    identification,
    password,
  } = body;

  await readOneStore(id)
    .then(async (info) => {
      if (user == undefined) {
        user = info.user;
      }
      if (full_name == undefined) {
        full_name = info.full_name;
      }
      if (city == undefined) {
        city = info.city;
      }
      if (country == undefined) {
        country = info.country;
      }
      if (age == undefined) {
        age = info.age;
      }
      if (gender == undefined) {
        gender = info.gender;
      }
      if (identificationType == undefined) {
        identificationType = info.identificationType;
      }
      if (identification == undefined) {
        identification = info.identification;
      }
      if (password == undefined) {
        password = info.password;
      }
      if (pfp == undefined) {
        pfp = info.pfp;
      } else {
        const buffer = Buffer.from(pfp, "base64");
        fs.writeFileSync(`public/image/p${id}.jpg`, buffer);
        pfp = `http://localhost:5000/app/image/p${id}.jpg`;
      }
      if (signature == undefined) {
        signature = info.signature;
      } else {
        const buffer = Buffer.from(signature, "base64");
        fs.writeFileSync(`public/image/s${id}.jpg`, buffer);
        signature = `http://localhost:5000/app/image/s${id}.jpg`;
      }

      const res = {
        user,
        full_name,
        city,
        pfp,
        signature,
        country,
        age,
        gender,
        identificationType,
        identification,
        password,
      };
      return res;
    })
    .then((res) => {
      return updateStore(id, res);
    })
    .catch((e) => console.log(e));
};
const deleteController = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("no hay id");
      return false;
    }
    deleteStore(id)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const validateController = (data, cookies, res) => {
  const { user, password } = data;

  return new Promise(async (resolve, reject) => {
    const { error } = schemaLogin.validate({
      user,
      password,
    });

    if (!error) {
      const findUser = await Model.findOne({ user: user });

      if (!findUser) {
        return reject("Usuario o contraseña incorrectos");
      } else {
        const validPassword = await bcrypt.compare(password, findUser.password);
        if (!validPassword) {
          return reject("Usuario o contraseña incorrectos");
        } else {
          const access_token = jwt.sign(
            {
              id: findUser._id,
            },
            config.authJwtSecret,
            { expiresIn: "24h" }
          );

          const newRefreshToken = jwt.sign(
            {
              id: findUser._id,
            },
            config.refreshJwtSecret,
            { expiresIn: "24h" }
          );

          let newRefreshTokenArray = !cookies.jwt
            ? findUser.refreshToken
            : findUser.refreshToken.filter((token) => token !== cookies.jwt);

          if (cookies.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await Model.findOne({
              refreshToken: refreshToken,
            });
            if (!foundToken) {
              newRefreshTokenArray.push(newRefreshToken);
            }
            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            });
          }
          findUser.refreshToken = [newRefreshToken];
          const response = await findUser.save();
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });
          resolve({ access_token });
        }
      }
    }
  });
};

module.exports = {
  createController,
  readOneController,
  readAllController,
  updateController,
  deleteController,
  validateController,
};
