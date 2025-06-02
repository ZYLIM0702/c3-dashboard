!pip install roboflow

from roboflow import Roboflow
rf = Roboflow(api_key="yIOXTUBRCJI2HF36eBHP")
project = rf.workspace("ukasha-rahman-y7ad7").project("disaster-detection")
version = project.version(17)
dataset = version.download("yolov8")
                

from ultralytics import YOLO

# Train YOLOv8 on the Roboflow-downloaded dataset
def train_yolov8():
    # Path to the data.yaml file from Roboflow
    data_yaml = "disaster-detection-17/data.yaml"
    # Choose a model size: yolov8n.pt, yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt
    model = YOLO("yolov8m.pt")
    # Train the model
    model.train(
        data=data_yaml,      # Path to data.yaml
        epochs=100,          # Number of training epochs
        imgsz=640,           # Image size
        batch=16,             # Batch size
        project='segmentation_training',  # Output directory
        name='yolov8s-seg-custom',         # Experiment name
        device='mps'  # Use GPU if available
    )

if __name__ == "__main__":
    train_yolov8()


# Test the trained YOLOv8 model on a video
from ultralytics import YOLO

def process_video(input_video_path, output_video_path, model_path="segmentation_training/yolov8s-seg-custom/weights/best.pt"):
    # Load your trained model
    model = YOLO(model_path)
    # Run inference on the video and save the output
    results = model.predict(
        source=input_video_path,
        save=True,
        save_txt=False,
        save_conf=True,
        project="segmentation_training",
        name="video_output",
        exist_ok=True,
        show=False
    )
    # The output video will be saved in ./video_output/ with the same name as the input video

if __name__ == "__main__":
    process_video("/Users/limziyang/Documents/RECENT PROJECT/Technothon/turkey.mp4", "/Users/limziyang/Documents/RECENT PROJECT/Technothon/output.mp4")
    