import * as Path from 'path';
import * as fs from 'fs';

export class File {
  private static isDirectory(path: string): boolean {
    return fs.statSync(path).isDirectory();
  }

  private static isFile(path: string): boolean {
    return fs.statSync(path).isFile();
  }

  public static getDirectories(path: string): string[] {
    return fs
      .readdirSync(path)
      .map((name) => Path.join(path, name))
      .filter(File.isDirectory);
  }

  public static getFiles(path: string): string[] {
    return fs
      .readdirSync(path)
      .map((name) => Path.join(path, name))
      .filter(File.isFile);
  }

  public static getFilesRecursively(path: string): string[] {
    const dirs = File.getDirectories(path);
    const files = dirs
      .map((dir) => File.getFilesRecursively(dir)) // go through each directory
      .reduce((a, b) => a.concat(b), []); // map returns a 2d array (array of file arrays) so flatten
    return files.concat(File.getFiles(path));
  }

  public static readFile(path: string): string {
    return fs.readFileSync(path, 'utf-8').toString();
  }

  public static writeFile(path: string, data: string | NodeJS.ArrayBufferView): void {
    fs.mkdirSync(path.substring(0, path.lastIndexOf('/')), { recursive: true }); // Make sure the directory we are writing to exists.
    return fs.writeFileSync(path, data);
  }
}
