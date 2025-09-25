# Context for Maxxsure

Hello Maxxsure! I’m the frontend developer working with the recruiter Mike Cibulsky on the application for your joint Developer/Designer role.

Mike told me your team was very interested in seeing a portfolio of previous design work. I don’t have a portfolio page—but figured this recent application I made as part of my interview with Solace Health would work.

The short version is this: Solace Health is a healthcare advocacy platform, and tasked me with taking their “advocate browser” and both rewriting the code while enhancing the UI/UX.

In the Discussion.md file, you can see my notes on my UI/UX rework—my thoughts, along with some screenshots of the application I built.

Feel free to reach out with any questions, thanks!

- Nate Reynolds

## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database set up

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you’d like to configure a database, you’re encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

1. Feel free to use whatever configuration of postgres you like. The project is set up to use docker-compose.yml to set up postgres. The url is in .env.

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```
