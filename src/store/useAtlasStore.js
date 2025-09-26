import { create } from 'zustand';
import { defaultData } from '../data/defaultData';
import { deepClone } from '../utils/clone';
export const useAtlasStore = create((set, get) => ({
    data: deepClone(defaultData),
    initializedAt: new Date().toISOString(),
    ui: {
        excelMode: false
    },
    setData: (updater) => {
        const draft = deepClone(get().data);
        const result = updater(draft);
        set({ data: (result ?? draft) });
    },
    replaceData: (next) => set({ data: deepClone(next) }),
    reset: () => set({ data: deepClone(defaultData) }),
    exportData: () => JSON.stringify(get().data, null, 2),
    importData: (json) => {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Format JSON invalide');
        }
        set({ data: deepClone({ ...defaultData, ...parsed }) });
    },
    toggleExcelMode: () => {
        set((state) => ({
            ui: {
                excelMode: !state.ui.excelMode
            }
        }));
    }
}));
