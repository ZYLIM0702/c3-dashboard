# C3 Backend API Key Management Service

A microservice for secure API key generation, device registration, and SDK integration for HUB C3.

## Features
- RESTful API for device/user registration
- API key generation, storage, and rotation
- Integrates with all SDKs (Python, C++, Node.js, Flutter)
- Deployable via Docker or serverless

## Example FastAPI Implementation

See `main.py` for a minimal example.

## Example Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
