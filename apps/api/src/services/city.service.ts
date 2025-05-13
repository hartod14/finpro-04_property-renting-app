import { prisma } from '../config';

class CityService {
  async getAllData() {
    return await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
      
    });
  }
}

export default new CityService();
