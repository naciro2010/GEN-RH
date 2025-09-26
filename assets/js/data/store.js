import { defaultData } from './defaults.js';

const STORAGE_KEY = 'atlas-hr-suite-data-v1';
const listeners = new Set();

const clone = (value) => structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const load = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = clone(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw);
    return { ...clone(defaultData), ...parsed };
  } catch (error) {
    console.warn('Impossible de parser les données, réinitialisation', error);
    const seed = clone(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

let state = load();

const notify = () => {
  const snapshot = getData();
  listeners.forEach((cb) => cb(snapshot));
  window.dispatchEvent(new CustomEvent('atlas-data-changed', { detail: snapshot }));
};

export const getData = () => clone(state);

export const subscribe = (cb) => {
  listeners.add(cb);
  cb(getData());
  return () => listeners.delete(cb);
};

export const setData = (updater) => {
  const draft = clone(state);
  const next = updater(draft) ?? draft;
  state = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
  return getData();
};

export const saveData = (next) => {
  state = clone(next);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
  return getData();
};

export const resetData = () => {
  state = clone(defaultData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
};

export const exportData = () => JSON.stringify(getData(), null, 2);

export const importData = (json) => {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') throw new Error('Format invalide');
    saveData({ ...clone(defaultData), ...parsed });
  } catch (error) {
    throw new Error('Impossible d\'importer les données: ' + error.message);
  }
};
