import { Directory, File, Paths } from "expo-file-system";

export function storePhoto(uri: string) {
  const directory = new Directory(Paths.document, "crime-photos");
  directory.create({ idempotent: true, intermediates: true });
  if (uri.startsWith(directory.uri)) return uri;
  const source = new File(uri);
  const photo = new File(directory, `${Date.now()}${source.extension || ".jpg"}`);
  source.copy(photo);
  return photo.uri;
}
