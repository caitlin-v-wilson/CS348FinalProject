# CS348 Project

A full-stack web application with a React frontend and Django REST Framework backend.

## Project Structure

```
CS348Project/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # React entry point
│   │   ├── App.css       # App styles
│   │   └── index.css     # Global styles
│   ├── public/           # Static assets
│   ├── index.html        # HTML entry point
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies
│
├── backend/              # Django REST Framework API
│   ├── config/           # Django project settings
│   │   ├── settings.py   # Django settings
│   │   ├── urls.py       # URL routing
│   │   ├── wsgi.py       # WSGI configuration
│   │   └── asgi.py       # ASGI configuration
│   ├── api/              # Main API app
│   │   ├── models.py     # Database models
│   │   ├── views.py      # API views
│   │   ├── serializers.py # DRF serializers
│   │   ├── urls.py       # API routes
│   │   └── admin.py      # Django admin config
│   ├── manage.py         # Django management script
│   └── requirements.txt  # Backend dependencies
│
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup (Django)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup (React)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Development

### Backend API Endpoints

- `GET /api/` - API root
- `GET /api/auth/health/` - Health check
- `GET /api/auth/examples/` - List examples
- `POST /api/auth/examples/` - Create example
- `GET /api/auth/examples/{id}/` - Get example
- `PUT /api/auth/examples/{id}/` - Update example
- `DELETE /api/auth/examples/{id}/` - Delete example
- `GET /admin/` - Django admin panel (username: admin, password: admin)

### Technologies Used

**Frontend:**
- React 18
- Vite 5
- Axios (HTTP client)
- CSS3

**Backend:**
- Django 4.2
- Django REST Framework
- Django CORS Headers
- SQLite (development)

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

The optimized build will be in the `dist/` folder.

### Backend Production

1. Update `SECRET_KEY` in `config/settings.py`
2. Set `DEBUG = False` in `config/settings.py`
3. Update `ALLOWED_HOSTS` with your domain
4. Use a production database (PostgreSQL recommended)
5. Collect static files:
   ```bash
   python manage.py collectstatic
   ```

## Running Tests

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
python manage.py test
```

## Environment Variables

Create a `.env` file in the backend folder for sensitive data:

```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
```

## API Documentation

### Example Model

A sample API model is provided to demonstrate CRUD operations.

**Example Response:**
```json
{
  "id": 1,
  "title": "Sample Title",
  "description": "Sample description",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Common Issues

### CORS Errors
- Make sure the backend CORS_ALLOWED_ORIGINS includes your frontend URL
- Check that both servers are running

### Port Already in Use
- Backend (8000): `python manage.py runserver 8001`
- Frontend (5173): `npm run dev -- --port 5174`

### Database Issues
- Delete `db.sqlite3` and run migrations again
