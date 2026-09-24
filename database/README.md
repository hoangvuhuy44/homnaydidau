# Bản dữ liệu đi kèm gói GitHub

Snapshot hiện tại có 50 quán và 1.222 mục đồ uống. Gói đầy đủ có thể được công bố cùng repository theo yêu cầu chủ dự án; không thêm thông tin riêng tư vào bản Public. Website chỉ phục vụ docs.

# Đi cà phê — Menu database

The operational menu database is managed in Airtable in the base **Hanoi Coffee Shuffle — Menu Operations**. The website publishes a verified static snapshot so visitors never receive Airtable credentials and the site remains portable.

The committed `menu-database.json` is the reviewable publication snapshot. `airtable-sync-config.json` stores non-secret base/table identifiers and the publication policy; it never contains an API token. Only current Airtable verification records with status `Verified` and linked café, item and source records are eligible for publication.

## Work with Codex

Send a menu photo or official link and identify the café branch. A useful correction looks like:

> Bancông, 2 Đinh Liệt — Phin Trứng — 75,000 VND — marked Must Try — menu photo/link — checked 11 September 2026.

We will match the branch, transcribe the items, retain the evidence and date, review uncertain fields, and publish the updated website. Brand menus and customer reviews are research leads until branch applicability is confirmed.

## Edit the review copy yourself

Open `menu-editor.html`, choose a café and edit its items. The editor runs locally and sends nothing to a server. Click **Download review file** to save your work; closing the page otherwise loses edits. Send the downloaded JSON file back to Codex. Import that file into the editor to resume later. Downloading does not change the live website.

The authoritative file is `menu-database.json`. `docs/menus.json` is a generated public copy and must not be edited independently. The public copy excludes drafts, retired items and internal research notes. The review editor and source database are included in this full repository export at the owner’s request. GitHub Pages serves only docs; a public repository also exposes the other source files.

## Fields and publication rules

- One menu record for each of the 50 stable café IDs; branches do not inherit another branch’s menu.
- Every item has Vietnamese and English names, coffee/other category, price in VND or null, a price/size note, status, evidence and dates. Unknown prices remain null, never zero.
- `draft`: research or a correction awaiting review. Never recommended publicly.
- `published`: checked item supported by an official branch menu, dated menu photo or owner confirmation. This confirms the source, not live stock.
- `retired`: keep the record for context, but exclude it from the public menu.
- `signature`: requires evidence explicitly identifying a signature. `house_pick` means a café recommendation such as Must Try. A best seller is not automatically a signature.
- A highlight requires its own source, even when it is the same menu page.
- Sources need `kind`, `scope`, `url`, `checkedAt` and nullable `publishedAt`. A public evidence URL is required for published items; private customer information must never be put in the public source fields.
- After 180 days, an item needs checking again before recommendation. A dated old announcement does not become fresh merely because it was read today. `availableUntil` can end a seasonal item sooner.
- If no menu has been checked, the old general drink idea remains explicitly unverified. If a stored menu is stale or has no matching category, the site does not invent a substitute.
- Signature preference chooses a matching signature first, then a house recommendation, then another checked item. Drink category and district remain respected.

## Snapshot coverage — 24 September 2026

This export includes 50 café records and 1,222 published drink records from Sites version 53. The export date does not renew source verification dates. Item-level evidence and dates are retained in the JSON. Some source evidence refers to photos by evidenceId; those original photo files are not in the source repository.

## Maintenance

Run `node database/build-menus.cjs` to validate and generate the public menu. A supplied review JSON path can be passed to validate a proposal; move an accepted proposal into the authoritative file only after comparing it with the current copy. Run `node database/build-review.cjs` to refresh the local editor. Run `node verify.cjs` before publication. Changes to Airtable must be exported into the review snapshot, validated and republished for website visitors to receive them. This publish gate prevents an incomplete CMS edit from immediately leaking into the live recommendation engine.

Source links are retained on individual items. Café names and menu facts are used for identification; menu artwork and photographs have not been republished.
