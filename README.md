# 📄 Resumind - AI Resume Analyzer

**Smart feedback for your dream job**

Resumind is an AI-powered resume analysis tool that helps job seekers optimize their resumes for specific job positions. Upload your resume, provide job details, and get instant AI-driven feedback to improve your ATS score and land more interviews.

![Resumind Demo](https://via.placeholder.com/800x400?text=Resumind+Demo)

---

## ✨ Features

- 🤖 **AI-Powered Analysis** - Leverages Puter AI to analyze resumes against job descriptions
- 📊 **ATS Score** - Get insights on how well your resume passes Applicant Tracking Systems
- 💡 **Smart Suggestions** - Receive actionable improvement tips tailored to your target role
- 🔒 **Secure Authentication** - Sign in with Puter for secure data management
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Clean, intuitive interface built with TailwindCSS

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Puter](https://puter.com) account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hyperionias/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📖 How It Works

1. **Sign In** - Authenticate with your Puter account
2. **Upload Resume** - Provide job details (company, title, description)
3. **Drop Your Resume** - Upload your PDF resume (max 20MB)
4. **Get Analysis** - AI analyzes your resume and provides feedback
5. **Improve** - Apply suggestions and re-upload for better results

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **React Router** | Navigation & routing |
| **TailwindCSS** | Styling |
| **Puter.js** | Authentication & AI API |
| **react-dropzone** | File upload |
| **Vite** | Build tool & dev server |

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── components/        # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── FileUploader.tsx
│   │   └── ResumeCard.tsx
│   ├── routes/           # Page components
│   │   ├── home.tsx
│   │   ├── auth.tsx
│   │   └── upload.tsx
│   ├── lib/              # Utilities
│   │   └── puter.ts      # Puter store & API
│   └── root.tsx          # App root
├── public/               # Static assets
└── types/                # TypeScript definitions
```

---

## 🔧 Key Components

### Authentication (`app/routes/auth.tsx`)
- Puter-based authentication
- Auto-redirect after login
- Session management

### Upload Form (`app/routes/upload.tsx`)
- Company name & job title inputs
- Job description textarea
- PDF file upload with validation
- Form submission handling

### File Uploader (`app/components/FileUploader.tsx`)
- Drag & drop support
- PDF-only validation (max 20MB)
- Real-time file preview

### Navbar (`app/components/Navbar.tsx`)
- Responsive navigation
- Conditional logout button
- Mobile-optimized design

---

## 🎨 Design Highlights

- **Color Palette**: Indigo primary, green success indicators
- **Typography**: Inter font family
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Accessibility**: Semantic HTML and ARIA labels

---

## 📝 Environment Setup

No `.env` file needed! Puter.js is loaded via CDN in `root.tsx`:

```html
<script src="https://js.puter.com/v2/"></script>
```

---

## 🚧 Roadmap

- [ ] AI resume analysis integration
- [ ] Results page with detailed feedback
- [ ] Resume version history
- [ ] Export analysis reports
- [ ] Multi-language support
- [ ] Resume templates

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Created with ❤️ by Hyperionias

---

## 👨‍💻 Author

**Mert Danacı (Hyperionias)**
- GitHub: [@hyperionias](https://github.com/hyperionias)
- LinkedIn: [Mert Danacı](https://linkedin.com/in/mert-danaci/)

---

## 🙏 Acknowledgments

- [Puter](https://puter.com) - For authentication and AI API
- [React Router](https://reactrouter.com) - For routing
- [TailwindCSS](https://tailwindcss.com) - For styling
- [react-dropzone](https://react-dropzone.js.org) - For file uploads

---

**Built with ❤️ using React, TypeScript, and AI**
