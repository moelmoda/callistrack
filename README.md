# CallisTrack – Calisthenics Web-App

> **Software Engineering PL 5 · Hochschule Mainz SS 2026**
> Team 02: Daniel Abdullah · Mohammed Elmodalal · Mohammad Alhasan

---

## Was ist CallisTrack?

CallisTrack ist eine webbasierte Calisthenics-App die Athleten dabei hilft:
- Trainingsstandorte (Spots) auf einer interaktiven Karte zu finden
- Workouts zu protokollieren und Fortschritt zu tracken
- Sich mit der Community zu vernetzen
- Punkte und Level durch Aktivitäten zu sammeln

---

## Tech-Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Leaflet |
| Backend | Node.js 20, Express, TypeScript |
| Datenbank | Supabase (PostgreSQL 16) |
| Tests | Jest (72 Tests, 100% Coverage) |
| Deployment | Docker, Docker Compose, Nginx |

---

## Schnellstart mit Docker

### Voraussetzungen
- Docker Desktop installiert und gestartet
- Git

### 1. Repository klonen
git clone https://github.com/moelmoda/callistrack.git
cd callistrack

### 2. Umgebungsvariablen einrichten

Erstelle backend/.env mit folgendem Inhalt:

PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres.gwkpryeeilfdhfpqbwgb:BoMrHs2004%40%23!@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=callistrack_jwt_secret_2026_hochschule_mainz
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5173,http://localhost:80

Erstelle frontend/.env mit folgendem Inhalt:

VITE_API_URL=

### 3. App starten
docker compose up --build

Die App ist erreichbar unter:
- Frontend: http://localhost
- Backend API: http://localhost:3001/api/health

---

## Lokale Entwicklung ohne Docker

### Voraussetzungen
- Node.js >= 20
- npm

### Backend starten
cd backend
npm install
npm run dev

### Frontend starten (neues Terminal)
cd frontend
npm install
npm run dev

---

## Datenbank

Die Datenbank laeuft auf Supabase (PostgreSQL 16).

### Verbindungsdaten
| Parameter | Wert |
|-----------|------|
| Host | aws-0-eu-west-1.pooler.supabase.com |
| Port | 5432 |
| Datenbank | postgres |
| User | postgres.gwkpryeeilfdhfpqbwgb |
| Passwort | BoMrHs2004@#! |
| SSL | required |

### Supabase Dashboard
URL: https://supabase.com/dashboard/project/gwkpryeeilfdhfpqbwgb

### Datenbank neu einrichten
Falls die DB zurueckgesetzt werden muss:
1. Inhalt von database/001_init.sql im Supabase SQL-Editor ausfuehren
2. Inhalt von database/002_seed.sql im Supabase SQL-Editor ausfuehren

---

## Test-Accounts

| E-Mail | Passwort | Rolle |
|--------|----------|-------|
| modalalm9@gmail.com | Test1234! | Admin |
| test@example.com | Test1234! | Nutzer |
| delete@example.com | Test1234! | Nutzer (DSGVO-Test) |

Hinweis: Admin-Account hat Zugriff auf das Admin-Panel im Profil-Tab.

---

## API-Endpunkte

### Authentifizierung
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| POST | /api/auth/register | Registrierung |
| POST | /api/auth/login | Login -> JWT |
| DELETE | /api/auth/account | Account loeschen (DSGVO) |

### Spots
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/spots | Alle Spots |
| GET | /api/spots/:id | Spot Details mit Bewertungen |
| POST | /api/spots | Spot erstellen (Auth required) |
| PUT | /api/spots/:id | Spot bearbeiten (Ersteller oder Admin) |
| DELETE | /api/spots/:id | Spot loeschen (Ersteller oder Admin) |
| PATCH | /api/spots/:id/moderate | Freigeben oder Ablehnen (Admin only) |

### Workouts
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/workouts/my | Eigene Workouts |
| POST | /api/workouts | Workout speichern (Auth required) |

### Bewertungen
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| POST | /api/ratings | Spot bewerten (Auth required) |

### Nutzer
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/users/me | Eigenes Profil |
| PATCH | /api/users/me | Profil bearbeiten |
| GET | /api/users/me/following | Liste der gefolgten Nutzer |
| GET | /api/users/search?q=name | Nutzer suchen |
| GET | /api/users/:id | Oeffentliches Profil |
| POST | /api/users/:id/follow | Nutzer folgen |
| DELETE | /api/users/:id/follow | Nutzer entfolgen |

### Community
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/communities | Alle Communities |
| GET | /api/communities/search?q=name | Communities suchen |
| POST | /api/communities | Community erstellen |
| POST | /api/communities/:id/join | Community beitreten |
| DELETE | /api/communities/:id/join | Community verlassen |
| GET | /api/posts/:communityId | Posts einer Community |
| POST | /api/posts/:communityId | Post erstellen (Mitglied) |
| POST | /api/posts/:postId/like | Post liken oder unliken |

### Events
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/events | Alle Events |
| POST | /api/events | Event erstellen (Admin only) |
| POST | /api/events/:id/join | Event beitreten |
| DELETE | /api/events/:id/join | Event verlassen |
| DELETE | /api/events/:id | Event loeschen (Admin only) |

### News
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/news | Alle News |
| POST | /api/news | News erstellen (Admin only) |
| DELETE | /api/news/:id | News loeschen (Admin only) |

### Uebungs-Wiki
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/wiki | Alle Uebungen |
| GET | /api/wiki?search=name | Uebungen suchen |
| GET | /api/wiki?difficulty=Mittel | Nach Schwierigkeit filtern |

### Trainingplaene
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/plans | Eigene Plaene |
| POST | /api/plans | Plan erstellen |
| DELETE | /api/plans/:id | Plan loeschen |

### Ranking
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/ranking | Top-50 Nutzer nach Punkten |

### Health Check
| Method | Endpunkt | Beschreibung |
|--------|----------|-------------|
| GET | /api/health | Server und DB Status |

---

## Unit Tests

cd backend
npm test
npm run test:coverage

### Test-Ergebnisse
- 72 Tests in 3 Test-Dateien
- 100% Statement Coverage
- 100% Function Coverage
- 100% Line Coverage

| Test-Datei | Beschreibung |
|-----------|-------------|
| tests/authService.test.ts | Login, Registrierung, Email/Passwort Validierung |
| tests/gamificationService.test.ts | Punkte, Level-Berechnung, Durchschnittsbewertung |
| tests/spotService.test.ts | Spots laden, Duplikaterkennung, Moderation |

---

## Features

### Fuer alle Nutzer (auch Gaeste)
- Interaktive Karte mit Calisthenics-Spots in Mainz
- Spots nach Equipment filtern (Klimmzugstange, Barren, etc.)
- Spots und Bewertungen ansehen
- Uebungs-Wiki durchstoebern
- Ranking anschauen

### Fuer registrierte Nutzer
- Spots bewerten und kommentieren
- Workouts loggen und Fortschritt tracken
- Neue Spots hinzufuegen (mit Adresse-Autocomplete)
- Eigene Spots bearbeiten und loeschen
- Punkte und Level sammeln (10 Punkte pro Workout, 5 pro Bewertung, 20 pro Spot)
- Oeffentliches Profil verwalten
- Anderen Nutzern folgen
- Communities beitreten und Posts erstellen
- Trainingplaene erstellen
- Events beitreten

### Fuer Admins
- Spots freigeben oder ablehnen
- News und Berichte erstellen und verwalten
- Events erstellen, verwalten und loeschen
- Alle Inhalte moderieren

---

## Gamification

### Punkte-System
| Aktion | Punkte |
|--------|--------|
| Workout loggen | +10 |
| Spot bewerten | +5 |
| Neuen Spot erstellen | +20 |

### Level-System
| Level | Benoetigung Punkte |
|-------|-------------------|
| Level 1 | 0 Punkte |
| Level 2 | 500 Punkte |
| Level 3 | 1000 Punkte |
| Level 4 | 1500 Punkte |
| Level 5 | 2000 Punkte |

---

## Architektur

callistrack/
├── backend/                 Node.js/Express REST API
│   ├── src/
│   │   ├── routes/         API Endpunkte
│   │   ├── services/       Business Logik
│   │   ├── middleware/     JWT Auth Middleware
│   │   └── db/            PostgreSQL Verbindung (Pool)
│   └── tests/             Unit Tests (Jest)
├── frontend/               React/Vite App
│   └── src/app/
│       ├── components/    React Komponenten pro Tab
│       ├── context/       Auth Context (JWT)
│       └── api.ts        Zentraler API Client
└── database/              SQL Schemas und Seed-Daten

### Architektur-Muster
- Client-Server-Architektur
- REST API (JSON ueber HTTP)
- JWT-basierte Authentifizierung
- PostgreSQL mit Connection Pooling

---

## Sicherheit

- JWT-basierte Authentifizierung (7 Tage Gueltigkeit)
- Passwort-Hashing mit bcrypt (10 Salt Rounds)
- CORS-Konfiguration fuer erlaubte Origins
- Input-Validierung mit express-validator
- DSGVO-konformes Account-Loeschen (Art. 17) - alle Daten werden geloescht
- Admin-Rollensystem fuer sensitive Operationen
- Rate Limiting durch Connection Pooler

---

## GitHub Repository

URL: https://github.com/moelmoda/callistrack
Branch: main

---

## Lizenz

Hochschule Mainz - Software Engineering SS 2026
