import { prisma } from '@/config';
import { pagination } from '@/helpers/pagination';
import { ErrorHandler } from '@/helpers/response.handler';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

class CategoryService {
  async getAllData() {
    const propertiesWithCategories = await prisma.property.findMany({
      select: {
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
          },
        },
      },
      where: {
        deleted_at: null,
      },
    });

    const categoryCount = propertiesWithCategories.reduce(
      (acc, property) => {
        const categoryName = property.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            count: 0,
            id: property.category.id,
            name: categoryName,
            created_at: property.category.created_at,
          };
        }
        acc[categoryName].count += 1;
        return acc;
      },
      {} as Record<
        string,
        { count: number; id: number; name: string; created_at: Date }
      >,
    );

    // Convert to array and sort by count (descending)
    const sortedCategories = Object.values(categoryCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Get only top 10
      .map(({ id, name, created_at }) => ({ id, name, created_at }));

    return sortedCategories;
  }

  async getAllDataByUserId(req: Request) {
    const { search, page, limit } = req.query;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const data = await prisma.category.findMany({
      where: {
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        tenant_id: Number(user.id),
      },
      ...pagination(Number(page), Number(limit)),
    });

    return data;
  }

  async getDataById(id: string) {
    const data = await prisma.category.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        created_at: true,
      },
    });
    return data;
  }

  async createData(req: Request) {
    const { name } = req.body;
    console.log(name);
    const { authorization } = req.headers;
    
    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };
    
    return await prisma.category.create({
      data: {
        name,
        tenant_id: user.id,
      },
    });
  }

  async updateData(id: string, data: any) {
    const updatedData = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });
    return updatedData;
  }

  async deleteData(id: string) {
    const deletedData = await prisma.category.delete({
      where: { id: Number(id) },
    });
    return deletedData;
  }
}

export default new CategoryService();
