import { StorageBackendInterface } from "./type";
import { hasWindow } from "../utils/consts";

// this is the implementation of the local storage
export class LocalStorageClass implements StorageBackendInterface {
  keyPrefix: string;
  localStorage: typeof window.localStorage | undefined;

  constructor(keyPrefix: string = "solid-grapesjs") {
    this.keyPrefix = keyPrefix;
    this.localStorage = hasWindow ? window.localStorage : undefined;
  }

  getItem() {
    if (this.localStorage) {
      return this.localStorage.getItem(this.keyPrefix);
    }
    console.warn("localStorage is not available");
    return null;
  }

  setItem(value: string) {
    if (this.localStorage) {
      this.localStorage.setItem(this.keyPrefix, value);
      return;
    }
    console.warn("localStorage is not available");
  }

  removeItem() {
    if (this.localStorage) {
      this.localStorage.removeItem(this.keyPrefix);
      return;
    }
    console.warn("localStorage is not available");
  }

  clear() {
    if (this.localStorage) {
      this.localStorage.clear();
      return;
    }
    console.warn("localStorage is not available");
  }
}
