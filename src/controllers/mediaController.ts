import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Media } from '../models/Media';
import { AuthRequest } from '../middleware/auth';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'images', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Upload failed' });
        }
        res.json({ success: true, url: result?.secure_url });
      }
    );
    stream.end(file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'videos', resource_type: 'video' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Upload failed' });
        }
        res.json({ success: true, url: result?.secure_url });
      }
    );
    stream.end(file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Admin: Upload and save media
export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = (req as any).file;
    const { title, description, category, type } = req.body;

    if (!file) {
      res.status(400).json({ success: false, message: 'Aucun fichier téléchargé' });
      return;
    }

    if (!type || !['image', 'video'].includes(type)) {
      res.status(400).json({ success: false, message: 'Type invalide' });
      return;
    }

    const resourceType = type === 'video' ? 'video' : 'image';
    
    const stream = cloudinary.uploader.upload_stream(
      { folder: type === 'video' ? 'videos' : 'images', resource_type: resourceType },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          res.status(500).json({ success: false, message: 'Échec du téléchargement' });
          return;
        }

        try {
          const media = await Media.create({
            id: `MEDIA-${Date.now()}`,
            type,
            url: result!.secure_url,
            title: title || '',
            description: description || '',
            category: category || '',
            isVisible: true
          });

          res.json({
            success: true,
            message: 'Média téléchargé avec succès',
            data: media
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
        }
      }
    );
    stream.end(file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du téléchargement' });
  }
};

// Get all media
export const getAllMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visible } = req.query;
    const where = visible === 'true' ? { isVisible: true } : {};
    
    const media = await Media.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: media,
      count: media.length
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des médias'
    });
  }
};

// Update media
export const updateMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, isVisible } = req.body;

    const media = await Media.findByPk(id);

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Média non trouvé'
      });
      return;
    }

    await media.update({
      title: title !== undefined ? title : media.title,
      description: description !== undefined ? description : media.description,
      category: category !== undefined ? category : media.category,
      isVisible: isVisible !== undefined ? isVisible : media.isVisible
    });

    res.json({
      success: true,
      message: 'Média mis à jour avec succès',
      data: media
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du média'
    });
  }
};

// Delete media
export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);

    if (!media) {
      res.status(404).json({
        success: false,
        message: 'Média non trouvé'
      });
      return;
    }

    await media.destroy();

    res.json({
      success: true,
      message: 'Média supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du média'
    });
  }
};