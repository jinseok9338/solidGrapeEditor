export enum StorageBackendType {
  LocalStorage = "localStorage",
  SessionStorage = "sessionStorage", // this is for the temporary storage
  custom = "custom", // this is for the custum backend storage
}

export class StorageBackend {
  storage: StorageBackendType;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;

  constructor(
    storage: StorageBackendType,
    storageMethod: {
      getItem(key: string): string | null;
      setItem(key: string, value: string): void;
      removeItem(key: string): void;
    }
  ) {
    this.storage = storage;
    this.getItem = storageMethod.getItem;
    this.setItem = storageMethod.setItem;
    this.removeItem = storageMethod.removeItem;
  }
}
