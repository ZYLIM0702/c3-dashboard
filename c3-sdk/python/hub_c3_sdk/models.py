"""
Models for Hub C3 Python SDK
"""
from dataclasses import dataclass
from typing import Dict, Any
import enum

class AlertLevel(enum.Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class SensorData:
    timestamp: float
    device_id: str
    readings: Dict[str, Any]
    location: Dict[str, float]
