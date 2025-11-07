import numpy as np


def std_pdf(x):
    return 1./np.sqrt(2*np.pi) * np.exp(-0.5 * x**2)


def pdf(x, mu, sigma):
    return 1./sigma * std_pdf((x - mu)/sigma)


def md_params(mus, sigmas, alphas):
    variance = np.sum(alphas * (sigmas**2 + mus**2)) - np.sum(alphas * mus)**2
    sum_mus = np.sum(alphas * mus)
    return sum_mus, variance


def mdg(x, means, stds, alphas):
    n = alphas[0] * pdf(x, means[0], stds[0])
    for i in range(1, alphas.shape[0]):
        n += alphas[i] * pdf(x, means[i], stds[i])
    return n
