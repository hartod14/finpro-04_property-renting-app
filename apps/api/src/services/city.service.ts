import { prisma } from '../config';

class CityService {
  async getAllData() {
    return await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export default new CityService();
