# """
# Hierarchial Clustering.
# The goal of gist is to show to use scikit-learn to perform agglomerative clustering when:
# 1. There is a need for a custom distance metric (like levenshtein distance)
# 2. Use the distance in sklearn's API.
# Adapted from: sklearn's FAQ.
# http://scikit-learn.org/stable/faq.html
# """

# # Using editdistance package to calculate the levenhstein distance between strings.
# import editdistance as edist

# import numpy as np
# from sklearn.cluster import AgglomerativeClustering
# from sklearn.metrics.pairwise import pairwise_distances

# # Simple data (sample genome string).
# data = ["ACCTCCTAGAAG", "ACCTACTAGAAGTT", "GAATATTAGGCCGA"]

# # Custom distance metric and use editdistance.
# def lev_metric(x, y):
#     return int(edist.eval(data[int(x[0])], data[int(y[0])]))

# # Reshape the data.
# X = np.arange(len(data)).reshape(-1, 1)
# # print(X.shape)

# # Calculate pairwise distances with the new metric.
# m = pairwise_distances(X, X, metric=lev_metric)
# print("m = ", m)

# # Perform agglomerative clustering.
# # The affinity is precomputed (since the distance are precalculated).
# # Use an 'average' linkage. Use any other apart from  'ward'.
# agg = AgglomerativeClustering(n_clusters=2, affinity='precomputed',
#                               linkage='average')

# # Use the distance matrix directly.
# u = agg.fit_predict(m)
# print("u = ", u)
a = [1, 2, 3, 4, 4, 4, 4, 4, 5]
indices = [i for i, x in enumerate(a) if x == 4]
print(indices)