import cv2
import sys
import glob 
import numpy as np
import os

def scale(img, width, height): 
    dim = (width, height)
      
    # resize image
    resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    #cv2.imshow("Originalimage", img) 
    #cv2.imshow("Resized image", resized)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()  
    return resized

def autocrop(file):
    # # print(cv2.__version__)
    cascPath = "haarcascade_frontalface_default.xml"

    # Create the haar cascade
    faceCascade = cv2.CascadeClassifier(cascPath)
    faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    # # files=glob.glob("testPics/photo-1542909168-82c3e7fdca5c.jpg")
    # files=glob.glob("testPics/*.jpg") 
    # for file in files:

    # Read the image
    image = cv2.imread(file)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        # flags = cv2.cv.CV_HAAR_SCALE_IMAGE
        flags = cv2.CASCADE_SCALE_IMAGE
    )

    print ("Found {0} faces!".format(len(faces)))

    # for (x, y, w, h) in faces:
    #     print ("face bound: ", x, y, w, h)

    #     # Dubugging boxes
    #     cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Draw a rectangle around the biggest face among the detected.
    x, y, w, h = max(list(faces), key = lambda t: t[2] * t[3])
    print ("face bound: ", x, y, w, h)
    # Dubugging boxes
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    # Crop Padding
    # left = -105
    # right = -105
    # top = -120
    # bottom = -80
    left = 0
    right = 0
    top = 0
    bottom = 0

    # Percentage of display window with respect to face detection result.
    # left = int(-np.floor(w * 0.10))
    # right = int(-np.floor(w * 0.10))
    # top = int(-np.floor(h * 0.7))
    # bottom = int(-np.floor(h * 0.7))
    # print("left, right, top, bottom Paddings: ", left, right, top, bottom)

    # crop and resclae the image.(the face detected is gauranteed to be in a squre box.)
    image  = image[y - top : y + h + bottom, x - left : x + w + right]
    image = scale(image, 500, 500)
    
    # print ("cropped_{1}{0}".format(str(file), str(x)))
    # cv2.imshow('cropped', image)
    # cv2.waitKey(0)
    return image
    # cv2.imwrite('croppedPics/cropped_{1}_{0}.jpg'.format(str(file)[9:], str(x)), image)

for filepath, dirnames, filenames in os.walk(r'testPics'):
    for filename in filenames:
        file = os.path.join(filepath, filename)
        img = cv2.imread(file)
        img = autocrop(file)
        cv2.imwrite(file, img)