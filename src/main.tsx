import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConceptMap from './ConceptMap';
import ConceptPage from './ConceptPage';
import './index.css';

interface GraphData {
  clusters: Record<string, { color: string; emoji: string }>;
  concepts: any[];
}

function GraphPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/_graph.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setGraphData)
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-400">
        <div className="text-center">
          <p className="text-lg mb-2">Graphe non disponible</p>
          <p className="text-sm text-zinc-300">{error}</p>
          <p className="text-sm mt-4 text-zinc-300">
            Lancez <code className="bg-zinc-100 px-1 rounded">node scripts/generate_graph.js</code> pour générer <code>_graph.json</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-400">
        Chargement du graphe...
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Knowledge Graph</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {graphData.concepts.length} fiches · {Object.keys(graphData.clusters).length} clusters
        </p>
      </header>
      <ConceptMap graphData={graphData} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/concept/:slug" element={<ConceptPage />} />
        <Route path="/" element={<Navigate to="/graph" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
