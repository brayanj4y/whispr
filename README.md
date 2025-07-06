# 🔥 Whispr

> **Anonymous Messages & Self-Destructing Secrets**

A modern web application that enables users to send and receive anonymous messages and create self-destructing secret links. Built with Next.js 15, React 19, and TypeScript.

## ✨ Features

### 🎭 Anonymous NGL Messages
- **Receive Anonymous Feedback**: Get honest, anonymous messages from friends, colleagues, or followers
- **Shareable Links**: Each user gets a unique NGL link to share on social media or messaging platforms
- **Real-time Notifications**: Get notified when you receive new anonymous messages
- **Message Management**: View, organize, and manage all your received messages from the dashboard

### 🔐 Self-Destructing Secrets
- **Temporary Secret Links**: Create secure links that automatically expire after being viewed
- **Burn After Reading**: Messages are permanently deleted after the first view
- **Secure Sharing**: Share sensitive information that won't persist in chat histories
- **Link Management**: Track and manage all your created secret links

### 🌟 Additional Features
- **User Authentication**: Secure Google OAuth integration via NextAuth
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Internationalization**: Multi-language support with i18next
- **Modern UI**: Beautiful interface built with Tailwind CSS and Radix UI
- **Analytics**: Integrated Vercel Analytics for usage insights
- **Dark/Light Mode**: Theme switching support

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.io/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Supabase account
- Google OAuth credentials

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whispr.git
   cd whispr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. **Database Setup**
   - Create a Supabase project
   - Set up the required database tables for users, messages, and secrets
   - Configure authentication providers in Supabase

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Message Recipients

1. **Sign In**: Use your Google account to sign in
2. **Get Your NGL Link**: Copy your unique NGL link from the dashboard
3. **Share Your Link**: Post it on social media, bio links, or send to friends
4. **Receive Messages**: Check your dashboard for new anonymous messages

### For Secret Creators

1. **Create a Secret**: Go to "Create Secret" in the dashboard
2. **Enter Your Message**: Type the confidential information
3. **Set Expiration**: Choose when the link should expire (optional)
4. **Share Securely**: Send the generated link to your recipient
5. **One-Time View**: The secret is destroyed after being read once

### For Anonymous Senders

1. **Visit NGL Link**: Click on someone's shared NGL link
2. **Send Message**: Type your anonymous message
3. **Submit**: Your message is sent completely anonymously

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
whispr/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── ngl/               # Anonymous messaging
│   ├── secret/            # Secret links
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── styles/               # CSS styles
├── types/                # TypeScript definitions
└── public/               # Static assets
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security & Privacy

- **Anonymous Messages**: No personal information is stored with anonymous messages
- **Self-Destructing Secrets**: Messages are permanently deleted after viewing
- **Secure Authentication**: Google OAuth with NextAuth.js
- **Data Protection**: All data is stored securely in Supabase
- **HTTPS Only**: All communications are encrypted

## 🌍 Internationalization

The app supports multiple languages through i18next:
- English (default)
- Additional languages can be added in the `locales/` directory

## 📱 Mobile Support

- Responsive design that works on all devices
- Mobile-optimized bottom navigation
- Touch-friendly interface
- Progressive Web App features

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

## 🎉 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Supabase](https://supabase.io/) for the backend infrastructure

---

**Made with ❤️ for anonymous communication and secure sharing**

