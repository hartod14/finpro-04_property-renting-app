import { prisma } from '@/config';
import { pagination } from '@/helpers/pagination';
import { ErrorHandler } from '@/helpers/response.handler';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

class TenantCategoryService {
  async getAllData(req: Request) {
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
        deleted_at: null,
      },
      ...pagination(Number(page), Number(limit)),
    });

    const total = await prisma.category.count({
      where: {
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        tenant_id: Number(user.id),
        deleted_at: null,
      },
    });

    return { data, total };
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
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    return await prisma.category.create({
      data: {
        name,
        tenant_id: Number(user.id),
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

export default new TenantCategoryService();
