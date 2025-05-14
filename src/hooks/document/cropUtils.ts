
/**
 * Utility functions for image cropping
 */

/**
 * Generates a cropped image from the original image using canvas
 */
export const cropImage = (
  image: HTMLImageElement, 
  cropStartX: number, 
  cropStartY: number,
  cropWidth: number,
  cropHeight: number,
  documentUrl?: string
): string => {
  // Create a canvas element
  const canvas = window.document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  
  // Get the 2D context of the canvas
  const context = canvas.getContext('2d');
  if (!context) {
    console.error("Failed to get canvas context");
    return documentUrl || '';
  }
  
  // Calculate the actual coordinates on the image
  const imgRect = image.getBoundingClientRect();
  const scaleX = image.naturalWidth / imgRect.width;
  const scaleY = image.naturalHeight / imgRect.height;
  
  // Draw the cropped portion of the image onto the canvas
  try {
    context.drawImage(
      image,
      cropStartX * scaleX, 
      cropStartY * scaleY,
      cropWidth * scaleX, 
      cropHeight * scaleY,
      0, 
      0,
      cropWidth, 
      cropHeight
    );
    
    // Convert the canvas to a data URL and return it
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error("Error cropping image:", err);
    return documentUrl || '';
  }
};

/**
 * Determines if a document is an image based on its type
 */
export const isDocumentImage = (type?: string): boolean => {
  if (!type) return false;
  
  return type.toLowerCase() === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(type.toLowerCase());
};

/**
 * Creates a new figure object from cropped image data
 */
export const createFigureFromCrop = (
  document: any,
  croppedImageUrl: string
): { id: string, figure: any } => {
  const id = `figure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    figure: {
      id,
      title: `Figure from ${document.name}`,
      description: "",
      imageUrl: croppedImageUrl,
      sourceDocumentId: document.id,
      label: document.label // Inherit label from source document if available
    }
  };
};
