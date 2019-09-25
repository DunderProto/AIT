// FileSystem.js
// =============
const moment = require('moment');

class FileSystem {
  // initialize with object that represents virtual file system
  // the remainder of the design of this class is up to you!
  constructor (obj) {
    this.obj = obj;
  }

  find(path) {
    let split = path.split('/');
    let toFind = split[split.length-1];
    let files = this.obj["fs"]["/"];
    if (split.length === 2 && split[0] === "" && split[1] === "") {
      return files;
    }
    files = files['files'];
    for (let i = 1; i < split.length; i++) {
          if(files[toFind]) {
            return files[toFind];
          } else {
            if (!files[split[i]]) {
              return undefined;
            }
            files = files[split[i]]['files'];
          }
    }
  }

  traverseAndList(path) {
    let found = this.find(path);
    let list = [];
    if (!found.hasOwnProperty('files')) {
      return list;
    } else {
      for (let prop in found['files']) {
        list.push(prop);
      }
    }
    return list;
  }

  makeDirectory(path, dirName) {
    let found = this.find(path);
    if (found['permission'][0] === 'd') {
      found['files'][dirName] = {
        "permission": "drwxr--r--",
        "hard-links": 1,
        "owner-name": "root",
        "owner-group": "root",
        "last-modified": moment().format('MMM DD HH:mm'),
        "size": 6,
        "files": {
        }
      }
    }
  }

  cat(path) {
    let found = this.find(path);
    if (found.hasOwnProperty('content')) {
      return found['content'];
    } else {
      return 'cat: No such file or directory'
    }
  }

  write(path, content) {
    let found = this.find(path);
    let arr = path.split('/');
    let toWrite = arr[arr.length-1];
    arr.pop();
    let newPath = arr.join("/");
    let newFound = this.find(newPath);
    if (found) {
      if (found['permission'][0] === '-') {
        found['content'] = content;
      }
    } else {
      if (newFound['permission'][0] === 'd') {
        newFound['files'][toWrite] = {
          "permission": "-rwxr--r--",
          "hard-links": 1,
          "owner-name": "root",
          "owner-group": "root",
          "last-modified": moment().format('MMM DD HH:mm'),
          "size": 6,
          "content": content
        }
      }
    }
  }
}

module.exports = {
  FileSystem
}