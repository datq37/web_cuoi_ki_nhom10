export const buildUpLoadFile = async (file: File): Promise<string> => {
  return URL.createObjectURL(file);
};
