import * as sharp from 'sharp';
import { v4 } from 'uuid';
import {resolve} from 'path';

class Resize {
  folder: string;
  constructor(folder:string) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(400, 400, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${v4()}.png`;
  }
  filepath(filename:string) {
    return resolve(`${this.folder}/${filename}`)
  }
}
export default Resize;