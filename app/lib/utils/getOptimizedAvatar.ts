export function getOptimizedAvatar(url: string, size = 40) {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${size},h_${size},c_fill/`);
}
