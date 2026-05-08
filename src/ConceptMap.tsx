import { useEffect, useRef, useState } from 'react';

interface ClusterConfig {
  color: string;
  emoji: string;
}

interface ConceptNode {
  slug: string;
  title: string;
  summary: string;
  cluster: string;
  relatedConcepts: string[];
}

interface GraphData {
  clusters: Record<string, ClusterConfig>;
  concepts: ConceptNode[];
}

interface Props {
  graphData: GraphData;
}

export default function ConceptMap({ graphData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphInstanceRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState<ConceptNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = graphData.concepts.map(c => ({
      id: c.slug,
      name: c.title,
      summary: c.summary,
      cluster: c.cluster,
      color: graphData.clusters[c.cluster]?.color ?? '#888888',
    }));

    const nodeIds = new Set(nodes.map(n => n.id));
    const linkSet = new Set<string>();
    const links: { source: string; target: string }[] = [];
    graphData.concepts.forEach(c => {
      c.relatedConcepts.forEach(related => {
        if (!nodeIds.has(related)) return;
        const key = [c.slug, related].sort().join('--');
        if (!linkSet.has(key)) {
          linkSet.add(key);
          links.push({ source: c.slug, target: related });
        }
      });
    });

    import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (!containerRef.current) return;

      const graph = ForceGraph3D()(containerRef.current)
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .graphData({ nodes, links })
        .nodeLabel(() => '')
        .nodeColor((node: any) => node.color)
        .nodeVal(4)
        .nodeResolution(16)
        .linkColor(() => 'rgba(160,160,160,0.3)')
        .linkWidth(1)
        .onNodeHover((node: any) => {
          if (node) {
            const concept = graphData.concepts.find(c => c.slug === node.id);
            setHovered(concept ?? null);
          } else {
            setHovered(null);
          }
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? 'pointer' : 'default';
          }
        })
        .onNodeClick((node: any) => {
          window.open(`/concept/${node.id}`, '_blank', 'noopener');
        });

      graphInstanceRef.current = graph;

      setTimeout(() => {
        graph.zoomToFit(400, 80);
        setLoaded(true);
      }, 2000);
    });
  }, [graphData]);

  const handleRecenter = () => {
    if (graphInstanceRef.current) {
      graphInstanceRef.current.zoomToFit(400, 80);
    }
  };

  return (
    <div className="relative">
      {/* Cluster legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-xs font-medium text-zinc-500">Clusters :</p>
        {Object.entries(graphData.clusters).map(([name, config]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-xs text-zinc-600">
              {config.emoji} {name}
            </span>
          </div>
        ))}
      </div>

      {isMobile && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Le graphe est optimisé pour desktop. Sur mobile, la navigation peut être limitée.
        </div>
      )}

      <div className="relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm z-10 pointer-events-none">
            Chargement du graphe...
          </div>
        )}

        {loaded && (
          <button
            onClick={handleRecenter}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-zinc-200 text-xs text-zinc-600 hover:border-blue-400 transition-colors shadow-sm"
            title="Recentrer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
            </svg>
            Recentrer
          </button>
        )}

        <div
          ref={containerRef}
          className="w-full rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50"
          style={{ height: 'calc(100vh - 120px)' }}
        />

        {hovered && (
          <div className="absolute top-4 left-4 max-w-xs rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm p-4 shadow-lg pointer-events-none z-20">
            <p className="text-xs font-medium text-blue-600 mb-1">
              {graphData.clusters[hovered.cluster]?.emoji} {hovered.cluster}
            </p>
            <p className="text-sm font-semibold text-zinc-900 mb-1">{hovered.title}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{hovered.summary}</p>
            <p className="text-xs text-zinc-400 mt-2 italic">Cliquer pour ouvrir la fiche</p>
          </div>
        )}
      </div>
    </div>
  );
}
