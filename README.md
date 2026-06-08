# Tamil Nadu Vanigargalin Sangamam - Official Digital Portal

Official web portal for Tamil Nadu Vanigargalin Sangamam (TNVS), providing digital membership services, ID cards, and community resources for traders across Tamil Nadu.

## 🚀 Live Site

**Production**: [https://vanigan-digital-new.vercel.app/](https://vanigan-digital-new.vercel.app/)

## 📋 Features

- **Digital Membership**: Online registration and instant EPIC ID card generation
- **Member Directory**: Browse 124,560+ registered traders, organizers, and businesses
- **Services**: Welfare schemes, loans, certifications, and business support
- **Multi-language**: Full support for Tamil and English
- **Modern UI**: Responsive design with dark mode support

## 🛠️ Tech Stack

- **Framework**: React + TanStack Start (React-based full-stack framework)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel
- **Performance**: WebP/AVIF image optimization, code splitting, lazy loading

## 📊 Performance

- **Performance Score**: 85-95+ (Lighthouse)
- **LCP**: <1.5s
- **Image Optimization**: 21.59 MB savings through WebP/AVIF conversion
- **Bundle Size**: <200 KB (gzipped)

## 🏗️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 📁 Project Structure

```
├── src/
│   ├── routes/          # TanStack Router pages
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and helpers
│   ├── data/           # Static data and constants
│   └── styles.css      # Global styles
├── public/             # Static assets
│   ├── assets/         # Optimized images (WebP/AVIF)
│   └── flow-images/    # UI flow illustrations
├── api/                # Backend API routes
└── scripts/            # Build and optimization scripts
```

## 🎨 Key Pages

- `/` - Homepage with statistics and services
- `/membership` - Member registration
- `/members` - Directory (Members, Organizers, Businesses)
- `/voter-id` - Digital ID card generation
- `/services` - Available services and programs
- `/dashboard` - Member dashboard

## 🔒 Environment Variables

Required environment variables (create `.env` file):

```env
DATABASE_URL=your_postgresql_connection_string
VITE_API_URL=your_api_endpoint
```

See `.env.example` for full list.

## 📄 License

© 2026 Tamil Nadu Vanigargalin Sangamam. All rights reserved.

## 🤝 Contributing

This is a private repository for TNVS official portal.

## 📞 Support

For support and inquiries, visit [vanigan.org](https://vanigan.org) or contact through the portal.

---

**Built with ❤️ for Tamil Nadu traders**
