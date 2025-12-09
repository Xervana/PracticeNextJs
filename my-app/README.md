# Next.js Program Management Application

A modern web application built with Next.js 15 for managing educational programs and students. Features a responsive UI with server-side rendering and API integration.

## 🚀 Features

- **Program Management**: Create, read, update, and delete educational programs
- **Student Management**: Manage student records with program associations
- **Real-time Search**: Filter and search through programs
- **Responsive Design**: Mobile-first design with sidebar navigation
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Type-safe**: TypeScript support with JSDoc

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **Backend API**: Running on `http://localhost:3001` (see [Backend Setup](#backend-setup))

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd my-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Getting Started

### Development Mode

Run the development server with Turbopack:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

1. **Build the application**

```bash
npm run build
```

2. **Start the production server**

```bash
npm start
```

## 📁 Project Structure

```
my-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── programs/         # Program endpoints
│   │   └── students/         # Student endpoints (future)
│   ├── programs/             # Program management pages
│   │   └── page.jsx
│   ├── students/             # Student management pages
│   │   └── page.jsx
│   ├── layout.jsx            # Root layout
│   ├── page.jsx              # Home page
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   ├── ui/                   # UI components (shadcn/ui)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   └── ...
│   └── Sidebar.jsx           # Navigation sidebar
├── lib/                      # Utility functions
│   └── utils.js
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🔌 Backend Setup

This application requires a backend API running on `http://localhost:3001`. The API should support the following endpoints:

### Program Endpoints

- `GET /programs/All` - Fetch all programs
- `POST /programs` - Create a new program
- `PUT /programs/:programId` - Update a program

### Student Endpoints (Future)

- `POST /students` - Create a new student

### Example Backend Response Format

**Program Object:**

```json
{
  "v_programid": 1,
  "v_programcode": "BSCS",
  "v_description": "Bachelor of Science in Computer Science",
  "v_isactive": true,
  "v_createdat": "2024-01-01T00:00:00.000Z",
  "v_modifiedat": "2024-01-01T00:00:00.000Z"
}
```

## 📦 Available Scripts

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build for production with Turbopack     |
| `npm start`     | Start production server                 |
| `npm run lint`  | Run ESLint                              |

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built with:

- **Radix UI**: Unstyled, accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful & consistent icons
- **Class Variance Authority**: Managing component variants

## 🔧 Configuration

### Tailwind CSS

Configured with custom color palette and animations. See `app/globals.css` and `postcss.config.mjs`.

### Next.js

- **App Router**: Using Next.js 15 App Router
- **Turbopack**: Enabled for faster builds
- **Image Optimization**: Disabled (`unoptimized: true`)

## 📱 Features in Detail

### Program Management

- **Create Programs**: Add new educational programs with code and description
- **Edit Programs**: Update existing program details and status
- **Search & Filter**: Real-time search with multiple filter options
- **Status Management**: Toggle program active/inactive status

### Student Management (In Progress)

- **Student Registration**: Link students to programs
- **Form Validation**: Built-in validation for required fields

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📧 Support

For support, email your-email@example.com or create an issue in the repository.

## 🐛 Known Issues

- Search query doesn't persist after program creation/update (in progress)
- Mobile sidebar animation can be improved

## 🗺️ Roadmap

- [ ] Complete student management functionality
- [ ] Add program deletion feature
- [ ] Implement user authentication
- [ ] Add data export functionality
- [ ] Improve mobile responsiveness
- [ ] Add unit and integration tests

---

Made with ❤️ using Next.js
