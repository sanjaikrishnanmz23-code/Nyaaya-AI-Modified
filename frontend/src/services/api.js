/**
 * NyaayaAI API Client
 * Connects React frontend to FastAPI backend.
 * Falls back to embedded static data if backend is unreachable.
 */

import {
  FALLBACK_SERVICES,
  FALLBACK_EMERGENCY,
  FALLBACK_SEARCH_INDEX,
} from './fallback';

const API_BASE = '/api';

// ─── Helper: detect if we're running with the backend ───────────────────────
let _backendAvailable = null;

async function checkBackend() {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

// ─── Chat (AI Q&A) ───────────────────────────────────────────────────────────
export async function askQuestion(question, language = 'both', sessionId = 'default-session') {
  const response = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language, session_id: sessionId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to get answer from NyaayaAI');
  }
  return response.json();
}

// ─── Rights Categories ────────────────────────────────────────────────────────
export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/rights/categories`);
  if (!response.ok) throw new Error('Failed to load rights categories');
  return response.json();
}

export async function fetchCategory(id) {
  const response = await fetch(`${API_BASE}/rights/${id}`);
  if (!response.ok) throw new Error('Failed to load category details');
  return response.json();
}

// ─── Government Services ──────────────────────────────────────────────────────
export async function fetchServices(category = 'all', q = '') {
  const live = await checkBackend();
  if (!live) {
    // Use embedded fallback data
    let data = FALLBACK_SERVICES;
    if (category && category !== 'all') {
      data = data.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (q && q.trim()) {
      const query = q.trim().toLowerCase();
      data = data.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.title_tamil.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }
    return data;
  }

  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (q) params.append('q', q);
  const response = await fetch(`${API_BASE}/services/?${params.toString()}`);
  if (!response.ok) return FALLBACK_SERVICES; // graceful fallback on error
  return response.json();
}

// ─── Problem Action Guides ────────────────────────────────────────────────────
export async function fetchProblems() {
  const response = await fetch(`${API_BASE}/actions/problems`);
  if (!response.ok) throw new Error('Failed to load guided problem workflows');
  return response.json();
}

// ─── Emergency Helplines ──────────────────────────────────────────────────────
export async function fetchEmergencyContacts() {
  const live = await checkBackend();
  if (!live) return FALLBACK_EMERGENCY;

  const response = await fetch(`${API_BASE}/emergency/contacts`);
  if (!response.ok) return FALLBACK_EMERGENCY; // graceful fallback on error
  return response.json();
}

// ─── Chat History ─────────────────────────────────────────────────────────────
export async function fetchHistory() {
  const response = await fetch(`${API_BASE}/history/`);
  if (!response.ok) throw new Error('Failed to load recent history');
  return response.json();
}

export async function clearHistoryApi() {
  const response = await fetch(`${API_BASE}/history/clear`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to clear history');
  return response.json();
}

// ─── Global Search ────────────────────────────────────────────────────────────
export async function globalSearch(q) {
  if (!q || !q.trim()) return { results: { rights: [], services: [], actions: [] }, total: 0 };

  const live = await checkBackend();
  if (!live) {
    // Use embedded search index
    const query = q.trim().toLowerCase();
    const matched = FALLBACK_SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.title_tamil.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
    const rights = matched.filter((i) => i.type === 'right');
    const services = matched.filter((i) => i.type === 'service');
    const actions = matched.filter((i) => i.type === 'action');
    return { query: q, results: { rights, services, actions }, total: matched.length };
  }

  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q.trim())}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}
