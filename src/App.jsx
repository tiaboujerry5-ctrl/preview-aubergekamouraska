
import { useRef, useState, useEffect } from 'react'
import { cn } from './lib/utils'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Accordion from '@radix-ui/react-accordion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cva } from 'class-variance-authority'
import {
  ArrowRight, Phone, Mail, MapPin, ChevronDown, Menu, X, Star,
  Wifi, Wind, Truck, Coffee, Snowflake, Sunset, Mountain, ShoppingBag,
  BedDouble, Bed, CheckCircle2, Clock, CreditCard, Award
} from 'lucide-react'

// ─── Utilities ───────────────────────────────────────────────────────────────

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#c8860a] text-white hover:bg-[#b07509]',
        outline: 'border-2 border-[#c8860a] text-[#c8860a] bg-transparent hover:bg-[#c8860a] hover:text-white',
        ghost: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#2c5f2e]',
        green: 'bg-[#2c5f2e] text-white hover:bg-[#1e4420]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

function Button({ className, variant, size, children, onClick, type = 'button', ...props }) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function FadeUp({ children, delay = 0, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ label, title, subtitle, light = false }) {
  return (
    <FadeUp className="text-center mb-14">
      {label && (
        <span className={cn('text-sm font-semibold tracking-widest uppercase mb-3 inline-block', light ? 'text-[#c8860a]' : 'text-[#c8860a]')}>
          {label}
        </span>
      )}
      <h2 className={cn('text-3xl md:text-4xl font-bold leading-tight mb-4', light ? 'text-white' : 'text-[#2b2b2b]')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-lg max-w-2xl mx-auto', light ? 'text-white/80' : 'text-[#2b2b2b]/70')}>
          {subtitle}
        </p>
      )}
    </FadeUp>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl',
        type === 'success' ? 'bg-[#2c5f2e] text-white' : 'bg-red-600 text-white'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
    >
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  {
    label: 'Chambres', href: '#chambres', children: [
      { label: 'Suite Prestige King', href: '#chambres' },
      { label: 'Chambre Double Confort', href: '#chambres' },
    ]
  },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Restaurant', href: '#restaurant' },
  { label: 'Quoi faire', href: '#activites' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState('FR')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 z-50 w-full transition-colors duration-300',
          scrolled ? 'bg-[#2c5f2e]/95 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#accueil" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#c8860a] flex items-center justify-center shrink-0">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-white font-bold text-sm tracking-wide">Auberge</div>
                <div className="text-[#c8860a] font-bold text-sm tracking-wide">Kamouraska</div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link =>
                link.children ? (
                  <DropdownMenu.Root key={link.label}>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors">
                        {link.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="z-50 min-w-[200px] rounded-xl bg-white shadow-xl border border-gray-100 p-1.5 mt-2"
                        sideOffset={4}
                      >
                        {link.children.map(child => (
                          <DropdownMenu.Item key={child.label} asChild>
                            <a
                              href={child.href}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#2b2b2b] rounded-lg hover:bg-[#f5f0e8] hover:text-[#2c5f2e] font-medium cursor-pointer outline-none"
                            >
                              <BedDouble className="h-4 w-4 text-[#c8860a]" />
                              {child.label}
                            </a>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setLang(l => l === 'FR' ? 'EN' : 'FR')}
                className="text-white/70 hover:text-white text-sm font-medium px-2 py-1 border border-white/30 rounded-full hover:border-white/60 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {lang === 'FR' ? 'EN' : 'FR'}
              </button>
              <Button variant="default" size="sm" className="gap-1.5">
                Réserver <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#2c5f2e]/98 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                className="absolute top-6 right-6 text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#c8860a] flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Auberge Kamouraska</div>
                </div>
              </div>

              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                  className="text-2xl font-bold text-white hover:text-[#c8860a] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-4"
              >
                <Button variant="default" size="lg" className="gap-2">
                  Réserver une chambre <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -140])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section id="accueil" className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Paysage montagneux Kamouraska"
          className="w-full h-full object-cover object-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c5f2e]/70 via-[#2c5f2e]/50 to-[#2c5f2e]/80" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <Award className="h-4 w-4 text-[#c8860a]" />
              <span className="text-white text-sm font-medium">CITQ Certifié · Numéro 006274</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6"
            >
              L'Évasion Parfaite au{' '}
              <span className="text-[#c8860a]">Cœur du Kamouraska</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-white/85 leading-relaxed mb-10 max-w-xl"
            >
              20 chambres climatisées, spacieuses et confortables à Saint-Pascal — accès direct par l'autoroute 20, restaurant sur place, et une nature généreuse à portée de main.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="default" size="lg" className="gap-2 shadow-xl shadow-[#c8860a]/30">
                Réserver une chambre <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="gap-2">
                <Phone className="h-4 w-4" /> (418) 492-3135
              </Button>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              {['WiFi Gratuit', 'Stationnement Remorques', 'Restaurant 6h–20h', 'Dès 80$/nuit'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-white/80 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#c8860a]" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-6 w-6 text-white/60" />
      </motion.div>
    </section>
  )
}

// ─── Services / Rooms ─────────────────────────────────────────────────────────

const rooms = [
  {
    title: 'Suite Prestige King',
    description: 'Grand lit King ultra-confortable, climatisation individuelle, réfrigérateur, sèche-cheveux, fer à repasser — tout pour un séjour reposant en couple ou en solo.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    features: ['Grand lit King', 'Climatisation', 'WiFi Gratuit', 'Réfrigérateur'],
    badge: 'Plus populaire',
  },
  {
    title: 'Chambre Double Confort',
    description: 'Deux lits confortables, idéale pour les familles ou collègues en déplacement. Espace généreux, rangement pratique et toutes les commodités essentielles.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    features: ['2 lits doubles', 'Climatisation', 'WiFi Gratuit', 'Plancher céramique'],
    badge: 'Idéale familles',
  },
]

const amenities = [
  { icon: Wifi, title: 'WiFi Haute Vitesse', desc: 'Connexion sans fil gratuite dans toutes les chambres et espaces communs.' },
  { icon: Snowflake, title: 'Climatisation Individuelle', desc: 'Contrôle de température dédié dans chaque chambre pour votre confort optimal.' },
  { icon: Truck, title: 'Grand Stationnement', desc: 'Aire de stationnement spacieuse pouvant accueillir véhicules avec remorques.' },
  { icon: Coffee, title: 'Déjeuner Disponible', desc: 'Restaurant sur place ouvert dès 6h pour bien commencer votre journée.' },
  { icon: CreditCard, title: 'Paiement Flexible', desc: 'Visa, Mastercard et American Express acceptés. Appelez pour les tarifs.' },
  { icon: Phone, title: 'Appels Locaux Gratuits', desc: 'Appels locaux et numéros 1-800 sans frais inclus dans le séjour.' },
]

function RoomCard({ room, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(44,95,46,0.15)' }}
      className="rounded-2xl overflow-hidden border border-[#2c5f2e]/20 bg-[#f5f0e8] group cursor-pointer"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c5f2e]/60 to-transparent" />
        <span className="absolute top-4 left-4 bg-[#c8860a] text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {room.badge}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">{room.title}</h3>
        <p className="text-[#2b2b2b]/70 text-sm leading-relaxed mb-4">{room.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {room.features.map(f => (
            <span key={f} className="flex items-center gap-1 text-xs bg-[#2c5f2e]/10 text-[#2c5f2e] px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 className="h-3 w-3" /> {f}
            </span>
          ))}
        </div>
        <Button variant="green" size="sm" className="w-full gap-2">
          Voir la chambre <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}

function Services() {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  }
  const amenitiesRef = useRef(null)
  const amenitiesInView = useInView(amenitiesRef, { once: true, margin: '-60px' })

  return (
    <section id="chambres" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Hébergement"
          title="Nos Chambres & Commodités"
          subtitle="Des espaces soigneusement aménagés pour que vous vous sentiez chez vous, avec tout le confort moderne que vous méritez."
        />

        {/* Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
          {rooms.map((room, i) => (
            <RoomCard key={room.title} room={room} index={i} />
          ))}
        </div>

        {/* Amenities */}
        <div className="bg-[#f5f0e8] rounded-3xl p-10">
          <FadeUp className="text-center mb-10">
            <h3 className="text-2xl font-bold text-[#2b2b2b]">Toutes nos commodités incluses</h3>
            <p className="text-[#2b2b2b]/70 mt-2">Chaque chambre est équipée pour votre confort quotidien.</p>
          </FadeUp>
          <motion.div
            ref={amenitiesRef}
            variants={containerVariants}
            initial="hidden"
            animate={amenitiesInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {amenities.map(am => (
              <motion.div
                key={am.title}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(44,95,46,0.10)' }}
                className="flex gap-4 bg-white rounded-2xl p-5 border border-[#2c5f2e]/10"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2c5f2e]/10 flex items-center justify-center shrink-0">
                  <am.icon className="h-5 w-5 text-[#2c5f2e]" />
                </div>
                <div>
                  <div className="font-semibold text-[#2b2b2b] text-sm mb-1">{am.title}</div>
                  <div className="text-[#2b2b2b]/65 text-sm leading-relaxed">{am.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tarifs note */}
        <FadeUp delay={0.1} className="mt-10 text-center">
          <div id="tarifs" className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#2c5f2e] text-white rounded-2xl px-8 py-5">
            <div className="text-left">
              <div className="font-bold text-lg">Tarifs : 80$ – 200$ + taxes / nuit</div>
              <div className="text-white/80 text-sm">Varient selon la saison, la durée et le type de chambre</div>
            </div>
            <Button variant="ghost" size="default" className="gap-2 shrink-0">
              <Phone className="h-4 w-4" /> 1-888-449-3134
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Restaurant ───────────────────────────────────────────────────────────────

function Restaurant() {
  return (
    <section id="restaurant" className="py-24 bg-[#f5f0e8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <FadeUp>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
                  alt="Restaurant de l'Auberge Kamouraska"
                  className="w-full h-[480px] object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -right-4 bg-[#2c5f2e] text-white rounded-2xl p-5 shadow-xl"
              >
                <Clock className="h-5 w-5 text-[#c8860a] mb-2" />
                <div className="font-bold text-lg">6h – 20h</div>
                <div className="text-white/80 text-xs">7 jours sur 7</div>
              </motion.div>
            </div>
          </FadeUp>

          {/* Content */}
          <div>
            <FadeUp delay={0.1}>
              <span className="text-sm font-semibold tracking-widest uppercase text-[#c8860a] mb-3 inline-block">
                Sur place
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2b2b2b] leading-tight mb-6">
                La Table de l'Auberge
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-[#2b2b2b]/75 text-lg leading-relaxed mb-6">
                Notre restaurant familial licencié vous accueille du matin au soir avec une carte généreuse et des saveurs authentiques du Kamouraska. Poutine maison, brochettes de crevettes fraîches, menu à la carte en tout temps — et bien sûr, le déjeuner servi dès l'aube.
              </p>
              <p className="text-[#2b2b2b]/75 leading-relaxed mb-8">
                En semaine, profitez de notre menu du jour — une cuisine simple, généreuse et préparée avec soin, à prix doux.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="space-y-3 mb-8">
                {[
                  'Menu à la carte en tout temps',
                  'Déjeuner servi dès 6h00',
                  'Menu du jour en semaine',
                  'Restaurant licencié (alcool disponible)',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-[#2b2b2b]">
                    <CheckCircle2 className="h-5 w-5 text-[#2c5f2e] shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" size="lg" className="gap-2">
                  Réserver une table <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Phone className="h-4 w-4" /> (418) 492-3135
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Marie-Ève T.',
    location: 'Québec, QC',
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/AubergeKamouraska/7480560895793094902.cc/1',
    text: 'Un séjour absolument parfait ! La chambre était impeccable, silencieuse, et le restaurant sur place est une vraie perle. Personnel chaleureux et aux petits soins.',
    rating: 5,
  },
  {
    name: 'François B.',
    location: 'Montréal, QC',
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/AubergeKamouraska/159331194893633629.cc/1',
    text: 'Idéal pour une pause sur la route. Accès facile depuis l'A-20, stationnement pour notre remorque sans problème. On y retourne l'hiver pour la motoneige!',
    rating: 5,
  },
  {
    name: 'Sylvie & Marc R.',
    location: 'Lévis, QC',
    avatar: 'https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/AubergeKamouraska/8781054713641032285.cc/1',
    text: 'Rapport qualité-prix excellent. Les chambres sont propres, confortables, climatisées. Le déjeuner au restaurant est copieux. Vraiment recommendé.',
    rating: 5,
  },
]

function Testimonials() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-60px' })

  return (
    <section className="py-24 bg-[#2c5f2e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Témoignages"
          title="Ce que disent nos voyageurs"
          subtitle="Des milliers de séjours mémorables depuis 2012 — voici quelques mots de nos hôtes."
          light
        />

        <motion.div
          ref={containerRef}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[#c8860a] text-[#c8860a]" />
                ))}
              </div>
              <p className="text-white/85 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/60 text-xs">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Activities ───────────────────────────────────────────────────────────────

const activities = [
  {
    icon: Mountain,
    title: 'Visites Touristiques',
    description: 'Découvrez le patrimoine unique de la MRC de Kamouraska : musées, vieux villages, architecture ancestrale et panoramas époustouflants sur le fleuve.',
    color: '#2c5f2e',
  },
  {
    icon: ShoppingBag,
    title: 'Produits du Terroir',
    description: 'Les artisans et producteurs locaux vous accueillent : fromages fins, cidres, miels artisanaux — une découverte gustative à ne pas manquer.',
    color: '#c8860a',
  },
  {
    icon: Wind,
    title: 'Motoneige & Plein Air',
    description: 'Le sentier 557 part à proximité de l\'auberge. Explorez les vastes réseaux de la FCMQ pour des aventures hivernales inoubliables.',
    color: '#2c5f2e',
  },
  {
    icon: Sunset,
    title: 'Marche & Couchers de Soleil',
    description: 'Promenades en forêt, bords du fleuve Saint-Laurent, couchers de soleil flamboyants — la nature ici est généreuse et apaisante.',
    color: '#c8860a',
  },
]

function Activities() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-60px' })

  return (
    <section id="activites" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Explorer"
          title="Quoi Faire à Saint-Pascal?"
          subtitle="Notre équipe se fera un plaisir de vous orienter vers les meilleurs attraits de la région — à deux pas de votre chambre."
        />

        <motion.div
          ref={containerRef}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activities.map((act, i) => (
            <motion.div
              key={act.title}
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(44,95,46,0.12)' }}
              className="bg-[#f5f0e8] rounded-2xl p-7 border border-[#2c5f2e]/10 group cursor-default"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: act.color + '20' }}
              >
                <act.icon className="h-6 w-6" style={{ color: act.color }} />
              </div>
              <h3 className="font-bold text-[#2b2b2b] text-lg mb-3">{act.title}</h3>
              <p className="text-[#2b2b2b]/65 text-sm leading-relaxed">{act.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* External links note */}
        <FadeUp delay={0.2} className="mt-10 text-center">
          <p className="text-[#2b2b2b]/60 text-sm">
            Explorez aussi : Tourisme Kamouraska · Festival Bonjour la Visite · Expo Saint-Pascal · Tournoi Pascot
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#2b2b2b]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=80"
          alt="Auberge ambiance"
          className="w-full h-full object-cover opacity-25"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Prêt à Vivre un Séjour{' '}
            <span className="text-[#c8860a]">Tout Confort?</span>
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            Accès direct par l'autoroute 20, sortie 465. 20 chambres climatisées vous attendent à Saint-Pascal — réservez dès maintenant.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="default" size="lg" className="gap-2 shadow-xl shadow-[#c8860a]/30">
              Réserver une chambre <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" className="gap-2">
              <Phone className="h-4 w-4" /> 1-888-449-3134
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Input({ label, error, type = 'text', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-[#2b2b2b]">{label}</label>}
      <input
        type={type}
        className={cn(
          'w-full rounded-xl border border-[#2c5f2e]/30 bg-transparent px-4 py-3 text-sm',
          'placeholder:text-[#2b2b2b]/40 text-[#2b2b2b]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5f2e]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-xs text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Contact() {
  const [form, setForm] = useState({ nom: '', courriel: '', message: '' })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Le nom est requis.'
    if (!form.courriel.trim() || !/\S+@\S+\.\S+/.test(form.courriel)) e.courriel = 'Courriel invalide.'
    if (!form.message.trim() || form.message.length < 10) e.message = 'Le message doit contenir au moins 10 caractères.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setForm({ nom: '', courriel: '', message: '' })
    setToast({ message: 'Message envoyé! Nous vous répondrons sous 24h.', type: 'success' })
  }

  return (
    <section id="contact" className="py-24 bg-[#f5f0e8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Nous Joindre"
          title="Nous Contacter"
          subtitle="Une question sur votre séjour? Nous sommes là pour vous aider du lundi au dimanche."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <FadeUp>
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-[#2b2b2b] text-xl mb-6">Informations de contact</h3>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: 'Téléphone', values: ['(418) 492-3135', '1-888-449-3134 (sans frais)'] },
                    { icon: Mail, label: 'Courriel', values: ['bonjour@auberge-kamouraska.ca'] },
                    { icon: MapPin, label: 'Adresse', values: ['247, Chemin des Sommets', 'Saint-Pascal, QC, G0L 3Y0'] },
                  ].map(item => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2c5f2e]/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-[#2c5f2e]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#c8860a] uppercase tracking-wide mb-1">{item.label}</div>
                        {item.values.map(v => (
                          <div key={v} className="text-[#2b2b2b] font-medium">{v}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to arrive */}
              <div className="bg-[#2c5f2e] rounded-2xl p-6 text-white">
                <h4 className="font-bold mb-3 text-lg">Comment nous trouver</h4>
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  <strong className="text-white">En voiture :</strong> Autoroute 20, sortie 465 — entrée directe dans Saint-Pascal.
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  <strong className="text-white">En motoneige :</strong> Sentier 557, via les trails 5 ou 35. Grand stationnement pour remorques disponible.
                </p>
              </div>

              {/* CITQ badge */}
              <div className="flex items-center gap-3 border border-[#2c5f2e]/20 rounded-xl p-4 bg-white">
                <Award className="h-8 w-8 text-[#c8860a]" />
                <div>
                  <div className="font-bold text-[#2b2b2b] text-sm">Établissement Certifié CITQ</div>
                  <div className="text-[#2b2b2b]/60 text-xs">Numéro d'enregistrement : 006274</div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Form */}
          <FadeUp delay={0.15}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-[#2c5f2e]/10 space-y-5">
              <h3 className="font-bold text-[#2b2b2b] text-xl mb-6">Envoyez-nous un message</h3>
              <Input
                label="Nom complet"
                placeholder="Votre nom"
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                error={errors.nom}
              />
              <Input
                label="Courriel"
                type="email"
                placeholder="votre@courriel.com"
                value={form.courriel}
                onChange={e => setForm(f => ({ ...f, courriel: e.target.value }))}
                error={errors.courriel}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#2b2b2b]">Message</label>
                <textarea
                  placeholder="Votre message, question ou demande de réservation..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={5}
                  className={cn(
                    'w-full rounded-xl border border-[#2c5f2e]/30 bg-transparent px-4 py-3 text-sm resize-none',
                    'placeholder:text-[#2b2b2b]/40 text-[#2b2b2b]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5f2e]',
                    errors.message && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      className="text-xs text-red-500"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button type="submit" variant="default" size="lg" className="w-full gap-2">
                Envoyer le message <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const footerLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Chambres', href: '#chambres' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'Restaurant', href: '#restaurant' },
    { label: 'Quoi faire', href: '#activites' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="bg-[#2c5f2e] text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/15">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#c8860a] flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">Auberge Kamouraska</div>
                <div className="text-white/60 text-xs">Saint-Pascal, Québec</div>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed mb-5">
              Un havre de paix au cœur du Kamouraska — là où le confort rencontre l'authenticité québécoise.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Award className="h-4 w-4 text-[#c8860a]" />
              Certifié CITQ · No 006274
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="font-bold mb-5 text-sm tracking-widest uppercase text-[#c8860a]">Navigation</div>
            <ul className="space-y-3">
              {footerLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact quick */}
          <div>
            <div className="font-bold mb-5 text-sm tracking-widest uppercase text-[#c8860a]">Nous Joindre</div>
            <div className="space-y-4">
              <a href="tel:4184923135" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors group">
                <Phone className="h-4 w-4 text-[#c8860a]" />
                (418) 492-3135
              </a>
              <a href="tel:18884493134" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors group">
                <Phone className="h-4 w-4 text-[#c8860a]" />
                1-888-449-3134
              </a>
              <a href="mailto:bonjour@auberge-kamouraska.ca" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors group">
                <Mail className="h-4 w-4 text-[#c8860a]" />
                bonjour@auberge-kamouraska.ca
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="h-4 w-4 text-[#c8860a] shrink-0 mt-0.5" />
                247 Chemin des Sommets, Saint-Pascal, QC
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/45 text-xs">
          <span>© 2025 Auberge Kamouraska. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Tooltip.Provider>
      <div className="min-h-[100dvh] bg-white text-[#2b2b2b] font-serif overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Restaurant />
          <Testimonials />
          <Activities />
          <CTABanner />
          <Contact />
        </main>
        <Footer />
      </div>
    </Tooltip.Provider>
  )
}
