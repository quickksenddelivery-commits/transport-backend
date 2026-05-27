const PDFDocument = require('pdfkit');

const BRAND = {
  navy: '#0D0840',
  red: '#CC1500',
  gold: '#F5C100',
  light: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  muted: '#64748B',
};

function createDoc(res, filename) {
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);
  return doc;
}

function header(doc, title, subtitle) {
  // Navy header bar
  doc.rect(0, 0, doc.page.width, 80).fill(BRAND.navy);

  // Company name
  doc.fillColor('white').font('Helvetica-Bold').fontSize(18)
    .text('ACCESSIBLEXPRESS', 50, 22);
  doc.fillColor(BRAND.gold).font('Helvetica').fontSize(9)
    .text('Global Logistics & Freight', 50, 45);

  // Document title (right side)
  doc.fillColor('white').font('Helvetica-Bold').fontSize(14)
    .text(title, 0, 22, { align: 'right', width: doc.page.width - 50 });
  doc.fillColor(BRAND.gold).font('Helvetica').fontSize(9)
    .text(subtitle, 0, 45, { align: 'right', width: doc.page.width - 50 });

  doc.moveDown(4);
}

function sectionTitle(doc, text) {
  const y = doc.y;
  doc.rect(50, y, doc.page.width - 100, 20).fill(BRAND.navy);
  doc.fillColor('white').font('Helvetica-Bold').fontSize(9)
    .text(text.toUpperCase(), 58, y + 5.5);
  doc.moveDown(0.3);
}

function field(doc, label, value, x, y, width) {
  doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5)
    .text(label.toUpperCase(), x, y);
  doc.fillColor(BRAND.text).font('Helvetica-Bold').fontSize(9.5)
    .text(value || '—', x, y + 10, { width: width - 4 });
}

function twoColParty(doc, leftTitle, leftParty, rightTitle, rightParty, startY) {
  const mid = doc.page.width / 2;
  const colW = mid - 68;

  sectionTitle(doc, `${leftTitle}  /  ${rightTitle}`);
  const y = doc.y + 6;

  field(doc, 'Name', leftParty.name, 58, y, colW);
  field(doc, 'Name', rightParty.name, mid + 8, y, colW);

  const addr = (p) => [p.street, p.city, p.state, p.postalCode].filter(Boolean).join(', ');
  field(doc, 'Address', addr(leftParty), 58, y + 30, colW);
  field(doc, 'Address', addr(rightParty), mid + 8, y + 30, colW);

  field(doc, 'Country', leftParty.country, 58, y + 60, colW / 2);
  field(doc, 'Country', rightParty.country, mid + 8, y + 60, colW / 2);

  field(doc, 'Phone', leftParty.phone, 58 + colW / 2, y + 60, colW / 2);
  field(doc, 'Phone', rightParty.phone, mid + 8 + colW / 2, y + 60, colW / 2);

  field(doc, 'Email', leftParty.email, 58, y + 90, colW);
  field(doc, 'Email', rightParty.email, mid + 8, y + 90, colW);

  doc.moveTo(mid, y - 4).lineTo(mid, y + 114).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  doc.moveDown(9);
}

function footer(doc, trackingNumber) {
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    const y = doc.page.height - 38;
    doc.rect(0, y, doc.page.width, 38).fill(BRAND.light);
    doc.moveTo(0, y).lineTo(doc.page.width, y).strokeColor(BRAND.border).lineWidth(0.5).stroke();
    doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5)
      .text(`Tracking: ${trackingNumber}  •  Generated ${new Date().toUTCString()}  •  accessiblexpress.com`, 50, y + 12);
    doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5)
      .text(`Page ${i + 1} of ${pageCount}`, 0, y + 12, { align: 'right', width: doc.page.width - 50 });
  }
}

// ─── Air Waybill ────────────────────────────────────────────────────────────
exports.generateAWB = function (shipment, res) {
  const doc = createDoc(res, `AWB-${shipment.trackingNumber}.pdf`);
  header(doc, 'AIR WAYBILL', 'NON-NEGOTIABLE');

  // AWB number box
  doc.rect(50, doc.y, doc.page.width - 100, 34).fill(BRAND.light).stroke(BRAND.border);
  doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5).text('AWB NUMBER', 60, doc.y + 4);
  doc.fillColor(BRAND.navy).font('Helvetica-Bold').fontSize(16).text(shipment.trackingNumber, 60, doc.y + 14);
  doc.moveDown(3.2);

  twoColParty(doc, 'Shipper', shipment.sender, 'Consignee', shipment.recipient);

  sectionTitle(doc, 'Shipment Details');
  const sy = doc.y + 6;
  const cw = (doc.page.width - 100) / 4;
  field(doc, 'Service', shipment.service?.replace(/_/g, ' ').toUpperCase(), 58, sy, cw);
  field(doc, 'Weight (kg)', String(shipment.weight), 58 + cw, sy, cw);
  field(doc, 'Dimensions (cm)', shipment.dimensions
    ? `${shipment.dimensions.length || '—'} × ${shipment.dimensions.width || '—'} × ${shipment.dimensions.height || '—'}`
    : '—', 58 + cw * 2, sy, cw);
  field(doc, 'Declared Value (USD)', shipment.declaredValue ? `$${shipment.declaredValue.toFixed(2)}` : '—', 58 + cw * 3, sy, cw);
  doc.moveDown(4.5);

  field(doc, 'Contents / Description of Goods', shipment.contents || 'General Cargo', 58, doc.y, doc.page.width - 120);
  doc.moveDown(3.5);

  sectionTitle(doc, 'Routing & Dates');
  const ry = doc.y + 6;
  const hw = (doc.page.width - 100) / 3;
  field(doc, 'Origin', `${shipment.sender.city || ''}, ${shipment.sender.country || ''}`, 58, ry, hw);
  field(doc, 'Destination', `${shipment.recipient.city || ''}, ${shipment.recipient.country || ''}`, 58 + hw, ry, hw);
  field(doc, 'ETA', shipment.eta ? new Date(shipment.eta).toDateString() : 'TBD', 58 + hw * 2, ry, hw);
  doc.moveDown(4.5);

  field(doc, 'Issue Date', new Date(shipment.createdAt).toDateString(), 58, doc.y, 200);
  field(doc, 'Status', shipment.status?.replace(/_/g, ' ').toUpperCase(), 260, doc.y, 200);
  doc.moveDown(5);

  // Signature box
  sectionTitle(doc, 'Shipper Signature');
  doc.rect(50, doc.y + 6, doc.page.width - 100, 55).fill('white').stroke(BRAND.border);
  doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5)
    .text('By tendering this shipment, shipper agrees to the terms and conditions of Accessiblexpress carriage.', 58, doc.y + 14, { width: doc.page.width - 130 });
  doc.fillColor(BRAND.muted).fontSize(7).text('Signature', 58, doc.y + 40);

  footer(doc, shipment.trackingNumber);
  doc.end();
};

// ─── Commercial Invoice ──────────────────────────────────────────────────────
exports.generateInvoice = function (shipment, res) {
  const doc = createDoc(res, `Invoice-${shipment.trackingNumber}.pdf`);
  header(doc, 'COMMERCIAL INVOICE', `INV-${shipment.trackingNumber}`);

  // Invoice meta row
  doc.rect(50, doc.y, doc.page.width - 100, 34).fill(BRAND.light).stroke(BRAND.border);
  const mw = (doc.page.width - 100) / 3;
  field(doc, 'Invoice Number', `INV-${shipment.trackingNumber}`, 60, doc.y + 4, mw);
  field(doc, 'Invoice Date', new Date(shipment.createdAt).toDateString(), 60 + mw, doc.y + 4, mw);
  field(doc, 'Currency', 'USD', 60 + mw * 2, doc.y + 4, mw);
  doc.moveDown(3.2);

  twoColParty(doc, 'Exporter / Seller', shipment.sender, 'Importer / Buyer', shipment.recipient);

  sectionTitle(doc, 'Line Items');
  // Table header
  const th = doc.y + 6;
  doc.rect(50, th, doc.page.width - 100, 18).fill(BRAND.navy);
  const cols = [58, 240, 330, 410, 480];
  const headers = ['Description of Goods', 'HS Code', 'Qty', 'Unit Value', 'Total'];
  headers.forEach((h, i) => {
    doc.fillColor('white').font('Helvetica-Bold').fontSize(7.5).text(h, cols[i], th + 5);
  });

  // Single line item
  const tr = th + 24;
  doc.rect(50, tr, doc.page.width - 100, 20).fill('white').stroke(BRAND.border);
  const unitVal = shipment.declaredValue || 0;
  doc.fillColor(BRAND.text).font('Helvetica').fontSize(8.5)
    .text(shipment.contents || 'General Cargo', cols[0], tr + 5, { width: 175 });
  doc.text('—', cols[1], tr + 5);
  doc.text('1', cols[2], tr + 5);
  doc.text(`$${unitVal.toFixed(2)}`, cols[3], tr + 5);
  doc.text(`$${unitVal.toFixed(2)}`, cols[4], tr + 5);

  // Total row
  const tot = tr + 26;
  doc.rect(50, tot, doc.page.width - 100, 22).fill(BRAND.light).stroke(BRAND.border);
  doc.fillColor(BRAND.navy).font('Helvetica-Bold').fontSize(9)
    .text('TOTAL DECLARED VALUE', cols[0], tot + 6);
  doc.fillColor(BRAND.red).font('Helvetica-Bold').fontSize(11)
    .text(`USD $${unitVal.toFixed(2)}`, cols[4] - 20, tot + 5);
  doc.moveDown(8);

  sectionTitle(doc, 'Shipment & Customs Information');
  const cy = doc.y + 6;
  const cw = (doc.page.width - 100) / 3;
  field(doc, 'Country of Origin', shipment.sender.country || '—', 58, cy, cw);
  field(doc, 'Country of Destination', shipment.recipient.country || '—', 58 + cw, cy, cw);
  field(doc, 'Incoterms', 'DAP', 58 + cw * 2, cy, cw);
  doc.moveDown(4.5);
  field(doc, 'Weight (kg)', String(shipment.weight), 58, doc.y, cw);
  field(doc, 'Service', shipment.service?.replace(/_/g, ' ').toUpperCase(), 58 + cw, doc.y, cw);
  field(doc, 'Tracking Number', shipment.trackingNumber, 58 + cw * 2, doc.y, cw);
  doc.moveDown(5);

  sectionTitle(doc, 'Declaration');
  doc.rect(50, doc.y + 6, doc.page.width - 100, 48).fill('white').stroke(BRAND.border);
  doc.fillColor(BRAND.muted).font('Helvetica').fontSize(7.5)
    .text('I declare that the information on this invoice is true and correct and that the contents and value of this shipment are as stated above.', 58, doc.y + 14, { width: doc.page.width - 130 });
  doc.fillColor(BRAND.muted).fontSize(7).text('Authorised Signature', 58, doc.y + 38);

  footer(doc, shipment.trackingNumber);
  doc.end();
};

// ─── Packing List ────────────────────────────────────────────────────────────
exports.generatePackingList = function (shipment, res) {
  const doc = createDoc(res, `PackingList-${shipment.trackingNumber}.pdf`);
  header(doc, 'PACKING LIST', `PKL-${shipment.trackingNumber}`);

  // Reference box
  doc.rect(50, doc.y, doc.page.width - 100, 34).fill(BRAND.light).stroke(BRAND.border);
  const mw = (doc.page.width - 100) / 3;
  field(doc, 'Packing List Ref.', `PKL-${shipment.trackingNumber}`, 60, doc.y + 4, mw);
  field(doc, 'Date Prepared', new Date(shipment.createdAt).toDateString(), 60 + mw, doc.y + 4, mw);
  field(doc, 'Status', shipment.status?.replace(/_/g, ' ').toUpperCase(), 60 + mw * 2, doc.y + 4, mw);
  doc.moveDown(3.2);

  twoColParty(doc, 'Shipped From', shipment.sender, 'Ship To', shipment.recipient);

  sectionTitle(doc, 'Package Contents');
  // Table header
  const th = doc.y + 6;
  doc.rect(50, th, doc.page.width - 100, 18).fill(BRAND.navy);
  const cols  = [58, 180, 280, 360, 430, 490];
  const hdrs  = ['Description', 'Contents', 'Qty', 'Weight (kg)', 'L × W × H (cm)', 'Condition'];
  hdrs.forEach((h, i) => {
    doc.fillColor('white').font('Helvetica-Bold').fontSize(7.5).text(h, cols[i], th + 5);
  });

  // Package row
  const tr = th + 24;
  doc.rect(50, tr, doc.page.width - 100, 22).fill('white').stroke(BRAND.border);
  const dims = shipment.dimensions
    ? `${shipment.dimensions.length || '—'} × ${shipment.dimensions.width || '—'} × ${shipment.dimensions.height || '—'}`
    : '—';
  doc.fillColor(BRAND.text).font('Helvetica').fontSize(8)
    .text('Package 1', cols[0], tr + 6)
    .text(shipment.contents || 'General Cargo', cols[1], tr + 6, { width: 95 })
    .text('1', cols[2], tr + 6)
    .text(String(shipment.weight), cols[3], tr + 6)
    .text(dims, cols[4], tr + 6)
    .text('Good', cols[5], tr + 6);

  // Summary row
  const sr = tr + 28;
  doc.rect(50, sr, doc.page.width - 100, 22).fill(BRAND.light).stroke(BRAND.border);
  doc.fillColor(BRAND.navy).font('Helvetica-Bold').fontSize(9)
    .text('TOTALS', cols[0], sr + 6);
  doc.fillColor(BRAND.navy).font('Helvetica-Bold').fontSize(9)
    .text('1 pkg', cols[2], sr + 6)
    .text(`${shipment.weight} kg`, cols[3], sr + 6);
  doc.moveDown(9);

  sectionTitle(doc, 'Special Instructions & Notes');
  doc.rect(50, doc.y + 6, doc.page.width - 100, 40).fill('white').stroke(BRAND.border);
  doc.fillColor(BRAND.muted).font('Helvetica').fontSize(8.5)
    .text(shipment.notes || 'No special instructions.', 58, doc.y + 16, { width: doc.page.width - 130 });
  doc.moveDown(5.5);

  sectionTitle(doc, 'Prepared By');
  const py = doc.y + 6;
  const pw = (doc.page.width - 100) / 2;
  field(doc, 'Company', 'Accessiblexpress Ltd.', 58, py, pw);
  field(doc, 'Website', 'accessiblexpress.com', 58 + pw, py, pw);
  doc.moveDown(3.5);
  field(doc, 'Email', 'logistics@accessiblexpress.com', 58, doc.y, pw);
  field(doc, 'Phone', '+1 (800) AXP-SHIP', 58 + pw, doc.y, pw);

  footer(doc, shipment.trackingNumber);
  doc.end();
};
