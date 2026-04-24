# Pattern Modular Architecture

## Visualisasi Struktur Folder
PROJECT-TEST-MAGANG/
├── prisma/
│ ├── schema.prisma
│
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ │
│ ├── common/
│ │ ├── guards/
│ │ │ └── jwt-auth.guard.ts
│ │ ├── interfaces/
│ │ │ └── authenticate.interface.ts
│ │ │ └── jwt-payload.interface.ts
│ │ └── utils/
│ │ ├── hash-password.util.ts
│ │ └── compare-password.util.ts
│ │
│ ├── providers/
│ │ └── prisma/
│ │ ├── prisma.module.ts
│ │ └── prisma.service.ts
│ │
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── auth.module.ts
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── dto/
│ │ │ │ ├── login.dto.ts
│ │ │ │ └── register.dto.ts
│ │ │ └── strategies/
│ │ │ └── jwt.strategy.ts
│ │ │
│ │ ├── users/
│ │ │ ├── users.module.ts
│ │ │ ├── users.controller.ts
│ │ │ ├── users.service.ts
│ │ │ ├── users.repository.ts
│ │ │ ├── dto/
│ │ │ │ ├── create-user.dto.ts
│ │ │ │ ├── detail-user.dto.ts
│ │ │ │ └── update-user.dto.ts
│ │ │ └── interfaces/
│ │ │ └── user.interface.ts
│ │ │
│ │ ├── categories/
│ │ │ ├── categories.module.ts
│ │ │ ├── categories.controller.ts
│ │ │ ├── categories.service.ts
│ │ │ ├── categories.repository.ts
│ │ │ ├── dto/
│ │ │ │ ├── create-category.dto.ts
│ │ │ │ ├── detail-category.dto.ts
│ │ │ │ └── update-category.dto.ts
│ │ │ └── interfaces/
│ │ │ └── category.interface.ts
│ │ │
│ │ └── tasks/
│ │ ├── tasks.module.ts
│ │ ├── tasks.controller.ts
│ │ ├── tasks.service.ts
│ │ ├── tasks.repository.ts
│ │ ├── dto/
│ │ │ ├── create-task.dto.ts
│ │ │ ├── detail-task.dto.ts
│ │ │ └── update-task.dto.ts
│ │ └── interfaces/
│ │ └── task.interface.ts
│
├── test/
│ ├── auth.e2e-spec.ts
│ └── jest-e2e.json
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md


## Penjelasan Pattern Modular Architecture
Pola yang saya gunakan adalah Modular Architecture dengan pendekatan Layered Architecture dan Repository Pattern. Project itu dibagi berdasarkan fitur atau domain seperti autentikasi, pengguna, kategori, dan tugas, sehingga masing-masing modul memiliki tugas dan tanggung jawab yang jelas. Dalam setiap modul, alur kode dibagi menjadi controller yang mengelola permintaan HTTP, service yang berisi logika bisnis, dan repository yang berfungsi untuk mengakses database menggunakan Prisma. Folder providers atau prisma berfungsi sebagai lapisan infrastruktur untuk menghubungkan database, sementara common berisi logika yang dibagi seperti guard, interface, dan utility.  Pola ini dipilih karena membuat kode lebih terstruktur, lebih mudah dikembangkan, lebih mudah diuji, dan sesuai dengan prinsip pemisahan tugas. 