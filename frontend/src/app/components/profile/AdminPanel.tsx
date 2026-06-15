import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { api, ApiSpot } from '../../api';

interface AdminPanelProps {
  onBack: () => void;
  onImport?: (config: { region: string; tags: string[] }) => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [unvalidatedSpots, setUnvalidatedSpots] = useState<ApiSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.spots.list()
      .then(spots => setUnvalidatedSpots(spots.filter(s => s.status === 'unvalidated' || s.status === 'user-created')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleModerate = async (spotId: string, action: 'validate' | 'reject') => {
    try {
      await api.spots.moderate(spotId, action);
      setUnvalidatedSpots(prev => prev.filter(s => s.id !== spotId));
      setMessage(action === 'validate' ? 'Spot freigegeben!' : 'Spot abgelehnt!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage('Fehler: ' + err.message);
    }
  };

  return (
    <div className="size-full overflow-y-auto bg-gray-50">
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="size-5" />
        </button>
        <Shield className="size-5 text-emerald-600" />
        <h1 className="font-semibold">Admin-Panel</h1>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        {/* Spot Moderation */}
        <Card className="p-4">
          <h2 className="font-bold mb-1">Spots moderieren</h2>
          <p className="text-sm text-gray-500 mb-4">Neue Spots freigeben oder ablehnen</p>

          {loading ? (
            <p className="text-center text-gray-500 py-4">Lädt...</p>
          ) : unvalidatedSpots.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="size-10 mx-auto mb-2 text-green-500" />
              <p className="text-gray-500">Keine ausstehenden Spots</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unvalidatedSpots.map(spot => (
                <div key={spot.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{spot.name}</h3>
                      <p className="text-xs text-gray-500">{spot.address}</p>
                      {spot.description && <p className="text-sm text-gray-600 mt-1">{spot.description}</p>}
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="size-3" />
                      Ausstehend
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {spot.equipment.map(eq => (
                      <span key={eq} className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{eq}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => handleModerate(spot.id, 'validate')}
                    >
                      <CheckCircle className="size-4 mr-1" />
                      Freigeben
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-500 border-red-300 hover:bg-red-50"
                      onClick={() => handleModerate(spot.id, 'reject')}
                    >
                      <XCircle className="size-4 mr-1" />
                      Ablehnen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
}
