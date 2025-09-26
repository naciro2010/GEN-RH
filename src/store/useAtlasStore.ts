import { create } from 'zustand';
import { defaultData, type AtlasData } from '../data/defaultData';
import { deepClone } from '../utils/clone';

type Updater<T> = (draft: T) => void | T;

type AtlasStore = {
  data: AtlasData;
  initializedAt: string;
  setData: (updater: Updater<AtlasData>) => void;
  replaceData: (next: AtlasData) => void;
  reset: () => void;
  exportData: () => string;
  importData: (json: string) => void;
  ui: {
    excelMode: boolean;
  };
  toggleExcelMode: () => void;
};

export const useAtlasStore = create<AtlasStore>((set, get) => ({
  data: deepClone(defaultData),
  initializedAt: new Date().toISOString(),
  ui: {
    excelMode: false
  },
  setData: (updater) => {
    const draft = deepClone(get().data);
    const result = updater(draft);
    set({ data: (result ?? draft) as AtlasData });
  },
  replaceData: (next) => set({ data: deepClone(next) }),
  reset: () => set({ data: deepClone(defaultData) }),
  exportData: () => JSON.stringify(get().data, null, 2),
  importData: (json) => {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Format JSON invalide');
    }
    set({ data: deepClone({ ...defaultData, ...parsed }) as AtlasData });
  },
  toggleExcelMode: () => {
    set((state) => ({
      ui: {
        excelMode: !state.ui.excelMode
      }
    }));
  }
}));
