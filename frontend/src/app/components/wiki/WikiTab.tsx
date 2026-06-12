import { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { Card } from '../ui/card';
import { api, WikiExercise } from '../../api';

const DIFFICULTIES = ['Alle', 'Anfänger', 'Mittel', 'Fortgeschritten'];

const DIFFICULTY_COLOR: Record<string, string> = {
  'Anfänger': 'bg-green-100 text-green-700',
  'Mittel': 'bg-yellow-100 text-yellow-700',
  'Fortgeschritten': 'bg-red-100 text-red-700',
};

export function WikiTab() {
  const [exercises, setExercises] = useState<WikiExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('Alle');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.wiki.list({
      search: search || undefined,
      difficulty: difficulty !== 'Alle' ? difficulty : undefined,
    })
      .then(data => setExercises(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, difficulty]);

  return (
    <div className="size-full overflow-y-auto bg-gray-50">
      <div className="sticky top-0 bg-white border-b px-4 py-4 z-10">
        <h1 className="text-2xl font-bold mb-3">ÜBUNGS-WIKI</h1>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Übung suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                difficulty === d ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Lädt...</p>
        ) : exercises.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            <Dumbbell className="size-10 mx-auto mb-2 text-gray-300" />
            <p>Keine Übungen gefunden.</p>
          </Card>
        ) : (
          exercises.map((ex) => (
            <Card key={ex.id} className="overflow-hidden">
              <button
                className="w-full p-4 text-left"
                onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-emerald-600 flex items-center justify-center">
                      <Dumbbell className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{ex.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[ex.difficulty]}`}>
                          {ex.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{ex.muscle_group}</span>
                      </div>
                    </div>
                  </div>
                  {expanded === ex.id
                    ? <ChevronUp className="size-5 text-gray-400" />
                    : <ChevronDown className="size-5 text-gray-400" />
                  }
                </div>
              </button>

              {expanded === ex.id && (
                <div className="px-4 pb-4 border-t pt-3">
                  <p className="text-sm text-gray-700">{ex.description}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
