# face verification with the VGGFace2 model
from autocrop import *
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from scipy.spatial.distance import cosine
from mtcnn.mtcnn import MTCNN
from sklearn import cluster
from utils import preprocess_input
from vggface import VGGFace
import sys
import os
import cv2
import sklearn
from sklearn.cluster import AgglomerativeClustering
from matplotlib import pyplot as plt
from scipy.cluster.hierarchy import dendrogram
from sklearn.cluster import KMeans
from sklearn import manifold
import random

def plot_dendrogram(model, **kwargs):

    # Children of hierarchical clustering
    children = model.children_

    # Distances between each pair of children
    # Since we don't have this information, we can use a uniform one for plotting
    distance = np.arange(children.shape[0])

    # The number of observations contained in each cluster level
    no_of_observations = np.arange(2, children.shape[0]+2)

    # Create linkage matrix and then plot the dendrogram
    linkage_matrix = np.column_stack([children, distance, no_of_observations]).astype(float)

    # Plot the corresponding dendrogram
    dendrogram(linkage_matrix, **kwargs)
# extract a single face from a given photograph

def extract_face(filename, required_size=(500, 500)):
    img = plt.imread(filename)
    detector = MTCNN()
    results = detector.detect_faces(img)
    x1, y1, width, height = results[0]['box']
    x2, y2 = x1 + width, y1 + height
    # extract the face
    face = img[y1:y2, x1:x2]
    # resize pixels to the model size
    image = Image.fromarray(face)

    # -------
    # img_show = Image.fromarray(face, 'RGB')
    # # img.save('my.png')
    # img_show.show()
    # -------

    image = image.resize(required_size)
    
    
    face_array = np.asarray(image)
    # face_array = np.asarray(img)
    return face_array


# extract faces and calculate face embeddings for a list of photo files
def get_embeddings(filenames):
    # extract faces
    faces = [extract_face(f) for f in filenames]

    # convert into an array of samples
    samples = np.asarray(faces, 'float32')
    # prepare the face for the model, e.g. center pixels
    samples = preprocess_input(samples, version=2)

    model = VGGFace(model='resnet50', include_top=False, input_shape=(500, 500, 3), pooling='avg')
    pred = model.predict(samples)
    return pred


# determine if a candidate face is a match for a known face
def is_match(known_embedding, candidate_embedding, thresh=0.5):
    # calculate distance between embeddings
    score = cosine(known_embedding, candidate_embedding)
    
    # print('*****************************************************************')
    # print('Threshold for the face similarity score is 0.5')

    # if score <= thresh:
    #     print('Face is a Match with score of %.3f' % score)
    # else:
    #     print('Face is not a Match with score of %.3f' % score)

    # print('********************************************************************')

    return score

def main():
    files = []
    # for filepath, dirnames, filenames in os.walk(r'CFD_cropped/asian_female/training/level-1'):
    # for filepath, dirnames, filenames in os.walk(r'CFD_cropped/asian_female/test'):
    for filepath, dirnames, filenames in os.walk(r'CFD_cropped/asian/daily-assessment'):
        for filename in filenames:
                file = os.path.join(filepath, filename)
                #print(file)
                files.append(file)

    # shuffle the files to create random combinitions.
    random.shuffle(files)
    # print("length of files: ", len(files))
    
    embeddings = get_embeddings(files)
    # print(embeddings)
    # is_match(embeddings[0], embeddings[1])
    # is_match(embeddings[0], embeddings[2])

    #--------------
    # emb_mat = []
    # visied_mat = []
    # for emb_x in embeddings:
    #     emb_list = []
    #     visied_list = []
    #     for emb_y in embeddings:
    #         emb_list.append(is_match(emb_x, emb_y))
    #         visied_list.append(0)
    #     emb_mat.append(emb_list)
    #     visied_mat.append(visied_list)
    emb_mat = []
    # visited_mat = []
    for emb_x in embeddings:
        emb_list = []
        # visied_list = []
        for emb_y in embeddings:
            emb_list.append(is_match(emb_x, emb_y))
            # visied_list.append(0)
        emb_mat.append(emb_list)
        # visited_mat.append(visied_list)
    print("emb_mat: ", emb_mat)
    # print(sklearn.__version__)
    #--------------
    # Multidimensional scaling
    mds = manifold.MDS(n_components=2, dissimilarity="precomputed")
    results = mds.fit(emb_mat)
    coords = results.embedding_
    print("coords: ", coords)

    # K-means clustering
    kmeans = KMeans(n_clusters=8, random_state=0).fit(coords)
    print("kmeans.labels_: ", kmeans.labels_)
    visied_list = [0] * len(kmeans.labels_)
    print("kmeans.cluster_centers_: ", kmeans.cluster_centers_)

    # Building the levels.
    centers_dist_to_0 = []
    for i in kmeans.cluster_centers_:
        dist = np.linalg.norm(kmeans.cluster_centers_[0] - i)
        centers_dist_to_0.append(dist)
    print("centers_dist_to_0: ", centers_dist_to_0)
    sorted_centers_dist_to_0 = sorted(centers_dist_to_0, reverse = True)
    print("sorted_centers_dist_to_0: ", sorted_centers_dist_to_0)
    levels = []
    for i in sorted_centers_dist_to_0:
        levels.append(centers_dist_to_0.index(i))
    print("levels: ", levels)
    # Doing a agglomerative clustering
    # agg = AgglomerativeClustering(n_clusters=4, affinity='precomputed', linkage='average', distance_threshold=None, compute_distances=True)

    # # Use the distance matrix.
    # clustering = agg.fit(emb_mat)
    # print("clustering.labels_ = ", clustering.labels_)
    # print("clustering.children_ = ", clustering.children_)
    # print("clustering.distances_ = ", clustering.distances_)
    # # Draw a graph
    # plt.title('Hierarchical Clustering Dendrogram')
    # plot_dendrogram(clustering, labels=clustering.labels_)
    # plt.show()
    #--------------

    # move photos to corresponding level folders.
    for level in range(1, len(levels)):
        # Take one photo from group 0, and 7 others from corresponding groups.
        # print("Target level ", level)
        # photo from group 0.
        indices_1 = [i for i, x in enumerate(kmeans.labels_) if x == 0]
        # print("indices_1 =   ", indices_1)
        for idx in indices_1:
            if visied_list[idx] == 0:
                print("Picked the target photo: ", idx)
                dir_string = 'CFD_cropped/asian/training/level-' + str(level)
                directory = dir_string
                if not os.path.exists(directory):
                    os.makedirs(directory)
                count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
                image = cv2.imread(files[idx])
                temp = dir_string + '/{0}.jpg'
                cv2.imwrite(temp.format(count), image)
                visied_list[idx] = 1
                break

            # 7 photos from other group.
        indices_2 = [i for i, x in enumerate(kmeans.labels_) if x == levels[level - 1]] # photos indices in files
        # print("level folder: ", levels[level - 1])
        # print("indices_2 =   ", indices_2)
        total = 0 # use this to count how many photos have been moved
        for idx in indices_2:
            if visied_list[idx] == 0:
                print("Picked the mixup photo: ", idx)
                # create directory, move the qualified photos to level l
                # put files[idx] into level-l folder.
                dir_string = 'CFD_cropped/asian/training/level-' + str(level)
                directory = dir_string
                if not os.path.exists(directory):
                    os.makedirs(directory)
                count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
                # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
                # print("index_counter_1 = ", index_counter)
                image = cv2.imread(files[idx])
                temp = dir_string + '/{0}.jpg'
                cv2.imwrite(temp.format(count), image)

                total += 1
                visied_list[idx] = 1

            if total >= 7: # determine how many photos there are in one level.
                break

        
        # Backup-------------------------------------
        # # Take one photo from group 0, and 7 others from corresponding groups.
        # # print("Target level ", level)
        # for l in levels:
        #     # photo from group 0.
        #     indices_1 = [i for i, x in enumerate(kmeans.labels_) if x == 0]
        #     for idx in indices_1:
        #         if visied_list[idx] == 0:
        #             print("Picked the target photo: ", idx)
        #             dir_string = 'CFD_cropped/asian/training/level-' + str(level)
        #             directory = dir_string
        #             if not os.path.exists(directory):
        #                 os.makedirs(directory)
        #             count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
        #             image = cv2.imread(files[idx])
        #             temp = dir_string + '/{0}.jpg'
        #             cv2.imwrite(temp.format(count), image)
        #             visied_list[idx] = 1
        #             break

        #     # 7 photos from other group.
        #     indices_2 = [i for i, x in enumerate(kmeans.labels_) if x == l] # photos indices in files
        #     print("level folder: ", l)
        #     print("indices =   ", indices_2)
        #     total = 0 # use this to count how many photos have been moved
        #     for idx in indices_2:
        #         if visied_list[idx] == 0:
        #             print("Picked the mixup photo: ", idx)
        #             # create directory, move the qualified photos to level l
        #             # put files[idx] into level-l folder.
        #             dir_string = 'CFD_cropped/asian/training/level-' + str(level)
        #             directory = dir_string
        #             if not os.path.exists(directory):
        #                 os.makedirs(directory)
        #             count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
        #             # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
        #             # print("index_counter_1 = ", index_counter)
        #             image = cv2.imread(files[idx])
        #             temp = dir_string + '/{0}.jpg'
        #             cv2.imwrite(temp.format(count), image)

        #             total += 1
        #             visied_list[idx] = 1

        #         if total >= 7: # determine how many photos there are in one level.
        #             break



        # Aborted-------------------------------------
        # index_counter = 0

        # -------
        # image = cv2.imread(files[index_counter])
        # cv2.imshow("test_image", image)
        # cv2.waitKey(0)
        # -------

        # for sim_score in emb_mat[i]:
        #     # print(sim_score)
        #     if sim_score >= 0.25 and i == 0 and visited_mat[0][index_counter] == 0:# it should be classified in level 1, the pair is not very similar.
        #         # create directory, move the qualified photos to level 1
        #         # A set containing >8 photos. We will select 8 which are similar to each other from this set.
                
        #         directory = 'similarity/training/level-1'
        #         if not os.path.exists(directory):
        #             os.makedirs(directory)
        #         count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
        #         # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
        #         # print("index_counter_1 = ", index_counter)
        #         image = cv2.imread(files[index_counter])
        #         image = autocrop(image)
        #         cv2.imwrite('similarity/training/level-1/{0}.jpg'.format(count), image)
        #         visited_mat[0][index_counter] = 1
        #     elif sim_score >= 0.14 and i == 1 and visited_mat[1][index_counter] == 0: # contains more similar faces, threshold: 0.1~0.25
        #         # create directory, move the qualified photos to level 2
        #         directory = 'similarity/training/level-2'
        #         if not os.path.exists(directory):
        #             os.makedirs(directory)
        #         count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
        #         # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
        #         # print("index_counter_2 = ", index_counter)
        #         image = cv2.imread(files[index_counter])
        #         cv2.imwrite('similarity/training/level-2/{0}.jpg'.format(count), image)
        #         visited_mat[1][index_counter] = 1
        #     elif sim_score < 0.14 and i == 2 and visited_mat[2][index_counter] == 0:# contains most similar faces, threshold: < 0.1
        #         # create directory, move the qualified photos to level 3
        #         directory = 'similariity/training/level-3'
        #         if not os.path.exists(directory):
        #             os.makedirs(directory)
        #         count = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
        #         # cv2.imwrite('CFD_cropped/{0}/daily-assessment/cropped_{1}'.format(group_name, filename), img)
        #         # print("index_counter_3 = ", index_counter)
        #         image = cv2.imread(files[index_counter])
        #         cv2.imwrite('similarity/training/level-3/{0}.jpg'.format(count), image)
        #         visited_mat[2][index_counter] = 1
        #     index_counter += 1
        # Aborted-------------------------------------

if __name__ == '__main__':
    main()
