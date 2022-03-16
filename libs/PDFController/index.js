const pdfMake = require("pdfmake/src/printer");

module.exports.createPDFBase64 = function (docDefinition) {
  return new Promise(function (resolve, reject) {
    try {
      const fontDescriptors = {
        Roboto: {
          normal: "libs/PDFController/fonts/Roboto-Regular.ttf",
          bold: "libs/PDFController/fonts/Roboto-Medium.ttf",
          italics: "libs/PDFController/fonts/Roboto-Italic.ttf",
          bolditalics: "libs/PDFController/fonts/Roboto-MediumItalic.ttf",
        },
        Fontello: {
          normal: "libs/PDFController/fonts/fontello.ttf",
          bold: "libs/PDFController/fonts/fontello.ttf",
          italics: "libs/PDFController/fonts/fontello.ttf",
          bolditalics: "libs/PDFController/fonts/fontello.ttf",
        },
      };
      const printer = new pdfMake(fontDescriptors);
      const doc = printer.createPdfKitDocument(docDefinition);

      //console.log(new Date() - now);
      // var fs = require('fs');

      /*uncomment to generate file in local */

      /*const pdfdoc = printer.createPdfKitDocument(docDefinition);
      pdfdoc.pipe(fs.createWriteStream('tables.pdf'));
      pdfdoc.end();*/

      let chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        return resolve(
          "data:application/pdf;base64," + result.toString("base64")
        );
        // return resolve(result.toString('base64'));
      });
      doc.end();
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports.createPDFBinary = function (docDefinition) {
  return new Promise(function (resolve, reject) {
    try {
      const fontDescriptors = {
        Roboto: {
          normal: "libs/PDFController/fonts/Roboto-Regular.ttf",
          bold: "libs/PDFController/fonts/Roboto-Medium.ttf",
          italics: "libs/PDFController/fonts/Roboto-Italic.ttf",
          bolditalics: "libs/PDFController/fonts/Roboto-MediumItalic.ttf",
        },
        Fontello: {
          normal: "libs/PDFController/fonts/fontello.ttf",
          bold: "libs/PDFController/fonts/fontello.ttf",
          italics: "libs/PDFController/fonts/fontello.ttf",
          bolditalics: "libs/PDFController/fonts/fontello.ttf",
        },
      };
      const printer = new pdfMake(fontDescriptors);
      const doc = printer.createPdfKitDocument(docDefinition);

      //console.log(new Date() - now);
      // var fs = require('fs');

      /*uncomment to generate file in local */

      /*const pdfdoc = printer.createPdfKitDocument(docDefinition);
      pdfdoc.pipe(fs.createWriteStream('tables.pdf'));
      pdfdoc.end();*/

      let chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        return resolve(result);
        // return resolve('data:application/pdf;base64,' + result.toString('base64'));
        // return resolve(result.toString('base64'));
      });
      doc.end();
    } catch (err) {
      return reject(err);
    }
  });
};

// generatePdf1: function(docDefinition){
//   try {
//     const fontDescriptors = {
//       Roboto: {
//         normal: 'fonts/Roboto-Regular.ttf',
//         bold: 'fonts/Roboto-Medium.ttf',
//         italics: 'fonts/Roboto-Italic.ttf',
//         bolditalics: 'fonts/Roboto-MediumItalic.ttf'
//       }
//     };
//     const printer = new pdfMake(fontDescriptors);
//     const doc = printer.createPdfKitDocument(docDefinition);
//
//     let chunks = [];
//
//     doc.on('data', (chunk) => {
//       chunks.push(chunk);
//     });
//
//     return doc.on('end', () => {
//       const result = Buffer.concat(chunks);
//       console.log("ksjdfh");
//       return Promise.resolve({base64String:'data:application/pdf;base64,' + result.toString('base64')});
//       // return {base64String:'data:application/pdf;base64,' + result.toString('base64')}
//     });
//
//     doc.end();
//
//   } catch(err) {
//     // throw(err);
//   }
// },

// const docDefinition = {
//   content: ['This will show up in the file created']
// };
//
// generatePdf(docDefinition, (response) => {
//   console.log(response);
//   // res.send(response); // sends a base64 encoded string to client
// });
