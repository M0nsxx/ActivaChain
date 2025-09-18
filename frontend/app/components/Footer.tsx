'use client'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold gradient-text">ActivaChain</h3>
            <p className="text-white/70 text-sm sm:text-base">
              Cerrando la brecha de género en Web3 a través de educación y oportunidades económicas reales.
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base">Plataforma</h4>
            <ul className="space-y-2 text-white/70 text-sm sm:text-base">
              <li><a href="#learn" className="hover:text-white transition-colors">Aprender</a></li>
              <li><a href="#marketplace" className="hover:text-white transition-colors">Mercado</a></li>
              <li><a href="#governance" className="hover:text-white transition-colors">Gobernanza</a></li>
              <li><a href="#reputation" className="hover:text-white transition-colors">Reputación</a></li>
            </ul>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base">Comunidad</h4>
            <ul className="space-y-2 text-white/70 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-bold text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-white/70 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-white/70">
          <p className="text-sm sm:text-base">&copy; 2025 ActivaChain. Desarrollado con ❤️ para ETH Uruguay 2025.</p>
          <p className="mt-2 text-xs sm:text-sm">
            Desarrollado por <a href="https://t.me/Vaiosx" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Vaiosx</a> • Hecho por el Equipo ActivaChain
          </p>
        </div>
      </div>
    </footer>
  )
}
