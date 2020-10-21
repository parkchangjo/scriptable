// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

function Cache(name) {
  this.fm = FileManager.iCloud();
  this.cachePath = this.fm.joinPath(this.fm.documentsDirectory(), name);

  if (!this.fm.fileExists(this.cachePath)) {
    this.fm.createDirectory(this.cachePath)
  }
}

Cache.prototype.read = async function(key) {
  try {
    const path = this.fm.joinPath(this.cachePath, key);
    await this.fm.downloadFileFromiCloud(path);
    const createdAt = this.fm.creationDate(path);
    
    if ((new Date()) - createdAt > 300000) {
      this.fm.remove(path);
      return null;
    }
    
    const value = this.fm.readString(path);
  
    try {
      return JSON.parse(value);
    } catch(error) {
      return value;
    }
  } catch(error) {
    return null;
  }
};

Cache.prototype.write = function(key, value) {
  const path = this.fm.joinPath(this.cachePath, key.replace('/', '-'));
  console.log(`Caching to ${path}...`);

  if (typeof value === 'string' || value instanceof String) {
    this.fm.writeString(path, value);
  } else {
    this.fm.writeString(path, JSON.stringify(value));
  }
}

module.exports = Cache;
