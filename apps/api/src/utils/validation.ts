export const validateImage = (file: Express.Multer.File) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 1 * 1024 * 1024; // 1MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPG and PNG are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File is too large. Max size is 1MB.');
  }
};
