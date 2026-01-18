export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: 'João',
      product: 'Vodka Absolut',
      type: 'Quebra',
      time: '22:15',
      typeColor: 'text-red-400'
    },
    {
      id: 2,
      user: 'Maria',
      product: 'Gin Tanqueray',
      type: 'Transferência',
      time: '21:45',
      typeColor: 'text-blue-400'
    },
    {
      id: 3,
      user: 'Pedro',
      product: 'Whisky Jameson',
      type: 'Entrada',
      time: '20:30',
      typeColor: 'text-green-400'
    },
    {
      id: 4,
      user: 'Ana',
      product: 'Cerveja Heineken',
      type: 'Transferência',
      time: '19:55',
      typeColor: 'text-blue-400'
    },
    {
      id: 5,
      user: 'Carlos',
      product: 'Tequila José Cuervo',
      type: 'Saída',
      time: '19:20',
      typeColor: 'text-yellow-400'
    }
  ];

  return (
    <div>
      <h2 className="text-xl mb-4">Atividade Recente</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Usuário</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Produto</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Tipo de Movimento</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Horário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">{activity.user}</td>
                <td className="px-6 py-4">{activity.product}</td>
                <td className="px-6 py-4">
                  <span className={activity.typeColor}>{activity.type}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
