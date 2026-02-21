from PIL import Image
import sys

def remove_white_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is close to white, make it transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Optional: Crop the image to its bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")

input_img = r"C:\Users\barot\.gemini\antigravity\brain\4082c45b-0175-44f4-bac4-fc5dbdcb4fb3\media__1771669892281.png"
out_img = r"c:\Odoo\frontend\public\fleetnova-logo-transparent.png"
if __name__ == "__main__":
    remove_white_background(input_img, out_img)
