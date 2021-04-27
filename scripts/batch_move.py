from autocrop import *
import cv2
import sys
import glob 
import os
import numpy as np

for filepath,dirnames,filenames in os.walk(r'CFD_test'):
    for filename in filenames:
        if filename[-5:] == "N.jpg":
            file = os.path.join(filepath, filename)
            img = cv2.imread(file)
            # img = autocrop(file)

            group_name = filename[4:6]
            if group_name[0] == 'A':
                group_str = "asian"
                group_str_2 = "asian"
                if group_name[1] == 'F':
                    group_str += "_female"
                if group_name[1] == 'M':
                    group_str += "_male"
            
            elif group_name[0] == 'B':
                group_str = "black"
                group_str_2 = "black"
                if group_name[1] == 'F':
                    group_str += "_female"
                if group_name[1] == 'M':
                    group_str += "_male"

            elif group_name[0] == 'L':
                group_str = "latino"
                group_str_2 = "latino"
                if group_name[1] == 'F':
                    group_str += "_female"
                if group_name[1] == 'M':
                    group_str += "_male"

            elif group_name[0] == 'W':
                group_str = "white"
                group_str_2 = "white"
                if group_name[1] == 'F':
                    group_str += "_female"
                if group_name[1] == 'M':
                    group_str += "_male"
            
            # create directory
            directory = 'CFD_cropped/{0}/daily-assessment'.format(group_str)
            if not os.path.exists(directory):
                os.makedirs(directory)
            count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
            # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
            cv2.imwrite('CFD_cropped/{0}/daily-assessment/{1}.jpg'.format(group_str, count), img)

            directory = 'CFD_cropped/{0}/pre-post-assessment'.format(group_str)
            if not os.path.exists(directory):
                os.makedirs(directory)
            count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
            cv2.imwrite('CFD_cropped/{0}/pre-post-assessment/{1}.jpg'.format(group_str, count), img)
            # cv2.imwrite('CFD_cropped/{0}/pre-post-assessment/cropped_{1}'.format(group_name, filename), img)

            # directory = 'CFD_cropped/{0}/training/level-1'.format(group_str)
            # if not os.path.exists(directory):
            #     os.makedirs(directory)
            # count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
            # cv2.imwrite('CFD_cropped/{0}/training/level-1/{1}.jpg'.format(group_str, count), img)
            # cv2.imwrite('CFD_cropped/{0}/training/level-1/cropped_{1}'.format(group_name, filename), img)

            directory = 'CFD_cropped/{0}/daily-assessment'.format(group_str_2)
            if not os.path.exists(directory):
                os.makedirs(directory)
            count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
            # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
            cv2.imwrite('CFD_cropped/{0}/daily-assessment/{1}.jpg'.format(group_str_2, count), img)

            directory = 'CFD_cropped/{0}/pre-post-assessment'.format(group_str_2)
            if not os.path.exists(directory):
                os.makedirs(directory)
            count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
            cv2.imwrite('CFD_cropped/{0}/pre-post-assessment/{1}.jpg'.format(group_str_2, count), img)