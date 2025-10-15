'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'

const faqs = [
  {
    question: "¿Qué es ActivaChain?",
    answer: "ActivaChain es una plataforma híbrida innovadora que combina educación blockchain con gestión de eventos Web3. Ofrecemos cursos, workshops, eventos comunitarios y un marketplace de NFTs, todo integrado con tecnología blockchain para crear oportunidades económicas reales."
  },
  {
    question: "¿Necesito saber de tecnología?",
    answer: "¡Para nada! Nuestros cursos están diseñados para principiantes. Te enseñamos desde cero, como si nunca hubieras usado una computadora. Tenemos contenido básico gratuito y cursos premium para todos los niveles."
  },
  {
    question: "¿Cómo puedo ganar dinero?",
    answer: "Ofrecemos múltiples formas de ganar: servicios como desarrollo de contratos inteligentes, diseño UX, marketing digital, consultoría, creación de NFTs, participación en workshops premium, y nuestro marketplace conecta clientes con profesionales verificadas. También puedes ganar tokens $ACTIVA por participación activa."
  },
  {
    question: "¿Qué son los NFTs?",
    answer: "Los NFTs son certificados digitales únicos que no se pueden copiar. Cuando completás un curso, recibís un NFT que prueba tus habilidades. También puedes crear, mintear y comercializar NFTs en nuestro marketplace con comisiones competitivas del 3%."
  },
  {
    question: "¿Es seguro?",
    answer: "Sí, usamos tecnología blockchain que es súper segura. Tus datos están protegidos, todas las transacciones son transparentes y verificables, y implementamos las mejores prácticas de seguridad Web3."
  },
  {
    question: "¿Cuánto cuesta?",
    answer: "Ofrecemos un modelo flexible: Plan Gratuito con cursos básicos y 2 eventos por mes, Plan Pro ($29.99/mes) con contenido premium ilimitado, y Plan Enterprise ($99.99/mes) para organizaciones. También workshops premium ($25-150) y certificaciones ($75-200)."
  },
  {
    question: "¿Qué es el token $ACTIVA?",
    answer: "$ACTIVA es nuestro token nativo que permite staking para descuentos, governance para decisiones de la plataforma, y recompensas por participación activa. Es parte de nuestro ecosistema tokenómico único que incentiva el aprendizaje y la participación."
  },
  {
    question: "¿Qué incluye el Plan Pro?",
    answer: "El Plan Pro ($29.99/mes) incluye: todo lo del plan gratuito, cursos premium ilimitados, workshops premium, certificaciones incluidas, marketplace NFTs con descuentos, y acceso a eventos exclusivos. Es perfecto para profesionales Web3."
  },
  {
    question: "¿Puedo organizar eventos?",
    answer: "¡Sí! Puedes crear workshops y eventos tanto gratuitos como premium. Los eventos privados tienen tarifas de $5-15 por participante. También ofrecemos eventos corporativos privados para organizaciones con análisis avanzados y soporte prioritario."
  },
  {
    question: "¿Cómo funciona el marketplace?",
    answer: "Nuestro marketplace permite crear, mintear y vender NFTs con una comisión del 3% por venta. Los usuarios Pro obtienen descuentos especiales. Es una plataforma completa para monetizar tu creatividad digital."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Preguntas <span className="gradient-text">Frecuentes</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Todo lo que necesitas saber sobre ActivaChain
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <GlassCard 
              key={index} 
              className="p-6 cursor-pointer transition-all duration-300 hover:scale-102"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                  <div className={`text-2xl transition-transform duration-300 ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}>
                    +
                  </div>
                </div>
                
                {openIndex === index && (
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
