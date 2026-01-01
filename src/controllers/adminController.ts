import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Reservation } from '../models/Reservation';
import { Media } from '../models/Media';
import { generateToken, revokeToken, AuthRequest } from '../middleware/auth';

// Admin login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Mot de passe requis'
      });
      return;
    }

    // Check if password matches
    if (password !== 'booststudio2024') {
      res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
      return;
    }

    // Generate token without DB operations
    const token = generateToken('ADMIN-1');

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        admin: {
          id: 'ADMIN-1',
          username: 'admin'
        }
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// Admin logout
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      revokeToken(token);
    }
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion'
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalReservations = await Reservation.count();
    const pendingReservations = await Reservation.count({ where: { status: 'pending' } });
    const confirmedReservations = await Reservation.count({ where: { status: 'confirmed' } });
    const completedReservations = await Reservation.count({ where: { status: 'completed' } });
    const cancelledReservations = await Reservation.count({ where: { status: 'cancelled' } });
    const totalMedia = await Media.count();
    const totalImages = await Media.count({ where: { type: 'image' } });
    const totalVideos = await Media.count({ where: { type: 'video' } });

    // Get recent reservations
    const recentReservations = await Reservation.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Calculate revenue (example calculation)
    const baseRates: Record<string, number> = {
      studio: 25000,
      clip_video: 35000,
      photographie: 30000,
      evenement: 40000
    };

    const locationMultipliers: Record<string, number> = {
      studio: 1,
      exterieur: 1.2,
      domicile: 1.3
    };

    const completedRes = await Reservation.findAll({ where: { status: 'completed' } });
    const totalRevenue = completedRes.reduce((sum, res) => {
      const base = baseRates[res.serviceType] || 0;
      const multiplier = locationMultipliers[res.location] || 1;
      return sum + (base * res.duration * multiplier);
    }, 0);

    res.json({
      success: true,
      data: {
        reservations: {
          total: totalReservations,
          pending: pendingReservations,
          confirmed: confirmedReservations,
          completed: completedReservations,
          cancelled: cancelledReservations
        },
        media: {
          total: totalMedia,
          images: totalImages,
          videos: totalVideos
        },
        revenue: {
          total: totalRevenue
        },
        recentReservations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};