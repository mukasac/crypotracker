import Image from 'next/image'

export function AppIntegrations() {
  const apps = [
    { name: "Coinbase", logo: "/coinbase-logo.png" },
    { name: "Binance", logo: "/binance-logo.png" },
    { name: "Robinhood", logo: "/robinhood-logo.png" },
    { name: "Kraken", logo: "/kraken-logo.png" },
    { name: "Gemini", logo: "/gemini-logo.png" },
  ]

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-6">
          {apps.map((app) => (
            <div key={app.name} className="text-center">
              <Image
                src={app.logo}
                alt={`${app.name} logo`}
                width={40}
                height={40}
                className="mx-auto mb-2 opacity-70 hover:opacity-100 transition-opacity"
              />
              <p className="text-sm text-indigo-300">{app.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

