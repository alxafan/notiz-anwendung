# Notiz App

In dieser Anwendung haben Nutzer die Möglichkeit, private und öffentliche Notizen zu erstellen. Diese kann man dann in einer Suche suchen und sich anzeigen lassen. Die Notizen können in Markdown oder mit HTML-Tags versehen werden. Unter anderem kann man private Notizen durch das Teilen des Links anderen Nutzern zeigen.

## Haupttechnologien

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Vorraussetzungen

Um das Projekt zu starten führen sie diese Schritte aus:

- Clonen sie das Repository
- Installieren sie Docker
- Erstellen sie ein Konto bei [Discord Developers](https://discord.com/developers).
- Dort eine "New Application" erstellen
- Unter OAuth2 die _CLIENT ID_ und das _CLIENT SECRET_ in die .env eingeben
- Unter OAuth2 den Redirects angeben _http//note.localhost/api/auth/callback/discord_
- Danach die restliche .env ausfüllen, Sie können sich an der .env example orientieren und den Kommentaren folgen.
- Wenn das alles erledigt ist, führen sie _docker compose up --build_ aus

## Entwicklung

Um an dem Projekt zu arbeiten führen Sie folgende Schritte aus

- Erstellen sie einen neuen Branch feature/Feature
  `git branch feature/NewFeature`
- Speichern sie ihre Änderungen, schreiben eine commit Nachricht und pushen sie den Branch
  `git commit -m "Nachricht"`
  `git push`
