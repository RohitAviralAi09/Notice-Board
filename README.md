# 📌 Campus & Corporate Notice Board Web Application

A unified, full-stack, and responsive Notice Board web application designed with a premium, modern user interface. This project utilizes **Next.js (Pages Router)** to implement both the interactive React frontend and serverless API route handlers. All notices are stored in a **TiDB Cloud (MySQL)** cluster using **Prisma ORM**.

---

## 🛠️ Technology Stack
* **Frontend**: React (v18), Next.js (Pages Router, Javascript)
* **Backend APIs**: Next.js API Routes (`pages/api/notices/`)
* **Styling**: Tailwind CSS, PostCSS, Google Fonts (Inter)
* **Database & ORM**: TiDB Cloud (MySQL Serverless) & Prisma ORM
* **Iconography**: Lucide React
* **Deployment**: Vercel

---

## 🌟 Premium Features
1. **Interactive Real-Time Live Preview**:
   * When adding or editing a notice, a responsive live preview card panel renders side-by-side with the form inputs, displaying font layouts, category tags, publish dates, and image fallbacks in real-time as you type.
2. **Dynamic Header Analytics & Stats**:
   * The home page banner features active count indicators (Total Announcements, Pinned Urgent Notices, Exam Schedules, and Campus Events) which calculate dynamically from the database queries.
3. **Database-Level Sorting**:
   * "Urgent" notices are sorted to the top directly within the Prisma MySQL query (utilizing alphabetical priority sorting descending), secondary to the `publishDate` parameter, bypassing expensive client-side sorting.
4. **Vibrant Category-Specific Fallbacks**:
   * If a notice doesn't specify an image URL, the header dynamically renders card backgrounds based on the announcement category:
     * **Exam**: Orange-Rose gradient (`from-amber-400 via-orange-500 to-rose-500`) with large abstract watermark text and calendar icons.
     * **Event**: Green-Cyan gradient (`from-emerald-400 via-teal-500 to-cyan-500`) with watermark text and tag icons.
     * **General**: Blue-Violet gradient (`from-blue-500 via-indigo-500 to-violet-600`) with watermark text and warning icons.
5. **Robust Deletion Confirmation**:
   * Destructive actions trigger a modal overlay prompting the user to confirm. The client only hits the DELETE API after the user explicitly accepts.
6. **Animated Notification Toast**:
   * Dynamic toasts slide into the viewport on successful notice addition, modification, or deletion, providing feedback on operations.
7. **Search & Filters**:
   * Live client-side searching by title/body and filtering tabs by category.

---

## 📂 Project Structure

```
notice-board/
├── components/
│   ├── DeleteModal.js       # Confirmation overlay modal for deleting notices
│   ├── Navbar.js            # Sticky glassmorphism header layout
│   ├── NoticeCard.js        # Card layout showing details, custom banners, actions
│   └── NoticeForm.js        # Reusable form + side-by-side real-time Live Preview
├── lib/
│   └── prisma.js            # Global Prisma Client singleton configuration
├── pages/
│   ├── _app.js              # Next.js custom application wrapper (layouts/styles)
│   ├── add.js               # Notice creator route page
│   ├── index.js             # Main dashboard (lists, filter tabs, stats, toasts)
│   ├── edit/
│   │   └── [id].js          # Notice editor page (pre-populates inputs)
│   └── api/
│       └── notices/
│           ├── index.js     # Router for GET all notices and POST notice records
│           └── [id].js      # Router for GET, PUT, and DELETE notice by ID
├── prisma/
│   ├── migrations/          # Automatically generated database migration files
│   └── schema.prisma        # Database connection configuration & Prisma models
├── public/
│   └── .gitkeep             # Directory placeholder ensuring empty folders are tracked
├── styles/
│   └── globals.css          # Core Tailwind CSS directives and slide-in keyframes
├── .env                     # Local environment parameters (Git ignored)
├── .env.example             # Example environment variables template
├── .gitignore               # Configuration mapping files excluded from Git
├── postcss.config.js        # PostCSS configurations compiling Tailwind directives
├── tailwind.config.js       # Tailwind JIT configuration mapping page source files
└── package.json             # NPM metadata, scripts, and production dependencies
```

---

## 🔑 Environment Variables
Create a file named `.env` in the root directory:

```env
DATABASE_URL="mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslaccept=accept_invalid_certs"
```

> [!IMPORTANT]
> **SSL Requirement**: TiDB Cloud Serverless clusters enforce secure connections. You **must** append `?sslaccept=accept_invalid_certs` to the end of your database connection URL. This tells the Prisma query engine to connect securely over TLS/SSL without requiring you to download custom CA certificates locally.

---

## 🚀 Setup & Installation

### 1. Install Dependencies
Navigate to the root directory and install npm packages:
```bash
npm install
```

### 2. Run Database Migrations
Configure your `.env` file first. Then run the schema engine migration to create tables in your TiDB cluster and generate client code:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Run Development Server
Start Next.js locally:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 📋 REST API Documentation

All request payloads and response bodies communicate using JSON. Proper HTTP response codes are returned depending on success or failure.

### 🌐 `GET /api/notices`
* **Description**: Returns all announcements.
* **Database Ordering**: Orders notices with priority `Urgent` first, followed by `Normal`. Secondarily, sorts by `publishDate` descending.
* **Success Code**: `200 OK`
* **Response Body**:
  ```json
  [
    {
      "id": 1,
      "title": "Final Exams Schedule Announcement",
      "body": "Detailed exam dates and regulations...",
      "category": "Exam",
      "priority": "Urgent",
      "publishDate": "2026-07-08T00:00:00.000Z",
      "image": "https://example.com/banner.jpg",
      "createdAt": "2026-07-08T10:00:00.000Z"
    }
  ]
  ```

---

### 🌐 `POST /api/notices`
* **Description**: Publish a new notice. Enforces strict server-side validation.
* **Request Body**:
  ```json
  {
    "title": "Notice Title",
    "body": "Announcements body details.",
    "category": "Exam" | "Event" | "General",
    "priority": "Urgent" | "Normal",
    "publishDate": "YYYY-MM-DD",
    "image": "https://example.com/image.jpg" (Optional)
  }
  ```
* **Server-side Validations**:
  * `title`: Required, non-empty.
  * `body`: Required, non-empty.
  * `category`: Required, must be either `Exam`, `Event`, or `General`.
  * `priority`: Required, must be either `Urgent` or `Normal`.
  * `publishDate`: Required, must be a valid date.
* **Response Codes**:
  * `201 Created`: Notice successfully created. Returns the new object.
  * `400 Bad Request`: Validation errors. Returns object map:
    ```json
    {
      "errors": {
        "title": "Title is required",
        "category": "Category must be one of: Exam, Event, General"
      }
    }
    ```
  * `500 Internal Server Error`: Database failure.

---

### 🌐 `GET /api/notices/[id]`
* **Description**: Fetch notice details by ID.
* **Response Codes**:
  * `200 OK`: Success.
  * `404 Not Found`: Notice with the specified ID does not exist.

---

### 🌐 `PUT /api/notices/[id]`
* **Description**: Update an existing notice. Enforces the same validation criteria as `POST`.
* **Request Body**: Same schema as `POST`.
* **Response Codes**:
  * `200 OK`: Successfully updated. Returns the updated object.
  * `400 Bad Request`: Validation errors.
  * `404 Not Found`: Notice not found.

---

### 🌐 `DELETE /api/notices/[id]`
* **Description**: Delete a notice by ID.
* **Response Codes**:
  * `200 OK`: Successfully deleted.
  * `404 Not Found`: Notice not found.

---

## ☁️ Deployment on Vercel

This project is structured as a unified Next.js project and is ready to deploy directly to Vercel without additional configurations.

1. Connect your local directory to a GitHub repository and push your branches.
2. Go to the [Vercel Dashboard](https://vercel.com) and import the repository.
3. In the project build settings, add your **Environment Variable**:
   * **Key**: `DATABASE_URL`
   * **Value**: `mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/notice_board?sslaccept=accept_invalid_certs`
4. Click **Deploy**. Vercel will build the frontend pages and deploy the route files in `pages/api` as serverless functions.

---

## 🔮 Future Improvements

With additional time, the primary improvement would be implementing **User Authentication and Role-Based Access Control (RBAC)**. Currently, the application allows any user to create, edit, and delete notices. Integrating a secure authentication service (such as NextAuth.js, Clerk, or custom JWT-based sessions) would enable distinct roles:
- **Administrators/Publishers**: Full privileges to add, update, and remove notices.
- **General Users (Students/Employees)**: Read-only access to view, filter, and search notices without edit capabilities.

This would ensure security, accountability, and reliability for deployment in a real-world campus or corporate environment.

---

## 🤖 Use of AI

AI tools were utilized during the development of this project to assist in specific stages of the workflow:
* **Clarify assignment requirements**: Helped quickly unpack specifications and map them to technical goals.
* **Troubleshoot Prisma and TiDB configuration issues**: Guided the configuration of the TiDB connection parameters, specifically handling TLS/SSL connection certificate details.
* **Improve the UI**: Suggested component layout organization and Tailwind CSS styling patterns to achieve a modern, cohesive look.
* **Review and refine the README documentation**: Assisted in structuring the API routes documentation and deployment steps for maximum readability.

*All implementation decisions, coding, testing, debugging, and final verification were completed and validated by me.*

