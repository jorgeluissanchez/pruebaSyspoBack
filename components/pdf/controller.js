const {
  createStore,
  readOneStore,
  readAllStore,
  updateStore,
  deleteStore,
} = require("./store");
const puppeteer = require("puppeteer");
const { config } = require("../../config");

async function printPDF(id) {
  const info = await readOneStore(id);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(info?.html, { waitUntil: "domcontentloaded" });
  await page.emulateMediaType("screen");
  const pdf = await page.pdf({
    path: "public/pdf/" + id + ".pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });
  await browser.close();
  return pdf;
}

const createController = async (info) => {
  const { user, html, title } = info;
  if (!user) {
    console.error("[userController] No hay usuario");
  } else if (!html) {
    console.error("[userController] No hay html");
  } else if (!title) {
    console.error("[userController] No hay title");
  } else {
    const pdf = await { user, html, title };
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.emulateMediaType("screen");
    await page.pdf({
      path: "public/pdf/" + title + ".pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });
    browser.close();
    return createStore(pdf);
  }
};

const readOneController = (id) => {
  return readOneStore(id);
};

const readOnePdfController = async (id) => {
  await readOneStore(id).then(async (pdf) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(pdf.html, { waitUntil: "domcontentloaded" });
    const info = await page.pdf({ format: "A4" });
    return info;
  });
};

const readAllController = () => {
  return readAllStore();
};

const updateController = async (id, pdf) => {
  let { user, html, state, title } = pdf;
  await readOneStore(id)
    .then((pdf) => {
      if (user === undefined) {
        user = pdf.user;
      }
      if (html === undefined) {
        html = pdf.html;
      }
      if (state === undefined) {
        state = pdf.state;
      }
      if (title === undefined) {
        title = pdf.title;
      }

      const res = {
        user,
        html,
        title,
        state,
      };

      return updateStore(id, res);
    })
    .catch((err) => {
      return err;
    });
};

const deleteController = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Id invalido");
    } else {
      deleteStore(id)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

module.exports = {
  createController,
  readOneController,
  printPDF,
  readOnePdfController,
  readAllController,
  updateController,
  updateController,
  deleteController,
};
