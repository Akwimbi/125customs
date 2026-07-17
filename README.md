# 125Customs - B2B + B2C Custom Engraving Platform

**Kenya's leading custom engraving platform for businesses and individuals.**

## 🎯 Overview

125Customs is a dual-audience e-commerce platform offering:
- **B2B Services:** Asset tagging, industrial labels, bulk engraving for businesses
- **B2C Services:** Personalized pet tags, jewelry boxes, gift engraving for individuals

## 🚀 Features

### For Businesses (B2B)
- ✅ Bulk ordering with tiered discounts
- ✅ Quote request system (RFQ)
- ✅ CSV upload for serial numbers
- ✅ Compliance pack (AGPO, KRA PIN, Tax Compliance)
- ✅ Procurement-ready documentation

### For Individuals (B2C)
- ✅ Personalized products (pet tags, jewelry boxes)
- ✅ Gift messages and occasion tags
- ✅ Social sharing integration
- ✅ Easy checkout with M-Pesa

### Payment & Shipping
- ✅ Paystack integration (M-Pesa + Cards + Bank Transfer)
- ✅ Pickup Mtaani delivery (KES 120 flat fee)
- ✅ Resend transactional emails
- ✅ WhatsApp Business integration

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 16+ (Prisma ORM)
- **Payments:** Paystack
- **Email:** Resend
- **Security:** Helmet, JWT, bcrypt

### Frontend
- **Framework:** React 18+ (Vite)
- **Styling:** Tailwind CSS
- **State:** Zustand + React Query
- **Forms:** React Hook Form + Zod
- **PDF:** jsPDF (client-side generation)

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🌐 Environment Variables

See `.env.example` files in `/backend` and `/frontend` for required variables.

## 📂 Project Structure

```
125customs/
├── backend/           # Express API server
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── prisma/        # Database schema
│   └── server.js      # Entry point
├── frontend/          # React client
│   ├── src/
│   │   ├── components/# Reusable components
│   │   ├── pages/     # Page components
│   │   └── utils/     # Utilities (PDF gen, etc.)
│   └── vite.config.js
└── README.md
```

## 🚀 Deployment

### GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/125customs.git
git push -u origin main
```

### Hosting (Recommended)
- **Frontend:** Vercel (https://vercel.com)
- **Backend:** Render (https://render.com)
- **Database:** Supabase (https://supabase.com)

See deployment guide in `/docs/DEPLOYMENT.md` (coming soon).

## 📖 Documentation

Full specification: `/125customs-COMPLETE-SPECIFICATION-MPESA.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- **WhatsApp:** +254 712 345 678
- **Email:** info@125customs.co.ke
- **Website:** www.125customs.co.ke (coming soon)

## 📜 License

MIT License - see LICENSE file for details

---

**Built with ❤️ in Kenya 🇰🇪**
