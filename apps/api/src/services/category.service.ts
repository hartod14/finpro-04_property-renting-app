import { prisma } from '@/config';
import { ErrorHandler } from '@/helpers/response.handler';

class CategoryService {
  async getAllData() {
    // Get all properties with their categories
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

    // Count occurrences of each category name
    const categoryCount = propertiesWithCategories.reduce((acc, property) => {
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
    }, {} as Record<string, { count: number, id: number, name: string, created_at: Date }>);

    // Convert to array and sort by count (descending)
    const sortedCategories = Object.values(categoryCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Get only top 10
      .map(({ id, name, created_at }) => ({ id, name, created_at }));

    return sortedCategories;
  }
}

export default new CategoryService(); 