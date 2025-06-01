import torch
from PIL import Image
import matplotlib.pyplot as plt

# File paths
image_path = "/Users/limziyang/Downloads/Building-at-San-Francisco-765x510.jpg"
weights_path = "/Users/limziyang/Downloads/yolo-damaged-building-opening-detection-main/yolov5s_mtl_best.pt"

# Load YOLOv5 segmentation model
model = torch.hub.load('ultralytics/yolov5', 'custom', path=weights_path)  # ✅ REMOVE `task`

# Run inference
results = model(image_path)

# Render and display
results.render()
img = Image.fromarray(results.imgs[0])
plt.imshow(img)
plt.axis('off')
plt.title("YOLOv5 Segmentation Output")
plt.show()
