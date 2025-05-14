
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
  try {
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
    
    // Check if image is fully loaded
    if (!image.complete || image.naturalWidth === 0) {
      console.error("Image is not fully loaded");
      throw new Error("Image is not fully loaded");
    }
    
    // Calculate the actual coordinates on the image
    const imgRect = image.getBoundingClientRect();
    const scaleX = image.naturalWidth / imgRect.width;
    const scaleY = image.naturalHeight / imgRect.height;
    
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
    return documentUrl || ''; // Return the original image URL as fallback
  }
};

/**
 * Determines if a document is an image based on its type
 */
export const isDocumentImage = (type?: string): boolean => {
  if (!type) return false;
  
  const lowerType = type.toLowerCase();
  return lowerType === "image" || 
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(lowerType);
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
      title: `Figure from ${document.name || "document"}`,
      description: "",
      imageUrl: croppedImageUrl,
      sourceDocumentId: document.id || "",
      label: document.label // Inherit label from source document if available
    }
  };
};
