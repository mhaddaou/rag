# RAG Chat Application

A full-stack Retrieval-Augmented Generation (RAG) chat application that allows users to upload PDF documents and have intelligent conversations with their content using LLMs.

## 🚀 Features

- **Document Upload & Processing**: Upload PDF documents and automatically process them for chat
- **Intelligent Chat**: Chat with your documents using RAG (Retrieval-Augmented Generation)
- **User Authentication**: Secure JWT-based authentication system
- **Session Management**: Organize conversations by sessions
- **Real-time Streaming**: Real-time chat responses with streaming
- **Vector Search**: Advanced document search using ChromaDB embeddings
- **Modern UI**: Beautiful, responsive interface built with Next.js and HeroUI

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **FastAPI**: Modern, fast web framework for building APIs
- **Prisma**: Next-generation database ORM for PostgreSQL
- **LangChain**: Framework for building LLM applications
- **ChromaDB**: Vector database for storing document embeddings
- **Ollama**: Local LLM integration for chat responses
- **JWT Authentication**: Secure user authentication
- **Bcrypt**: Password hashing

### Frontend (Next.js + TypeScript)
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **HeroUI**: Modern UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Real-time Streaming**: Server-Sent Events (SSE) for chat

### Infrastructure
- **PostgreSQL**: Primary database for user data and metadata
- **ChromaDB**: Vector database for document embeddings
- **Docker Compose**: Container orchestration

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+
- Docker and Docker Compose
- Ollama (for LLM functionality)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd rag
```

### 2. Environment Configuration

Create `.env` file in the project root:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rag_db"
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=rag_db

# JWT
JWT_KEY=your_super_secret_jwt_key

# File Uploads
PATH_UPLOADS=./uploads

# Ollama Configuration
BASE_URL=http://localhost:11434
MODEL_EMBEDDING=nomic-embed-text
MODEL=gemma3:4b
```

### 3. Start Infrastructure Services
```bash
# Start PostgreSQL and ChromaDB
docker-compose up -d
```

### 4. Setup Ollama

Install and setup Ollama with required models:
```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull nomic-embed-text
ollama pull gemma3:4b
```

### 5. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate Prisma client
prisma generate

# Run database migrations
prisma migrate dev

# Start the backend server
python run.py
```

The backend will be available at `http://localhost:5001`

### 6. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
rag/
├── backend/
│   ├── app/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # Pydantic models
│   │   ├── services/        # Business logic
│   │   └── database/        # Database configuration
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # User uploaded files
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application entry point
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── styles/           # CSS styles
│   └── types/            # TypeScript types
├── chroma_data/          # ChromaDB persistent storage
└── docker-compose.yml   # Infrastructure setup
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Document Management
- `POST /docs/first_upload` - Upload first document and create session
- `POST /docs/upload` - Upload document to existing session

### Chat
- `POST /chat/create_session` - Create new chat session
- `POST /chat/chat` - Send message (streaming response)
- `POST /chat/get_sessions` - Get user sessions
- `POST /chat/get_messages` - Get session messages

## 🔒 Authentication

The application uses JWT-based authentication:
- Passwords must contain at least 8 characters, one number, and one special character
- JWT tokens are stored in localStorage on the frontend
- Backend validates JWT tokens for protected routes

## 📚 How It Works

1. **User Registration/Login**: Users create accounts with secure password requirements
2. **Document Upload**: Users upload PDF documents which are processed and stored
3. **Embedding Generation**: Documents are split into chunks and converted to embeddings using Ollama
4. **Vector Storage**: Embeddings are stored in ChromaDB for efficient similarity search
5. **Chat Interface**: Users ask questions about their documents
6. **RAG Process**: 
   - Query is converted to embedding
   - Similar document chunks are retrieved from ChromaDB
   - Context and query are sent to LLM (Gemma 3)
   - Response is streamed back to the user

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
pnpm test
```

### Code Quality
```bash
# Frontend linting
cd frontend
pnpm lint

# Python formatting
cd backend
black .
```

## 🔧 Configuration

### Ollama Models
- **Embedding Model**: `nomic-embed-text` - Used for document and query embeddings
- **Chat Model**: `gemma3:4b` - Used for generating responses

### File Upload
- Supported formats: PDF
- Files are stored in user-specific directories
- File paths are tracked in the database

## 🔍 Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Check BASE_URL in environment variables

2. **Database Connection Error**
   - Verify PostgreSQL is running: `docker-compose ps`
   - Check DATABASE_URL format

3. **ChromaDB Issues**
   - Ensure ChromaDB container is running
   - Check chroma_data volume permissions

