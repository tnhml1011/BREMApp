/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const { google } = require('googleapis');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const serviceAccount = require('./service-account.json');

// ⚙️ Tạo file Word từ dữ liệu contact form
async function createWordFile(data) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'ĐƠN TIẾP NHẬN THÔNG TIN', bold: true, size: 32 })],
          alignment: 'center',
        }),
        new Paragraph({ text: `\nHọ tên: ${data.name}` }),
        new Paragraph({ text: `Email: ${data.email}` }),
        new Paragraph({ text: `Số điện thoại: ${data.phone}` }),
        new Paragraph({ text: `Địa chỉ: ${data.address}` }),
        new Paragraph({ text: `Chủ đề: ${data.subject}` }),
        new Paragraph({ text: `Nội dung:\n${data.message}` }),
        new Paragraph({ text: `\nThời gian gửi: ${data.createdAt}` }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const fileName = `${data.name}_${Date.now()}.docx`;
  const filePath = path.join('/tmp', fileName);
  fs.writeFileSync(filePath, buffer);

  return { filePath, fileName };
}

// 🔐 Xác thực Google Drive và upload file
async function uploadToDrive(filePath, fileName) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: fileName,
    parents: [process.env.FOLDER_ID],
  };
  const media = {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    body: fs.createReadStream(filePath),
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id, webViewLink',
  });

  return res.data;
}

// 🌐 Endpoint Cloud Function gọi khi duyệt contact
exports.createContactWord = functions.https.onRequest(async (req, res) => {
  const data = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!data.name || !data.email || !data.subject || !data.message) {
    return res.status(400).send({ success: false, error: 'Thiếu thông tin đầu vào' });
  }

  try {
    // Tạo file Word và upload
    const { filePath, fileName } = await createWordFile(data);
    const uploaded = await uploadToDrive(filePath, fileName);

    return res.status(200).send({
      success: true,
      fileName: fileName,
      driveLink: uploaded.webViewLink,
    });
  } catch (error) {
    console.error('❌ Lỗi xử lý:', error);
    return res.status(500).send({ success: false, error: error.message });
  }
});
