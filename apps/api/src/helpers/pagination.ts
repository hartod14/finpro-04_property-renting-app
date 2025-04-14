export const pagination = (page: number, limit: number) => {
  const skip = !page || !limit || page < 1 ? undefined : (page - 1) * limit;
  const take = !limit || limit < 1 ? undefined : limit;

  return {
    skip,
    take
  };
};
