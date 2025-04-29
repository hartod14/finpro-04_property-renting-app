import { prisma } from '@/config';
import { ErrorHandler } from '@/helpers/response.handler';

class CategoryService {
  async getAllData() {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        created_at: true,
      },
      where: {
        deleted_at: null,
      },
    });
  }
}

export default new CategoryService(); 