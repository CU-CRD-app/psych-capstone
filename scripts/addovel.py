import cv2
import sys
import glob 
import numpy as np
import os

# def addoval(file):
#     overlay = cv2.imread('oval.png')
#     background = cv2.imread(file)
#     added_image = cv2.addWeighted(background,0.4,overlay,0.1,0)
#     return added_image

# for filepath, dirnames, filenames in os.walk(r'testPics'):
#     for filename in filenames:
#         file = os.path.join(filepath, filename)
#         img = addoval(file)
#         cv2.imwrite(file, img)
# def addoval(file):
#     overlay = cv2.imread('oval.png')
#     h,w,s=overlay.shape
#     background = cv2.imread(file)
#     b, g, r = cv2.split(background)
#     b_a=np.asarray(b)
#     g_a=np.asarray(g)
#     r_a=np.asarray(r)
#     mc=np.zeros((h,w))
#     for i in range(h):
#         for j in range(w):
#             mc[i][j]=int(b_a[i][j])+int(g_a[i][j])+int(r_a[i][j])
#     h,w=mc.shape
#     avarege=int((np.sum(mc)/(w*h))*0.75)
#     gatesize=avarege
#     # print(gatesize)
#     for i in range(h):
#         for j in range(w):
#             if mc[i][j]>=gatesize:
#                 background[i][j][0] = overlay[i][j][0]
#                 background[i][j][1] = overlay[i][j][1]
#                 background[i][j][2] = overlay[i][j][2]
#     return background
def addoval(img):
    oval = cv2.imread('oval.png')
    # img1 is the oval, img2 is the face.
    for i in range(500):
        for j in range(500):
                # print("img1[i][j]: ", img1[i][j])
                if oval[i, j, 0] == 255 and oval[i, j, 1] == 255 and oval[i, j, 2] == 255:
                    oval[i, j, 0] = img[i, j, 0]
                    oval[i, j, 1] = img[i, j, 1]
                    oval[i, j, 2] = img[i, j, 2]
    return oval


for filepath, dirnames, filenames in os.walk(r'../faces'):
    for filename in filenames:
        file = os.path.join(filepath, filename)
        face = cv2.imread(file)
        img = addoval(face)
        cv2.imwrite(file, img)