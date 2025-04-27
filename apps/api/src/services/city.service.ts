import { prisma } from '@/config';
import { ErrorHandler } from '@/helpers/response.handler';

class CityService {
  async getAllData(req: Request) {
    return await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}

export default new CityService();
