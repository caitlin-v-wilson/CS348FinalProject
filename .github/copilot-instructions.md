# CS348 Project - React Frontend & Django Backend

This is a full-stack project with:
- **Frontend**: React with Vite
- **Backend**: Django REST Framework

## Project Structure
```
CS348Project/
├── frontend/          # React application
├── backend/           # Django application
└── README.md          # Project documentation
```

## Setup Instructions

### Backend (Django)
1. Navigate to `backend` folder
2. Create virtual environment: `python -m venv venv`
3. Activate: `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start server: `python manage.py runserver`

### Frontend (React)
1. Navigate to `frontend` folder
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:5173

## Technologies

- **Frontend**: React, Vite, Axios
- **Backend**: Django, Django REST Framework
