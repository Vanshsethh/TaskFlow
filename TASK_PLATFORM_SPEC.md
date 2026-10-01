# TaskFlow — Task & Team Management Platform (Assessment Cheat Sheet)

**App name:** TaskFlow | **Repo:** https://github.com/Vanshsethh/TaskFlow (empty, fresh start)
**Role:** Full Stack Intern | **Time:** 1 day | **Goal:** Frontend + Backend + DB all live and connected.

## 1. Stack (fixed)

| Layer | Tech | Deploy |
|---|---|---|
| Frontend | React, Vite, React Router, Axios, Redux Toolkit, Tailwind | Vercel |
| Backend | Node.js, Express | Render |
| Database | MongoDB Atlas (Mongoose) | Atlas |

## 2. Functional Requirements

| Area | Must have |
|---|---|
| **Auth** | Register, Login, JWT, Protected routes, Logout, Remember Me. Passwords hashed with **bcrypt** |
| **Dashboard** | Sidebar, Navbar, cards: Total / Pending / Completed / In Progress |
| **Tasks** | CRUD + Details view. Fields: Title, Description, Priority, Due Date, Status, Assigned User |
| **Search/Filter** | Search by title, filter by status, filter by priority, sort by date |

## 3. REST API (JSON only, JWT on protected routes)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Create user |
| POST | `/login` | Auth + return JWT |
| GET | `/tasks` | All tasks |
| GET | `/tasks/:id` | Single task |
| POST | `/tasks` | Create |
| PUT | `/tasks/:id` | Update |
| DELETE | `/tasks/:id` | Delete |

## 4. Database
- Models: **User**, **Task** (Task → ref User for assignee)
- Proper types, validation, relationships

## 5. Required React Concepts
- **Hooks/perf:** `useState`, `useEffect`, `useMemo`, `useCallback`, `React.memo`, custom hooks
- **State:** Context or Redux
- **Loading:** Lazy loading + Suspense
- **Validation:** required fields, email, password, duplicate users, invalid JWT

## 6. Error Handling

| Code | Scenario |
|---|---|
| 400 | Invalid request |
| 401 | Unauthorized / bad JWT |
| 404 | Not found |
| Network | Axios network failure |

## 7. Folder Structure

```
client/src/  components/ pages/ hooks/ services/ utils/ store/
server/      controllers/ models/ routes/ middleware/ config/
```

## 8. Bonus — pick any 4
Dark Mode · Pagination · Infinite Scroll · Charts · Drag & Drop · File Upload · Toast · Email Verification · PWA · Docker · Unit Tests

## 9. Grading (100)

| Criteria | Marks |
|---|---|
| React Fundamentals | 20 |
| Backend APIs | 20 |
| Database Design | 15 |
| Authentication | 15 |
| Code Quality | 10 |
| UI/UX | 10 |
| Deployment | 5 |
| Documentation | 5 |

## 10. Submission Checklist
- [ ] GitHub repo
- [ ] Live frontend (Vercel)
- [ ] Live backend (Render)
- [ ] README: setup, tech stack, API docs, screenshots, folder structure, live URLs, credentials
- [ ] API collection (Postman/Bruno)
- [ ] Pre-seeded working credentials: configure unique deployment-only credentials for the evaluator — **do not commit passwords**

---

# 🔒 Architecture Decisions — answer these to lock the plan

Reply with e.g. `1A 2A 3B ...`. **★ = my default if you say "go with defaults".**

### Auth
**1. Token storage**
- A) `localStorage` ★ (simple, works cross-origin Vercel↔Render)
- B) httpOnly cookie (more secure, needs CORS credentials + SameSite=None config)

**2. Remember Me behavior**
- A) Checked → JWT 30d in `localStorage`; unchecked → JWT 1d in `sessionStorage` ★
- B) Same storage, only expiry differs

**3. Roles**
- A) Admin + User: admin sees/edits all tasks, user sees own/assigned ★
- B) No roles (drop admin credentials)

### Data
**4. Task visibility in `GET /tasks`**
- A) User sees tasks they created **or** are assigned to; admin sees all ★
- B) Everyone sees all tasks

**5. Assigned User**
- A) Any registered user (needs extra `GET /users` for dropdown) ★
- B) Self only

**6. Task extras**
- A) Add `createdBy` + timestamps ★
- B) Only the 6 required fields

### API
**7. Search/filter/sort/pagination**
- A) Server-side via query params (`?search=&status=&priority=&sort=&page=`) ★
- B) Client-side on full list

**8. Dashboard counts**
- A) Extra endpoint `GET /tasks/stats` (Mongo aggregate) ★
- B) Computed client-side with `useMemo`

**9. Route prefix**
- A) Exactly as spec: `/register`, `/login`, `/tasks` ★
- B) `/api/...` prefix

### Frontend
**10. State management**
- A) Redux Toolkit for auth + tasks; Context for theme ★
- B) Context only

**11. Language**
- A) JavaScript ★ (1-day timeline)
- B) TypeScript

**12. Form validation**
- A) Manual + custom `useForm` hook (shows custom-hook skill) ★
- B) react-hook-form + zod

### Backend quality
**13. Validation lib**
- A) express-validator ★
- B) Joi / zod
- C) Mongoose validators only

### Bonus (pick 4)
**14.** ★ Dark Mode, Pagination, Toast Notifications, Charts — *or choose any four:* ______

### Delivery
**15. API collection**
- A) Postman ★
- B) Bruno

**16. Seed script** (`npm run seed` creating both test accounts + sample tasks)
- A) Yes ★
- B) No, create manually

**17. UI library extras** (besides Tailwind)
- A) None, pure Tailwind ★
- B) Headless UI / shadcn / icons lib (specify) ______

---

# ✅ LOCKED DECISIONS (final)

| # | Decision | Choice |
|---|---|---|
| 1 | JWT storage | `localStorage` |
| 2 | Remember Me | Checked → 30d JWT in `localStorage`; unchecked → 1d JWT in `sessionStorage` |
| 3 | Roles | None (no admin account) |
| 4 | `GET /tasks` visibility | Everyone sees all tasks; only the creator can edit/delete (changed to match PDF "Retrieve all tasks") |
| 5 | Assignable users | Any registered user (extra `GET /users`) |
| 6 | Task extras | `createdBy` + timestamps |
| 7 | Search/filter/sort/pagination | Server-side query params |
| 8 | Dashboard counts | Extra `GET /tasks/stats` (Mongo aggregate) |
| 9 | Route prefix | None: `/register`, `/login`, `/tasks` |
| 10 | State | Redux Toolkit (auth + tasks), Context (theme) |
| 11 | Language | JavaScript |
| 12 | Form validation | Manual + custom `useForm` hook |
| 13 | Backend validation | express-validator |
| 14 | Bonus (4) | Dark Mode, Docker, Charts, Drag & Drop |
| 15 | API collection | Postman |
| 16 | Seed script | `npm run seed` (test user + sample tasks) |
| 17 | UI libs | Pure Tailwind |

**Extra endpoints beyond spec:** `GET /users`, `GET /tasks/stats`
**Credentials to seed:** configure a deployment-only password for `testuser@example.com` (admin account dropped)

**Also fixed:** Status enum = `Pending` / `In Progress` / `Completed` (matches dashboard cards)
**Deploy notes:** `vercel.json` SPA rewrite · CORS allow Vercel URL on Render · note Render cold start in README · Docker kept local
