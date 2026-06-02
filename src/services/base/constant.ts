export const landingUrl: string = '/';
export const unitName: string = 'Căng Tin';
export const primaryColor: string = '#16a34a';

export enum EDinhDangFile {
  UNKNOWN = 'unknown',
  WORD = 'word',
  EXCEL = 'excel',
  POWERPOINT = 'powerpoint',
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
}

export const AppModules: Record<string, { url: string; name: string }> = {
  admin: { url: '/', name: 'Admin' },
};
