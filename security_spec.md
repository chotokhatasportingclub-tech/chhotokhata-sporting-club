# Security Specification: Chhotokhata Sporting Club

## 1. Data Invariants
- Public users can read published content (settings, banners, visible sections, players, teams, matches, tournaments, standings, gallery, published news, achievements, sponsors).
- Only authenticated and authorized administrators (e.g., matching the owner email `chotokhatasportingclub@gmail.com` or registered in `/admins/{uid}`) can create, edit, or delete club data.
- Normal visitors cannot modify website settings, player rosters, match scores, or elevate their privileges.
- Contact form submissions (`/contactMessages`) can be created by visitors with validated fields, but can only be read/updated/deleted by administrators.
- Admin logs (`/adminActivityLogs`) can only be created and viewed by verified administrators.

## 2. The "Dirty Dozen" Payloads (Must be rejected)
1. **Unauthenticated SiteSettings Update**: An unauthenticated user attempts to update `/siteSettings/general` to deface the club name. -> PERMISSION_DENIED.
2. **Ghost Fields Injection**: An admin or user sends an unregistered attribute `ghostHack: true` or exceeds length limits. -> REJECTED.
3. **Self-Promotion to Admin**: A standard authenticated user attempts to write their own UID into `/admins/{uid}` with role `super_admin`. -> PERMISSION_DENIED.
4. **Forged Email in Token**: An unverified email tries to claim admin rights without `request.auth.token.email_verified == true`. -> PERMISSION_DENIED.
5. **Unauthorized Match Score Tampering**: An unauthenticated user attempts to alter `homeScore` or change match status to `Completed`. -> PERMISSION_DENIED.
6. **Player Record Deletion**: An unauthenticated user attempts to delete a player from `/players/{id}`. -> PERMISSION_DENIED.
7. **Contact Message Scraping**: A non-admin user queries `/contactMessages` to view emails and phone numbers of other users. -> PERMISSION_DENIED.
8. **Malicious Standings Modification**: An unauthenticated client directly injects points or fake table position in `/standings/{id}`. -> PERMISSION_DENIED.
9. **Draft News Leak / Premature Access**: A non-admin queries draft articles directly. -> PERMISSION_DENIED.
10. **Huge String Denial-of-Wallet Attack**: An attacker attempts to submit a 2MB string into `/contactMessages/message`. -> REJECTED by string length boundaries.
11. **Admin Log Tampering**: A visitor or non-admin attempts to delete or alter `/adminActivityLogs/{id}`. -> PERMISSION_DENIED.
12. **Banner Hijacking**: An unauthenticated request attempts to inject an external phishing link into `/banners/{id}`. -> PERMISSION_DENIED.
