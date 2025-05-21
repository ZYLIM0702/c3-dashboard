"""
Device configuration for Hub C3 Python SDK
"""
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class DeviceConfig:
    device_id: str
    device_type: str
    location: Dict[str, float]
    capabilities: List[str]
