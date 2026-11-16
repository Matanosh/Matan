# Hosting and domain

- 2026-11-14: Site deployed as a Render static site `ms-group-global` (service srv-dbse0nui0phs73cs4s6g, workspace tea-dbids3g8v5cc738kjqjg) from Matanosh/Matan branch ccr-c38204d4-t5wcpg, URL https://ms-group-global.onrender.com.
- 2026-11-14: Auto-deploy did not fire reliably on pushes; from then on each push was followed by a manual deploy trigger.
- 2026-11-14: render.yaml added and adopted by a Render Blueprint; it lists the domain global.msgp.co.il (commit 08b8892).
- 2026-11-15: Render reported "We weren't able to verify global.msgp.co.il" — DNS record not yet added.
- The sandbox cannot reach onrender.com directly (proxy 403); the owner declined adding it to the allowlist on 2026-11-14.

Related: [open-items](open-items.md).
