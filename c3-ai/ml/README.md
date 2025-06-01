# C3/HUB ML Platform

This folder contains the machine learning microservice and pipelines for the C3/HUB platform. It supports multiple models and categories as described in the proposal, including seismic prediction, flood prediction, object/victim detection, navigation, health monitoring, audio SOS detection, LLM rescue assistant, and crowd analysis.

## Features
- Modular FastAPI-based ML microservice
- Multiple endpoints for different ML tasks (seismic, flood, object detection, etc.)
- Training and inference pipelines for each model
- Dockerized for scalable deployment
- Easy integration with the main backend and dashboard

## Endpoints (examples)
- `/predict/seismic` — QuakeFlow, LSTM, Transformer
- `/predict/flood` — LSTM, GRU, XGBoost
- `/predict/object-detect` — YOLOv5/v8, Thermal/Infrared CNN
- `/predict/navigation` — VSLAM, mapping
- `/predict/health` — LSTM, Autoencoder, XGBoost
- `/predict/audio-sos` — Whisper
- `/predict/llm-rescue` — Phi-2, TinyLLaMA
- `/predict/crowd` — Heatmap

## Usage
1. Build and run the Docker container:
   ```sh
   docker build -t c3-ml .
   docker run -p 8001:8001 c3-ml
   ```
2. Call endpoints from the main backend or dashboard.

## Folder Structure
- `main.py` — FastAPI app with all endpoints
- `pipelines/` — Training/inference scripts for each model
- `models/` — Saved model weights
- `utils/` — Shared utilities
- `config/` — Model configs

## Requirements
See `requirements.txt` for dependencies.

## Note
This is a scaffold. Add your real models and pipelines as you develop. See the main proposal for model details and references.
