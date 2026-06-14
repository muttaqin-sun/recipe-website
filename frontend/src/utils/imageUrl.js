const BASE_URL = 'http://127.0.0.1:5000';

export function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return BASE_URL + imagePath;
}
