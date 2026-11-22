const RSVP_SPREADSHEET_ID = '1AgTrvDRpX5lrpjZYmMPKU5KYtOuPXpf11t2Rl1atoQA';
const RSVP_TAB = 'Wedding RSVP Replies';
const RSVP_HEADERS = ['Received at', 'Name', 'Party size', 'Submission ID'];

function doGet() {
  return rsvpJson_({ service: 'wedding-rsvp' });
}

function doPost(event) {
  const body = event?.postData?.contents;
  if (typeof body !== 'string' || body.length > 1500) {
    return rsvpJson_({ ok: false });
  }

  let input;
  try {
    input = JSON.parse(body);
  } catch (error) {
    return rsvpJson_({ ok: false });
  }

  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const guests = input?.guests;
  const requestId = input?.requestId;
  if (!name || name.length > 100 || !Number.isInteger(guests) || guests < 1 ||
      guests > 30 || typeof requestId !== 'string' || !/^[a-f0-9]{32}$/.test(requestId)) {
    return rsvpJson_({ ok: false });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) {
    return rsvpJson_({ ok: false });
  }
  try {
    const book = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
    const tab = book.getSheetByName(RSVP_TAB) || book.insertSheet(RSVP_TAB);
    const lastRow = tab.getLastRow();
    if (lastRow === 0) {
      tab.appendRow(RSVP_HEADERS);
      tab.setFrozenRows(1);
    } else {
      const headers = tab.getRange(1, 1, 1, RSVP_HEADERS.length).getValues()[0];
      if (RSVP_HEADERS.some((heading, column) => headers[column] !== heading)) {
        throw new Error('The RSVP response columns have been renamed.');
      }
    }

    // Retrying the same submission after a lost response must not add a second row.
    const alreadySaved = lastRow > 1 && tab.getRange(2, 4, lastRow - 1, 1)
      .createTextFinder(requestId).matchEntireCell(true).findNext();
    if (!alreadySaved) {
      // Force guest-supplied names to be stored as text, including formula-like input.
      tab.appendRow([new Date(), "'" + name, guests, requestId]);
      SpreadsheetApp.flush();
    }
    return rsvpJson_({ ok: true, requestId });
  } catch (error) {
    console.error('RSVP could not be saved.', error.message);
    return rsvpJson_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function rsvpJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
