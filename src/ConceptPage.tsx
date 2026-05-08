import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';

interface Frontmatter {
  title?: string;
  cluster?: string;
  type?: string;
  status?: string;
  dateCreated?: string;
  related?: string[];
  citedBy?: string[];
  sources?: string[];
}

interface Note {
  slug: string;
  fm: Frontmatter;
  body: string;
  html: string;
}

function parseFrontmatter(content: string): { fm: Frontmatter; body: string } {
  if (!content.startsWith('---')) return { fm: {}, body: content };
  const parts = content.split('---');
  if (parts.length < 3) return { fm: {}, body: content };
  const body = parts.slice(2).join('---').trim();

  // Minimal YAML parser for known fields
  const fm: Frontmatter = {};
  let currentKey: string | null = null;
  let currentList: string[] | null = null;

  for (const line of parts[1].split('\n')) {
    const listMatch = line.match(/^  - (.+)$/);
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (listMatch && currentList !== null) {
      currentList.push(listMatch[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    if (keyMatch) {
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === '' || val === '[]') {
        (fm as any)[currentKey] = [];
        currentList = (fm as any)[currentKey];
      } else {
        (fm as any)[currentKey] = val.replace(/^["']|["']$/g, '');
        currentList = null;
      }
    }
  }

  return { fm, body };
}

async function loadNote(slug: string): Promise<Note | null> {
  const folders = ['concepts', 'books', 'authors', 'projects', 'articles'];
  for (const folder of folders) {
    try {
      const res = await fetch(`/notes/${folder}/${slug}.md`);
      if (!res.ok) continue;
      const content = await res.text();
      const { fm, body } = parseFrontmatter(content);
      const html = await marked(body);
      return { slug, fm, body, html };
    } catch {
      continue;
    }
  }
  return null;
}

export default function ConceptPage() {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    loadNote(slug).then(n => {
      setNote(n);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Chargement...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-zinc-500">Fiche <code>{slug}</code> introuvable.</p>
        <Link to="/graph" className="text-blue-600 hover:underline mt-4 inline-block">← Retour au graphe</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/graph" className="text-sm text-zinc-400 hover:text-zinc-700 mb-8 inline-block">← Graphe</Link>

      {note.fm.cluster && (
        <p className="text-xs font-medium text-blue-600 mb-2">{note.fm.cluster}</p>
      )}
      <h1 className="text-3xl font-bold text-zinc-900 mb-2">
        {note.fm.title || note.slug}
      </h1>
      {note.fm.dateCreated && (
        <p className="text-xs text-zinc-400 mb-8">{note.fm.dateCreated}</p>
      )}

      <div
        className="prose prose-zinc max-w-none"
        dangerouslySetInnerHTML={{ __html: note.html }}
      />

      {note.fm.related && note.fm.related.length > 0 && (
        <section className="mt-12 border-t border-zinc-100 pt-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Liens</h2>
          <div className="flex flex-wrap gap-2">
            {note.fm.related.map(ref => {
              const slug = ref.includes(':') ? ref.split(':')[1] : ref;
              return (
                <Link
                  key={ref}
                  to={`/concept/${slug}`}
                  className="px-3 py-1 rounded-full bg-zinc-100 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {slug}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {note.fm.citedBy && note.fm.citedBy.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Cité par</h2>
          <div className="flex flex-wrap gap-2">
            {note.fm.citedBy.map(ref => {
              const slug = ref.includes(':') ? ref.split(':')[1] : ref;
              return (
                <Link
                  key={ref}
                  to={`/concept/${slug}`}
                  className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 hover:border-blue-300 transition-colors"
                >
                  {slug}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
