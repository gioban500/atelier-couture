import { Phone, Mail, MapPin, Clock } from 'react-feather';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#0F172A] py-20 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* TEXTE & INFOS */}
          <div>
            <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs font-medium mb-6">
              CONTACT
            </span>

            <h2 className="text-4xl font-serif font-bold text-white mb-6">
              Parlons de votre création
            </h2>

            <p className="text-slate-400 mb-8 leading-relaxed">
              Vous avez une question ou un projet ? Notre équipe vous répond rapidement pour discuter de vos envies.
            </p>

            {/* INFOS */}
            <div className="space-y-4 mb-8">
              {/* TELEPHONE */}
              <div className="flex gap-4">
                <Phone size={20} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm">Téléphone</p>
                  <a href="tel:+228XXXXXXXXX" className="text-white hover:text-[#D4AF37] transition font-medium">
                    +228 XX XX XX XX
                  </a>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex gap-4">
                <Mail size={20} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <a href="mailto:info@atelier.tg" className="text-white hover:text-[#D4AF37] transition font-medium">
                    info@atelier.tg
                  </a>
                </div>
              </div>

              {/* LOCALISATION */}
              <div className="flex gap-4">
                <MapPin size={20} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm">Localisation</p>
                  <p className="text-white">Lomé, Togo</p>
                </div>
              </div>

              {/* HORAIRES */}
              <div className="flex gap-4">
                <Clock size={20} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm">Horaires</p>
                  <p className="text-white">Lun-Ven: 9h-18h | Sam: 10h-16h</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a href="https://wa.me/228XXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition">
                Discuter sur WhatsApp
              </button>
            </a>
          </div>

          {/* MAP */}
          <div className="rounded-lg overflow-hidden h-96 border border-slate-700 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.3234567890!2d1.2317!3d6.1256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x101b3a5c5c5c5c5d%3A0x1234567890!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2stg!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation Atelier Couture"
            />
          </div>
        </div>
      </div>
    </section>
  );
}