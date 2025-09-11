'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'

const faqs = [
  {
    question: "¿Qué es ActivaChain?",
    answer: "ActivaChain es una plataforma educativa que enseña blockchain y Web3 a mujeres, sin necesidad de conocimientos previos. Te ayudamos a aprender, certificar tus habilidades y ganar dinero real."
  },
  {
    question: "¿Necesito saber de tecnología?",
    answer: "¡Para nada! Nuestros cursos están diseñados para principiantes. Te enseñamos desde cero, como si nunca hubieras usado una computadora."
  },
  {
    question: "¿Cómo puedo ganar dinero?",
    answer: "Una vez que aprendas, podés ofrecer servicios como desarrollo de contratos inteligentes, diseño UX, marketing digital, o consultoría. Nuestro marketplace conecta clientes con profesionales verificadas."
  },
  {
    question: "¿Qué son los NFTs?",
    answer: "Los NFTs son certificados digitales únicos que no se pueden copiar. Cuando completás un curso, recibís un NFT que prueba tus habilidades. Es como un diploma, pero imposible de falsificar."
  },
  {
    question: "¿Es seguro?",
    answer: "Sí, usamos tecnología blockchain que es súper segura. Tus datos están protegidos y todas las transacciones son transparentes y verificables."
  },
  {
    question: "¿Cuánto cuesta?",
    answer: "¡Es completamente gratis! No hay costos ocultos. Solo necesitás tiempo y ganas de aprender."
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
