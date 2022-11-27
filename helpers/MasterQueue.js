const masterQueue = new Map();

class MasterQueue {
  getEntry(id) {
    return masterQueue.get(id);
  }
  setEntry(id, serverQ) {
    masterQueue.set(id, serverQ);
  }
  removeEntry(id) {
    masterQueue.delete(id);
  }
  contains(id) {
    return masterQueue.has(id);
  }
}

module.exports = new MasterQueue();
