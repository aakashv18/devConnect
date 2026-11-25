# devConnect frontend

React + Redux Toolkit + Tailwind/daisyUI client for `devConnect-backend`.

## Run

```sh
# terminal 1, in devConnect-backend
npm run dev

# terminal 2, here
npm install
npm run dev            # http://localhost:5173
```

The backend's auth cookie is `sameSite: strict`, so the app never calls the
backend's port directly. Requests go to `/api/*` on the Vite server, which
strips `/api` and forwards them to the backend (see `vite.config.js`).

If the backend isn't on port 3000:

```sh
API_URL=http://localhost:3001 npm run dev
```

## Pages

| Route          | API used                                              |
| -------------- | ----------------------------------------------------- |
| `/login`       | `POST /signup`, `POST /login`                         |
| `/`            | `GET /user/feed`, `POST /request/send/:status/:id`    |
| `/requests`    | `GET /user/requests`, `POST /request/review/:status/:id` |
| `/connections` | `GET /user/connections`                               |
| `/profile`     | `PATCH /profile/edit`, `PATCH /profile/password`      |

## Production

`npm run build` outputs static files to `dist/`. Serve them from the same
origin as the API, with a reverse proxy mapping `/api` to the backend, or the
cookie won't be sent.
