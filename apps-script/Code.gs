// ============================================================
// CAMERA-2.0 — Booking Queue Backend
// Deploy as Web App: Execute as Me | Access: Anyone
// Bound to the same spreadsheet published as SHEET_URL (CSV) in types.ts
// ============================================================

const SPREADSHEET_ID = '1aHqZBckLTU3jutq8swqVtbjYwGG9yTYaUk5eAYLg_Bo'

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0]
}

function doGet(e) {
  return json({ ok: true })
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}')
    const result = handlePost(body)
    return json(result)
  } catch (err) {
    return json({ error: err.message })
  }
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function handlePost(body) {
  switch (body.action) {
    case 'listBookings':  return listBookings()
    case 'addBooking':    return addBooking(body.model, body.start, body.end)
    case 'deleteBooking': return deleteBooking(body.rowIndex)
    default: return { error: 'Unknown action: ' + body.action }
  }
}

function listBookings() {
  const values = getSheet().getDataRange().getValues()
  const bookings = []
  for (let i = 1; i < values.length; i++) {
    const [model, start, end] = values[i]
    if (model && start && end) bookings.push({ rowIndex: i + 1, model, start, end })
  }
  return { bookings }
}

function addBooking(model, start, end) {
  if (!model || !start || !end) return { error: 'Missing fields' }
  getSheet().appendRow([model, start, end])
  return { success: true }
}

function deleteBooking(rowIndex) {
  if (!rowIndex) return { error: 'Missing rowIndex' }
  getSheet().deleteRow(rowIndex)
  return { success: true }
}
