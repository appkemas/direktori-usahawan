# Direktori Usahawan KEMAS

Platform direktori digital untuk usahawan KEMAS Malaysia yang membolehkan pengguna mencari dan menghubungi perniagaan tempatan.

## 🚀 Ciri-ciri Utama

### Untuk Pengunjung
- **Pencarian Pintar**: Cari perniagaan mengikut nama, kategori, atau lokasi
- **Penapis Lanjutan**: Filter mengikut negeri, daerah, dan kategori
- **Profil Perniagaan Lengkap**: Maklumat terperinci, galeri produk, dan video YouTube
- **Hubungan Langsung**: Butang panggil dan WhatsApp untuk hubungan terus
- **Peta Lokasi**: Integrasi Google Maps untuk panduan lokasi

### Untuk Usahawan
- **Pendaftaran Mudah**: Borang pendaftaran ringkas tanpa OTP
- **Pengurusan Profil**: Kemas kini maklumat perniagaan
- **Galeri Produk**: Muat naik gambar produk
- **Video Perniagaan**: Integrasi YouTube untuk promosi

### Untuk Pentadbir
- **Panel Dua Tahap**: 
  - Admin Negeri: Urus usahawan dalam negeri masing-masing
  - Admin HQ: Akses penuh ke semua negeri
- **Sistem Kelulusan**: Lulus/tolak permohonan usahawan
- **Penapis Lokasi**: Filter mengikut negeri dan daerah
- **Eksport Data**: Muat turun laporan dalam format CSV/Excel
- **Analitik**: Dashboard dengan statistik terperinci

## 🛠️ Teknologi

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Hosting**: Vercel (Frontend) + Firebase (Backend)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl

## 📱 Reka Bentuk

- **Mobile-First**: Responsif untuk semua saiz skrin
- **UX Mudah**: Antara muka yang mudah untuk pengguna luar bandar
- **Multi-Bahasa**: Bahasa Melayu (default) + English
- **Aksesibiliti**: Reka bentuk yang mesra pengguna

## 🚀 Cara Pasang & Jalankan

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akaun Firebase
- Akaun Vercel (untuk deployment)

### 1. Clone Repository
```bash
git clone <repository-url>
cd direktori-usahawan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat fail `.env.local` berdasarkan `env.example`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Firebase
1. Buat projek Firebase baru
2. Aktifkan Firestore Database
3. Aktifkan Firebase Storage
4. Aktifkan Firebase Authentication
5. Dapatkan konfigurasi dan masukkan ke dalam `.env.local`

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser anda.

### 6. Build untuk Production
```bash
npm run build
npm start
```

## 🗄️ Struktur Database

### Collections

#### Entrepreneurs
```typescript
{
  id: string,
  businessName: string,
  category: string,
  description: string,
  priceRange?: string,
  phone: string,
  whatsapp: string,
  location: {
    state: string,
    district: string,
    googleMapsLink: string,
    coordinates: { lat: number, lng: number }
  },
  images: string[],
  youtubeVideo?: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Date,
  updatedAt: Date,
  createdBy: string,
  approvedBy?: string,
  approvedAt?: Date
}
```

#### AdminUsers
```typescript
{
  id: string,
  email: string,
  name: string,
  role: 'state_admin' | 'hq_admin',
  stateId?: string,
  permissions: {
    canApprove: boolean,
    canReject: boolean,
    canDelete: boolean,
    canExport: boolean
  },
  createdAt: Date,
  lastLogin: Date
}
```

#### States & Districts
```typescript
// States
{
  id: string,
  name: string,
  nameEn: string,
  districts: string[],
  stateAdminId?: string
}

// Districts
{
  id: string,
  name: string,
  nameEn: string,
  stateId: string
}
```

## 🔐 Sistem Keselamatan

- **Firebase Security Rules**: Kawalan akses berdasarkan peranan
- **Admin Authentication**: Sistem log masuk untuk pentadbir
- **Role-Based Access**: Admin negeri hanya boleh akses negeri sendiri
- **Input Validation**: Validasi dan sanitasi input

## 📱 Halaman Utama

1. **Homepage** (`/`): Hero section, kategori, usahawan terkini
2. **Search** (`/search`): Pencarian dengan penapis
3. **Business Profile** (`/business/[id]`): Profil lengkap perniagaan
4. **Admin Login** (`/admin/login`): Log masuk pentadbir
5. **Admin Dashboard** (`/admin/dashboard`): Papan pemuka pentadbir

## 🚀 Deployment

### Vercel (Frontend)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy

### Firebase (Backend)
1. Setup Firebase project
2. Deploy security rules
3. Configure hosting (optional)

## 📊 Struktur Projek

```
direktori-usahawan/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   └── ...             # General components
│   ├── contexts/           # React contexts
│   ├── i18n/              # Internationalization
│   ├── types/             # TypeScript types
│   └── ...
├── firebase/               # Firebase configuration
├── public/                 # Static assets
└── ...
```

## 🔧 Konfigurasi

### Tailwind CSS
- Custom colors untuk tema KEMAS
- Responsive breakpoints
- Component classes

### Internationalization
- Bahasa Melayu (default)
- English support
- Context-based language switching

## 📈 Ciri-ciri Masa Depan

- [ ] Sistem rating dan ulasan
- [ ] Notifikasi push
- [ ] Analytics lanjutan
- [ ] Mobile app (React Native)
- [ ] Integrasi payment gateway
- [ ] API untuk pihak ketiga

## 🤝 Sumbangan

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 Lesen

Projek ini dibangunkan untuk KEMAS Malaysia. Hak cipta terpelihara.

## 📞 Sokongan

Untuk sokongan teknikal, sila hubungi:
- Email: support@kemas.gov.my
- Dokumentasi: [Link ke dokumentasi]

## 🙏 Penghargaan

- KEMAS Malaysia untuk kepercayaan dan sokongan
- Komuniti open source untuk tools dan libraries
- Pasukan pembangunan untuk usaha dan dedikasi

---

**Direktori Usahawan KEMAS** - Memperkasakan usahawan tempatan Malaysia 🇲🇾
