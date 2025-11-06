🧩 Secret Page App

A modern Next.js + Supabase authentication demo that allows users to register, log in, and access secret pages.
Designed with a clean, aesthetic UI and smooth animations to provide a sleek, modern experience.

🚀 Features

🔐 User Authentication with Supabase (email + password)

🧭 Protected Pages — only logged-in users can access secret pages

🎨 Modern UI/UX — gradient background, smooth transitions, and responsive design

⚙️ Account Management — register, login, logout, and simulated delete

⚡ Built with Next.js and React Hooks

🛠️ Tech Stack

Frontend: Next.js, React

Backend/Auth: Supabase

Styling: Inline CSS with gradient & animation effects

📦 Installation

1. Clone the repository

git clone https://github.com/your-username/secret-page-app.git
cd secret-page-app


2. Install dependencies

npm install
# or
yarn install

3. Set up Supabase

Go to https://supabase.com

4. Create a new project

Get your Project URL and Anon Key

Add them to .env.local:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key


Run the development server

npm run dev


Then open http://localhost:3000
 in your browser.

 🔐 Usage

Register a new account using your email and password

Confirm your email via Supabase

Login and access any of the secret pages

Logout or delete your account (simulated client-side)

💅 UI Highlights

Centered and responsive design

Smooth fade-in animation on page load

Gradient background and modern button hover effects

Clean and minimal card layout for readability

🧠 Notes

Account deletion must be implemented on a server-side API route for real data removal.

Designed as a learning and demonstration project for Supabase Auth integration.

🧑‍💻 Author

David Allen Evangelista
📚 4th Year BS Computer Engineering — STI College Global City
💻 Passionate about Full-Stack Development (Laravel, Vue.js, React, Next.js)