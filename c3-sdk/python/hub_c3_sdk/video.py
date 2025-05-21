import requests

class VideoStreamClient:
    def __init__(self, backend_url: str, api_key: str = None):
        self.backend_url = backend_url.rstrip('/')
        self.api_key = api_key

    def register_stream(self, device_id: str, stream_url: str, stream_type: str):
        resp = requests.post(f"{self.backend_url}/video/register", json={
            "device_id": device_id,
            "stream_url": stream_url,
            "stream_type": stream_type
        })
        resp.raise_for_status()
        return resp.json()

    def list_streams(self):
        resp = requests.get(f"{self.backend_url}/video/streams")
        resp.raise_for_status()
        return resp.json()

    def get_stream_url(self, device_id: str):
        resp = requests.get(f"{self.backend_url}/video/stream-proxy/{device_id}")
        resp.raise_for_status()
        return resp.json()
