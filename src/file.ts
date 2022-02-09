import fs from 'fs';
import Path from 'path';

export class File {
  /**
   * Returns true if the path is pointing to a folder.
   *
   * @param path
   */
  private static isDirectory(path: string): boolean {
    return fs.statSync(path).isDirectory();
  }

  /**
   * Returns true if the path is not pointing to a folder.
   *
   * @param path
   */
  private static isFile(path: string): boolean {
    return fs.statSync(path).isFile();
  }

  /**
   * Returns absolute paths of all directories at path.
   *
   * @param path
   */
  public static getDirectories(path: string): string[] {
    return fs
      .readdirSync(path)
      .map((name) => Path.join(path, name))
      .filter(File.isDirectory);
  }

  /**
   * Returns absolute paths of all files at path.
   *
   * @param path
   */
  public static getFiles(path: string): string[] {
    return fs
      .readdirSync(path)
      .map((name) => Path.join(path, name))
      .filter(File.isFile);
  }

  /**
   * Returns absolute paths of all files at path, and in subdirectories.
   *
   * @param path
   */
  public static getFilesRecursively(path: string): string[] {
    const dirs = File.getDirectories(path);
    const files = dirs
      .map((dir) => File.getFilesRecursively(dir)) // go through each directory
      .reduce((a, b) => a.concat(b), []); // map returns a 2d array (array of file arrays) so flatten
    return files.concat(File.getFiles(path));
  }

  /**
   * Returns the content of a file at path.
   *
   * @param path
   */
  public static readFile(path: string): string {
    return fs.readFileSync(path, 'utf-8').toString();
  }

  /**
   * Writes a file at path with provided data.
   *
   * @param path
   * @param data
   */
  public static writeFile(
    path: string,
    data: string | NodeJS.ArrayBufferView
  ): void {
    fs.mkdirSync(path.substring(0, path.lastIndexOf(Path.sep)), {
      recursive: true
    }); // Make sure the directory we are writing to exists.
    return fs.writeFileSync(path, data);
  }
}
