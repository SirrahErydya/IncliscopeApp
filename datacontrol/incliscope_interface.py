from incliscope.data import PresavedIllustrisDataset
from incliscope.models import PoolingCNN, MixedDensityGaussian
import torch
from torch import nn
from datacontrol.models import Galaxy
import sys

class DCMDN(nn.Module):
    """
    DCMDN model as a vanilla pytorch implementation.
    Predicts a Mixed Density Gaussian Distribution of possible inclination angles
    for a set of given galaxy images. The images are compressed by convolution.
    """
    def __init__(self,
                 input_size: int = 128,
                 num_channels: int = 3,
                 out_channels: int = 16,
                 hidden_dim: int = 128,
                 num_weights: int = 3,
                 output_size: int = 1,
                 sigma_min : float = 0.1):
        super().__init__()
        self.convolutions = PoolingCNN(input_size=input_size, num_channels=num_channels, out_channels=out_channels)
        self.latent_size = self.convolutions.output_size
        self.md_gaussian = MixedDensityGaussian(self.latent_size, hidden_dim, num_weights, output_size,
                                                    sigma_min=sigma_min)

    def forward(self, x):
        latent = self.convolutions(x).flatten(start_dim=1)
        weights, means, stddevs = self.md_gaussian(latent)

        return means, stddevs, weights


def make_db_entries(model_path, data_path):
    dataset = PresavedIllustrisDataset(data_path)
    model = DCMDN()
    model.load_state_dict(
        torch.load(model_path, map_location=torch.device('cpu'), weights_only=True)['state_dict']
    )

    for datapoint in dataset:
        id_str, img, incl_mean, incl_std = datapoint
        p_means, p_stds, p_weights = model(img.unsqueeze(0))

        galaxy_obj = Galaxy(
            name=id_str,
            image = '/media/productiondata/' + id_str + '.jpg',
            i_mean = incl_mean.item(),
            i_std = incl_std.item(),
            pred_mean = p_means.flatten().tolist(),
            pred_std = p_stds.flatten().tolist(),
            pred_alpha = p_weights.flatten().tolist()
        )
        galaxy_obj.save()

if __name__ == "__main__":
    m_path = "/home/sirrah/genoa_crps_adamw_16c.ckpt"
    d_path = "/home/sirrah/DATA/IncliscopeData/stars/spirals/test_presaved"
    make_db_entries(m_path, d_path)