'use client'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">ActivaChain</h3>
            <p className="text-white/70">
              Cerrando la brecha de género en Web3 a través de educación y oportunidades económicas reales.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-white">Plataforma</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#learn" className="hover:text-white transition-colors">Aprender</a></li>
              <li><a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
              <li><a href="#governance" className="hover:text-white transition-colors">Gobernanza</a></li>
              <li><a href="#reputation" className="hover:text-white transition-colors">Reputación</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-white">Comunidad</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-white">Legal</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
          <p>&copy; 2025 ActivaChain. Desarrollado con ❤️ para ETH Uruguay 2025.</p>
          <p className="mt-2">
            Desarrollado por <a href="https://t.me/Vai0sx" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Vai0sx</a> • Hecho por el Equipo ActivaChain
          </p>
        </div>
      </div>
    </footer>
  )
}
