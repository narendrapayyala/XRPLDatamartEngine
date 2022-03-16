module.exports = function (data, dataset_date) {
  return {
    info: {
      title: "XRPL Demo Report",
      author: "XRPL Demo",
      creator: "XRPL Demo",
      producer: "XRPL Demo",
    },
    pageSize: "A4",
    pageOrientation: "portrait",
    // pageMargins: [20, 140, 30, 60],
    background: function (currentPage, pageSize) {
      return [
        {
          canvas: [
            { type: "line", x1: 15, y1: 15, x2: 580, y2: 15, lineWidth: 1 }, //Up line
            { type: "line", x1: 15, y1: 15, x2: 15, y2: 825, lineWidth: 1 }, //Left line
            { type: "line", x1: 15, y1: 825, x2: 580, y2: 825, lineWidth: 1 }, //Bottom line
            { type: "line", x1: 580, y1: 15, x2: 580, y2: 825, lineWidth: 1 }, //Rigth line
          ],
        },
      ];
    },

    footer: function (currentPage, pageCount) {
      return [
        {
          text: "Page " + currentPage.toString() + " of " + pageCount,
          alignment: "center",
          fontSize: 8,
        },
      ];
    },
    content: getContent(data, dataset_date),
    images: {
      xrpl_logo: `data:image/png;base64,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
`,
    },
    styles: {
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
    defaultStyle: {
      columnGap: 30,
    },
  };
};

function getContent(data, dataset_date) {
  let content = [];
  // Logo
  content.push({
    image: "xrpl_logo",
    alignment: "center",
    margin: [0, 10, 0, 30],
  });
  content.push({
    columns: [
      {
        width: 200,
        stack: [
          {
            text: "About this dataset",
            bold: true,
            fontSize: 13,
            color: "black",
            margin: [0, 0, 0, 8],
          },
          {
            text: `Dataset consists of balances related to the accounts from ${dataset_date}`,
          },
        ],
      },
      {
        width: "*",
        stack: [
          {
            text: "Column Descriptions",
            bold: true,
            fontSize: 13,
            color: "black",
            margin: [0, 0, 0, 8],
          },
          {
            width: "*",
            table: {
              body: [
                [
                  { text: "Address:", alignment: "left" },
                  { text: "Account address", margin: [10, 0, 0, 0] },
                ],
                [
                  { text: "Balance:", alignment: "left" },
                  {
                    text: "Account balance in XRP at the time the data was requested",
                    margin: [10, 0, 0, 0],
                  },
                ],
                [
                  { text: "Ledger\u00A0Index:", alignment: "left" },
                  {
                    text: "The ledger index of the ledger version used when retrieving this information",
                    margin: [10, 0, 0, 0],
                  },
                ],
                [
                  { text: "Validated:", alignment: "left" },
                  {
                    text: "True if this data is from a validated ledger version; if omitted or set to false, this data is not final",
                    margin: [10, 0, 0, 0],
                  },
                ],
              ],
              alignment: "center",
            },
            layout: "noBorders",
          },
        ],
      },
    ],
  });
  // line break
  content.push("\n\n");
  // Accounts Grid
  content.push({
    style: "tableExample",
    table: {
      headerRows: 1,
      widths: ["auto", "*", "*", "*"],
      body: getAccountRows(data),
    },
  });

  return content;
}

function getAccountRows(data) {
  let body = [
    [
      { text: "Address", style: "tableHeader", alignment: "center" },
      { text: "Balance", style: "tableHeader", alignment: "center" },
      { text: "Ledger Index", style: "tableHeader", alignment: "center" },
      { text: "Validated", style: "tableHeader", alignment: "center" },
    ],
  ];
  data.forEach((account) => {
    body.push([
      { text: account.result.account_data.Account, alignment: "center" },
      { text: account.result.account_data.Balance, alignment: "center" },
      { text: account.result.ledger_current_index, alignment: "center" },
      { text: account.result.validated, alignment: "center" },
    ]);
  });
  return body;
}

// // playground requires you to assign document definition to a variable called dd

// var dd = {
//   pageSize: 'A4',
//   pageOrientation: 'portrait',
//   background: function (currentPage, pageSize) {
//       return [
//           {
//               canvas: [
//                   { type: 'line', x1: 15, y1: 15, x2: 580, y2: 15, lineWidth: 1 }, //Up line
//                   { type: 'line', x1: 15, y1: 15, x2: 15, y2: 825, lineWidth: 1 }, //Left line
//                   { type: 'line', x1: 15, y1: 825, x2: 580, y2: 825, lineWidth: 1 }, //Bottom line
//                   { type: 'line', x1: 580, y1: 15, x2: 580, y2: 825, lineWidth: 1 }, //Rigth line
//               ]
//           }
//       ]
//   },

//   footer: function (currentPage, pageCount) {
//       return [{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'center', fontSize:8 }];
//   },
// content: [
//     {
//           image: 'xrpl_logo',
//           alignment: 'center',
//           margin:[0,10,0,30]
//       },
//     {
// // 			alignment: 'justify',
//     columns: [
//       {
//           width: 200,
//             stack: [
//                       {text: "About this dataset", bold: true,fontSize: 13, color: 'black', margin: [0, 0, 0, 8]},
//                       {text: "Dataset consists of balances related to the accounts from 28/10/2021"},
//                   ]
//       },
//       {
//           width: '*',
//         stack: [
//                       {text: "Column Descriptions", bold: true,fontSize: 13, color: 'black', margin: [0, 0, 0, 8]},
//                       {
//                           width: '*',
//                           table: {
//                               body: [
//                                 [
//                                   {text: 'Address:', alignment: 'left'},
//                                   { text: "Account address", margin: [10, 0, 0, 0] }
//                                 ],
//                                 [
//                                   {text: 'Balance:', alignment: 'left'},
//                                   { text: "Account balance in XRP at the time the data was requested", margin: [10, 0, 0, 0] }
//                                 ],
//                                 [
//                                   {text: 'Ledger\u00A0Index:', alignment: 'left'},
//                                   { text: "The ledger index of the ledger version used when retrieving this information", margin: [10, 0, 0, 0] }
//                                 ],
//                                 [
//                                   {text: 'Validated:', alignment: 'left',},
//                                   { text: "True if this data is from a validated ledger version; if omitted or set to false, this data is not final", margin: [10, 0, 0, 0] }
//                                 ],
//                               ],
//                               alignment: "center",
//                           },
//                           layout: 'noBorders'
//                       }
//                   ]
//       }
//     ]
//   },

//   '\n\n',

//   {
//     style: 'tableExample',
//     table: {
//       headerRows: 1,
//       widths: ['auto', '*', '*', '*'],
//       body: [
//         [{text: 'Address', style: 'tableHeader', alignment: 'center'}, {text: 'Balance', style: 'tableHeader', alignment: 'center'}, {text: 'Ledger Index', style: 'tableHeader', alignment: 'center'}, {text: 'Validated', style: 'tableHeader', alignment: 'center'}],
//         [
//           {text:'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',alignment: "center"},
//           {text:'424021949', alignment: "center"},
//           {text: '67305275', alignment: "center"},
//           {text: 'false', alignment: "center"},
//         ]
//       ]
//     }
//   },
// ],
// images: {
//     xrpl_logo: `data:image/png;base64,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
// `
// },
// styles: {
//   tableExample: {
//     margin: [0, 5, 0, 15]
//   },
//   tableHeader: {
//     bold: true,
//     fontSize: 13,
//     color: 'black'
//   }
// },
// defaultStyle: {
//   columnGap: 30
// }
// }
