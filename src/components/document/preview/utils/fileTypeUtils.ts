
/**
 * Utility functions for determining file types
 */

export const isImageFile = (fileType?: string): boolean => {
  if (!fileType) return false;
  
  const lowerType = fileType.toLowerCase();
  return lowerType === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(lowerType);
};

export const isPdfFile = (fileType?: string): boolean => {
  if (!fileType) return false;
  return fileType.toLowerCase() === "pdf";
};

export const isWordFile = (fileType?: string): boolean => {
  if (!fileType) return false;
  return ["doc", "docx", "word"].includes(fileType.toLowerCase());
};

export const isPowerPointFile = (fileType?: string): boolean => {
  if (!fileType) return false;
  return ["ppt", "pptx", "powerpoint"].includes(fileType.toLowerCase());
};
