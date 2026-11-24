# Getting files from the owner

- 2026-11-24: Twice the owner "uploaded" renders from the Android app and nothing arrived: no attachment on the message and `/mnt/user-data/uploads` empty. Treat chat attachments from the phone as unreliable.
- 2026-11-24: Google Drive works through the connector (account matan@msgp.co.il). Ask the owner for a Drive folder name. Limits: files come back as base64, so large files (videos, multi-GB zips) cannot be pulled this way; ask for individual images or PDFs instead.
- 2026-11-24: The owner said they put files in a Drive folder "NEO בית שמש"; no such folder (and no file created that day) was visible to the connector. Possible causes: a different Google account, or upload still running.

Related: [owner-preferences](owner-preferences.md), [neo-beit-shemesh](neo-beit-shemesh.md).
- 2026-11-24: Later the same day five images attached in the app did arrive (saved under ~/.claude/uploads/<session>/). Chat upload works at least sometimes; Drive remains the fallback.
