
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Run Docker Image

```bash
docker build --build-arg NEXT_PUBLIC_KEYCLOAK_REALM=arogyam -t arogyam-dashboard .

docker run -p 3000:3000 --env-file .env arogyam-dashboard

```
