import { Admin } from '../models/Admin';

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      await Admin.create({
        id: 'ADMIN-1',
        username: 'admin',
        password: 'booststudio2024',
      });
      console.log('✅ Admin user created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};